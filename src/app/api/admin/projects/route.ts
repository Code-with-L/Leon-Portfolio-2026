import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { getAdminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await verifyAdmin();
    const db = getAdminDb();
    const snapshot = await db.collection("projects").get();
    const projects = snapshot.docs.map((doc) => doc.data());
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
