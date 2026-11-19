import { NextResponse } from "next/server";
import { getFeed } from "@/lib/db";

export async function GET() {
  try {
    const profiles = getFeed();
    return NextResponse.json({ profiles });
  } catch (err) {
    return NextResponse.json({ error: "Failed to load feed" }, { status: 500 });
  }
}
