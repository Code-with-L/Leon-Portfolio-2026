import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { getAdminDb } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await verifyAdmin();
    const db = getAdminDb();
    const snapshot = await db.collection("skills").get();
    const skills = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(skills);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
