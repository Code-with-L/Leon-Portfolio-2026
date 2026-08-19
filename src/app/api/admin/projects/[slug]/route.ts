import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { getAdminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    await verifyAdmin();
    const db = getAdminDb();
    const doc = await db.collection("projects").doc(slug).get();

    if (!doc.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(doc.data());
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
