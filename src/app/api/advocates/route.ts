import { NextResponse, NextRequest } from 'next/server';
import db from "@/db";
import { advocates } from "@/db/schema";
import { Advocate } from "@/types/advocates";
import { desc, getTableColumns, sql, gte, lte, eq, like, SQL } from "drizzle-orm";

const CACHE_DURATION = 300;

type ResponseData = {
  data: Advocate[],
  total: number,
  pageSize: number,
  currentPage: number,
  totalPages: number,
};

type FilterOperator = 'gte' | 'lte' | 'eq' | 'like';
type FilterCondition = {
  field: string;
  operator: FilterOperator;
  value: string | number;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const filtersParam = searchParams.get('filters');
    let pageSize = parseInt(searchParams.get('pageSize') || '10');
    pageSize = pageSize <= 0 ? 10 : pageSize;
    let page = parseInt(searchParams.get('page') || '1');
    page = page <= 0 ? 1 : page;
    const offset = (page - 1) * pageSize;

    // Parse and validate filters
    let conditions: SQL[] = [];
    if (filtersParam) {
      try {
        const filters: FilterCondition[] = JSON.parse(filtersParam);
        
        filters.forEach(filter => {
          switch (filter.field) {
            case 'yearsOfExperience':
              if (filter.operator === 'gte') {
                conditions.push(gte(advocates.yearsOfExperience, Number(filter.value)));
              } else if (filter.operator === 'lte') {
                conditions.push(lte(advocates.yearsOfExperience, Number(filter.value)));
              } else if (filter.operator === 'eq') {
                conditions.push(eq(advocates.yearsOfExperience, Number(filter.value)));
              }
              break;
            case 'city':
              if (filter.operator === 'eq') {
                conditions.push(eq(advocates.city, String(filter.value)));
              } else if (filter.operator === 'like') {
                conditions.push(like(advocates.city, `%${filter.value}%`));
              }
              break;
            case 'degree':
              if (filter.operator === 'eq') {
                conditions.push(eq(advocates.degree, String(filter.value)));
              } else if (filter.operator === 'like') {
                conditions.push(like(advocates.degree, `%${filter.value}%`));
              }
              break;
            case 'specialties':
              if (filter.operator === 'like') {
                conditions.push(like(advocates.specialties, `%${filter.value}%`));
              }
              break;
          }
        });
      } catch (error) {
        console.error('Failed to parse filters:', error);
        return NextResponse.json(
          { error: 'Invalid filters format' },
          { status: 400 }
        );
      }
    }

    if (!query) {
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(advocates)
        .where(conditions.length > 0 ? sql`${sql.join(conditions, sql` AND `)}` : undefined);

      const data = await db
        .select()
        .from(advocates)
        .where(conditions.length > 0 ? sql`${sql.join(conditions, sql` AND `)}` : undefined)
        .orderBy(desc(advocates.id))
        .limit(pageSize)
        .offset(offset);

      const response = NextResponse.json<ResponseData>({ 
        data,
        total: Number(count),
        pageSize,
        currentPage: page,
        totalPages: Math.ceil(Number(count) / pageSize)
      }, { status: 200 });

      response.headers.set(
        'Cache-Control',
        `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`
      );

      return response;
    }

    const isPhoneNumber = /^\d+$/.test(query);
    
    if (isPhoneNumber) {
      // Search by phone number using exact match
      const phoneCondition = sql`${advocates.phoneNumber} = ${BigInt(query)}`;
      const allConditions = conditions.length > 0 
        ? sql`${phoneCondition} AND ${sql.join(conditions, sql` AND `)}`
        : phoneCondition;

      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(advocates)
        .where(allConditions);

      const data = await db
        .select()
        .from(advocates)
        .where(allConditions)
        .limit(pageSize)
        .offset(offset);

      const response = NextResponse.json<ResponseData>({ 
        data,
        total: Number(count),
        pageSize,
        currentPage: page,
        totalPages: Math.ceil(Number(count) / pageSize)
      }, { status: 200 });

      response.headers.set(
        'Cache-Control',
        `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`
      );

      return response;
    }

    // Full-text search for non-phone number queries
    const searchQuery = sql`websearch_to_tsquery('english', ${query})`;
    const searchVector = sql`(
      setweight(to_tsvector('english', ${advocates.firstName}), 'A') ||
      setweight(to_tsvector('english', ${advocates.lastName}), 'A') ||
      setweight(to_tsvector('english', ${advocates.city}), 'B') ||
      setweight(to_tsvector('english', ${advocates.specialties}::text), 'C')
    )`;

    const searchCondition = sql`${searchVector} @@ ${searchQuery}`;
    const allConditions = conditions.length > 0 
      ? sql`${searchCondition} AND ${sql.join(conditions, sql` AND `)}`
      : searchCondition;

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(advocates)
      .where(allConditions);

    const data = await db
      .select({
        ...getTableColumns(advocates),
        rank: sql<number>`ts_rank(${searchVector}, ${searchQuery}) as rank`,
      })
      .from(advocates)
      .where(allConditions)
      .orderBy(desc(sql`rank`), desc(advocates.id))
      .limit(pageSize)
      .offset(offset);
    
    const response = NextResponse.json<ResponseData>({ 
      data,
      total: Number(count),
      pageSize,
      currentPage: page,
      totalPages: Math.ceil(Number(count) / pageSize)
    }, { status: 200 });

    response.headers.set(
      'Cache-Control',
      `public, s-maxage=${CACHE_DURATION}, stale-while-revalidate=${CACHE_DURATION * 2}`
    );

    return response;
  } catch (error) {
    console.error('Failed to fetch advocates:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch advocates',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
