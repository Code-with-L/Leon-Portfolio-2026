import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { cookies } from "next/headers";

export interface AdminUser {
  uid: string;
  email: string | null;
}

export async function verifyAdmin(): Promise<AdminUser> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("__session")?.value;

  if (!sessionCookie) {
    throw new Error("UNAUTHORIZED");
  }

  const auth = getAdminAuth();

  try {
    const decoded = await auth.verifySessionCookie(sessionCookie, true);

    if (!decoded.admin) {
      throw new Error("FORBIDDEN");
    }

    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
    };
  } catch {
    throw new Error("UNAUTHORIZED");
  }
}

export async function getCollectionCounts(): Promise<{
  projects: number;
  certificates: number;
  skills: number;
}> {
  const db = getAdminDb();

  const [projectsSnap, certificatesSnap, skillsSnap] = await Promise.all([
    db.collection("projects").count().get(),
    db.collection("certificates").count().get(),
    db.collection("skills").count().get(),
  ]);

  return {
    projects: projectsSnap.data().count,
    certificates: certificatesSnap.data().count,
    skills: skillsSnap.data().count,
  };
}
