import { collection, getDocs } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import type { Certificate } from "@/types";
import { certificates as localCertificates } from "@/data/certificates";

const COLLECTION = "certificates";

function isFirebaseConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
}

function firestoreDocToCertificate(
  data: Record<string, unknown>,
  id: string,
): Certificate {
  return {
    id: (data.id as string) || id,
    title: data.title as string,
    issuer: data.issuer as string,
    type: (data.type as Certificate["type"]) || "certificate",
    date: data.date as string | undefined,
    skills: (data.skills as string[]) || [],
    credentialUrl: data.credentialUrl as string | undefined,
    image: typeof data.image === "object" && data.image !== null
      ? data.image as Certificate["image"]
      : undefined,
  };
}

export async function getCertificates(): Promise<Certificate[]> {
  if (!isFirebaseConfigured()) {
    return localCertificates;
  }

  try {
    const db = getDb();
    const snapshot = await getDocs(collection(db, COLLECTION));

    if (snapshot.empty) {
      return localCertificates;
    }

    return snapshot.docs.map((doc) =>
      firestoreDocToCertificate(doc.data() as Record<string, unknown>, doc.id),
    );
  } catch (error) {
    console.error("Failed to fetch certificates from Firestore:", error);
    return localCertificates;
  }
}
