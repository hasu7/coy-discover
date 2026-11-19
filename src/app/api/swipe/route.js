import { NextResponse } from "next/server";
import { recordSwipe } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const profileId = Number(body?.profileId);
    const action = body?.action;

    const result = recordSwipe(profileId, action);
    return NextResponse.json(result);
  } catch (err) {
    const status = err.status || 500;
    return NextResponse.json(
      { error: err.message || "Failed to record swipe" },
      { status }
    );
  }
}
