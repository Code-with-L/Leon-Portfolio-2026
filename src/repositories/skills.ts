import { collection, getDocs } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import type { Skill } from "@/types";
import { skills as localSkills } from "@/data/skills";

const COLLECTION = "skills";

function isFirebaseConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
}

function firestoreDocToSkill(data: Record<string, unknown>): Skill {
  return {
    name: data.name as string,
    category: data.category as Skill["category"],
    description: data.description as string | undefined,
  };
}

export async function getSkills(): Promise<Skill[]> {
  if (!isFirebaseConfigured()) {
    return localSkills;
  }

  try {
    const db = getDb();
    const snapshot = await getDocs(collection(db, COLLECTION));

    if (snapshot.empty) {
      return localSkills;
    }

    return snapshot.docs.map((doc) =>
      firestoreDocToSkill(doc.data() as Record<string, unknown>),
    );
  } catch (error) {
    console.error("Failed to fetch skills from Firestore:", error);
    return localSkills;
  }
}

export async function getSkillsByCategory(
  category: Skill["category"],
): Promise<Skill[]> {
  const allSkills = await getSkills();
  return allSkills.filter((s) => s.category === category);
}

export async function getSkillCategories(): Promise<Skill["category"][]> {
  const allSkills = await getSkills();
  return [...new Set(allSkills.map((s) => s.category))];
}
