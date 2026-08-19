"use server";

import { getAdminAuth } from "@/lib/firebase/admin";
import { cookies } from "next/headers";

export async function createSession(idToken: string): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = getAdminAuth();
    const decoded = await auth.verifyIdToken(idToken);

    if (!decoded.admin) {
      return { success: false, error: "Unauthorized." };
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    const cookieStore = await cookies();
    cookieStore.set("__session", sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expiresIn / 1000,
      path: "/",
    });

    return { success: true };
  } catch {
    return { success: false, error: "Invalid credentials." };
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("__session");
}
