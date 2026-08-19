import { NextResponse } from "next/server";
import { verifyAdmin, getCollectionCounts } from "@/lib/admin-auth";

export async function GET() {
  try {
    await verifyAdmin();
    const counts = await getCollectionCounts();
    return NextResponse.json(counts);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
