import { NextResponse } from "next/server";
import { db } from "../../../../configs/db";
import { coverLetterTable } from "../../../../configs/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    // Fetch all cover letters ordered by newest first
    const latestResumes = await db
      .select()
      .from(coverLetterTable)
      .orderBy(desc(coverLetterTable.createdAt));
    // Keep only the latest cover letter per user
    const latestPerUser = latestResumes.reduce<
      Record<number, typeof latestResumes[0]>
    >((acc, row) => {
      if (!acc[row.userId]) {
        acc[row.userId] = row;
      }
      return acc;
    }, {});

    return NextResponse.json(Object.values(latestPerUser));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
