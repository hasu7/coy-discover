import { NextResponse } from "next/server";
import { getMatches } from "@/lib/db";

export async function GET() {
  try {
    const matches = getMatches();
    return NextResponse.json({ matches });
  } catch (err) {
    return NextResponse.json({ error: "Failed to load matches" }, { status: 500 });
  }
}
