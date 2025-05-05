import { NextResponse } from 'next/server';
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function POST() {
  const records = await db.insert(advocates).values(advocateData).returning();

  return NextResponse.json({ advocates: records }, { status: 200 });
}
