import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import type { Project } from "@/types";
import { projects as localProjects } from "@/data/projects";

const COLLECTION = "projects";

function isFirebaseConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
}

function firestoreDocToProject(data: Record<string, unknown>, id: string): Project {
  return {
    slug: (data.slug as string) || id,
    title: data.title as string,
    shortDescription: data.shortDescription as string,
    description: (data.description as string) || "",
    category: data.category as string,
    technologies: (data.technologies as string[]) || [],
    featured: (data.featured as boolean) || false,
    status: (data.status as Project["status"]) || "completed",
    githubUrl: data.githubUrl as string | undefined,
    liveUrl: data.liveUrl as string | undefined,
    image: data.image as string | undefined,
    year: data.year as number | undefined,
    sections: (data.sections as Project["sections"]) || undefined,
  };
}

export async function getProjects(): Promise<Project[]> {
  if (!isFirebaseConfigured()) {
    return localProjects;
  }

  try {
    const db = getDb();
    const snapshot = await getDocs(collection(db, COLLECTION));

    if (snapshot.empty) {
      return localProjects;
    }

    return snapshot.docs.map((doc) =>
      firestoreDocToProject(doc.data() as Record<string, unknown>, doc.id),
    );
  } catch (error) {
    console.error("Failed to fetch projects from Firestore:", error);
    return localProjects;
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  if (!isFirebaseConfigured()) {
    return localProjects.filter((p) => p.featured);
  }

  try {
    const db = getDb();
    const q = query(collection(db, COLLECTION), where("featured", "==", true));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return localProjects.filter((p) => p.featured);
    }

    return snapshot.docs.map((doc) =>
      firestoreDocToProject(doc.data() as Record<string, unknown>, doc.id),
    );
  } catch (error) {
    console.error("Failed to fetch featured projects from Firestore:", error);
    return localProjects.filter((p) => p.featured);
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  if (!isFirebaseConfigured()) {
    return localProjects.find((p) => p.slug === slug);
  }

  try {
    const db = getDb();
    const docRef = doc(db, COLLECTION, slug);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      return undefined;
    }

    return firestoreDocToProject(
      snapshot.data() as Record<string, unknown>,
      snapshot.id,
    );
  } catch (error) {
    console.error(`Failed to fetch project "${slug}" from Firestore:`, error);
    return localProjects.find((p) => p.slug === slug);
  }
}

export async function getProjectSlugs(): Promise<string[]> {
  if (!isFirebaseConfigured()) {
    return localProjects.map((p) => p.slug);
  }

  try {
    const db = getDb();
    const snapshot = await getDocs(collection(db, COLLECTION));

    if (snapshot.empty) {
      return localProjects.map((p) => p.slug);
    }

    return snapshot.docs.map((doc) => doc.id);
  } catch (error) {
    console.error("Failed to fetch project slugs from Firestore:", error);
    return localProjects.map((p) => p.slug);
  }
}
