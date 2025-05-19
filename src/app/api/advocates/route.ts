import { NextResponse, NextRequest } from 'next/server';
import db from "@/db";
import { advocates } from "@/db/schema";
import { Advocate } from "@/types/advocates";
import { desc, getTableColumns, sql } from "drizzle-orm";

const CACHE_DURATION = 300;

type ResponseData = {
  data: Advocate[],
  total: number,
  pageSize: number,
  currentPage: number,
  totalPages: number,
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * pageSize;

    if (!query) {
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(advocates);

      const data = await db
        .select()
        .from(advocates)
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
      const [{ count }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(advocates)
        .where(sql`${advocates.phoneNumber} = ${BigInt(query)}`);

      const data = await db
        .select()
        .from(advocates)
        .where(sql`${advocates.phoneNumber} = ${BigInt(query)}`)
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

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(advocates)
      .where(sql`${searchVector} @@ ${searchQuery}`);

    const data = await db
      .select({
        ...getTableColumns(advocates),
        rank: sql<number>`ts_rank(${searchVector}, ${searchQuery}) as rank`,
      })
      .from(advocates)
      .where(sql`${searchVector} @@ ${searchQuery}`)
      .orderBy(desc(sql`rank`))
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
