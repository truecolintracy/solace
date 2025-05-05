import { NextResponse } from 'next/server';
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function GET() {
  try {
    // Uncomment this line to use a database
    // const data = await db.select().from(advocates);

    const data = advocateData;
    return NextResponse.json({ data }, { status: 200 });
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
