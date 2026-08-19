/**
 * Migration script: Local data → Firestore
 *
 * Usage:
 *   npx tsx scripts/migrate-to-firestore.ts
 *
 * Requires FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL,
 * and FIREBASE_ADMIN_PRIVATE_KEY environment variables.
 *
 * This script is idempotent: running it multiple times will update
 * existing documents rather than creating duplicates.
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Inline local data to avoid import path issues during standalone execution
const projects = [
  {
    slug: "mmust-hackathon-hub",
    title: "MMUST Hackathon Hub",
    shortDescription:
      "A platform designed to organize, manage, and promote hackathons at Masinde Muliro University.",
    description:
      "A web platform built to streamline hackathon organization at MMUST — from registration and team formation to submission tracking and event promotion.",
    category: "Web Platform",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase"],
    featured: true,
    status: "completed",
    year: 2025,
    sections: [
      {
        title: "Overview",
        content:
          "MMUST Hackathon Hub was created to solve a real problem: managing hackathons at a university level was fragmented and relied on scattered tools. The platform brings registration, team management, and event updates into one place.",
      },
      {
        title: "Problem",
        content:
          "Hackathon organizers had to juggle spreadsheets, messaging apps, and manual tracking. Participants lacked a central place to register, find teammates, and stay updated on event timelines.",
      },
      {
        title: "Solution",
        content:
          "A dedicated web application that handles event creation, participant registration, team formation, and submission tracking. Built with modern web technologies to ensure reliability and speed.",
      },
      {
        title: "Implementation",
        content:
          "Built with Next.js and TypeScript for the frontend, Firebase for authentication and data storage, and Tailwind CSS for a clean, responsive interface. The application follows the App Router pattern with server-side rendering where appropriate.",
      },
      {
        title: "What I Learned",
        content:
          "This project deepened my understanding of building real-world applications — handling user authentication, managing complex state, and designing for actual users with actual needs.",
      },
    ],
  },
  {
    slug: "model-maker-solution",
    title: "Model Maker Solution",
    shortDescription:
      "A platform for creating, training, and deploying machine learning models through an accessible interface.",
    description:
      "An application that simplifies the machine learning workflow — from data preparation and model training to evaluation and deployment — making ML more accessible to developers.",
    category: "AI/ML Platform",
    technologies: ["Python", "Next.js", "TypeScript", "Machine Learning"],
    featured: true,
    status: "in-progress",
    year: 2025,
    sections: [
      {
        title: "Overview",
        content:
          "Model Maker Solution aims to lower the barrier to entry for machine learning by providing a guided interface for building and deploying models without requiring deep ML expertise.",
      },
      {
        title: "Problem",
        content:
          "Machine learning workflows are typically fragmented across notebooks, command-line tools, and deployment scripts. This creates friction for developers who want to integrate ML into their projects.",
      },
      {
        title: "Solution",
        content:
          "A unified web interface that walks users through the ML pipeline — from uploading datasets to training models and generating deployable artifacts.",
      },
      {
        title: "Implementation",
        content:
          "The frontend is built with Next.js and TypeScript. The backend handles model training pipelines and data processing. The architecture is designed to support multiple ML frameworks.",
      },
      {
        title: "What I Learned",
        content:
          "Building this project taught me how to design complex workflows, handle long-running processes, and create interfaces that make technical concepts approachable.",
      },
    ],
  },
  {
    slug: "nichecraft-ai",
    title: "NicheCraftAI",
    shortDescription:
      "An AI-powered tool for generating niche-specific content strategies and ideas.",
    description:
      "A tool that leverages AI to help content creators and businesses identify profitable niches, generate content ideas, and develop content strategies tailored to specific audiences.",
    category: "AI Tool",
    technologies: ["Next.js", "TypeScript", "AI Integration"],
    featured: true,
    status: "in-progress",
    year: 2025,
    sections: [
      {
        title: "Overview",
        content:
          "NicheCraftAI helps content creators move beyond generic advice by providing AI-driven insights into niche markets, audience behavior, and content optimization.",
      },
      {
        title: "Problem",
        content:
          "Finding the right niche and developing a content strategy typically requires extensive market research, competitor analysis, and trial-and-error — processes that are time-consuming and often inaccurate.",
      },
      {
        title: "Solution",
        content:
          "An AI-powered application that analyzes niche potential, generates content ideas, and provides actionable strategies based on data-driven insights.",
      },
      {
        title: "Implementation",
        content:
          "Built with Next.js and TypeScript, integrating AI capabilities for content generation and analysis. The interface is designed to present complex data in an actionable format.",
      },
      {
        title: "What I Learned",
        content:
          "This project explored how AI can be practically applied to solve real content creation challenges, and taught me about designing interfaces that make AI outputs useful and trustworthy.",
      },
    ],
  },
  {
    slug: "peer-to-peer-claim-verification",
    title: "Peer-to-Peer Multi-Factor Claim Verification",
    shortDescription:
      "A decentralized verification system using multiple factors to validate claims in a peer-to-peer network.",
    description:
      "A system designed to verify claims through a multi-factor, peer-to-peer approach — combining reputation, evidence, and consensus mechanisms to establish trust without a central authority.",
    category: "Blockchain/Security",
    technologies: ["Blockchain", "Cryptography", "Peer-to-Peer Systems"],
    featured: false,
    status: "completed",
    year: 2025,
    sections: [
      {
        title: "Overview",
        content:
          "This project explores how claims can be verified in decentralized environments where no single authority controls the truth. It uses multiple verification factors to establish credibility.",
      },
      {
        title: "Problem",
        content:
          "In peer-to-peer systems, establishing trust is challenging. Centralized verification creates single points of failure and control. Existing solutions often rely on a single trust mechanism.",
      },
      {
        title: "Solution",
        content:
          "A multi-factor verification system that combines peer reputation, cryptographic evidence, and consensus mechanisms to validate claims in a distributed manner.",
      },
      {
        title: "Implementation",
        content:
          "Built using principles of distributed systems and cryptography. The system uses a combination of hashing, digital signatures, and reputation scoring to verify claims.",
      },
      {
        title: "What I Learned",
        content:
          "This project deepened my understanding of distributed systems, cryptography, and the fundamental challenges of building trust in decentralized environments.",
      },
    ],
  },
];

const skills = [
  { name: "JavaScript", category: "language" },
  { name: "TypeScript", category: "language" },
  { name: "Dart", category: "language" },
  { name: "C++", category: "language" },
  { name: "Python", category: "language" },
  { name: "React", category: "framework" },
  { name: "Next.js", category: "framework" },
  { name: "Flutter", category: "framework" },
  { name: "Tailwind CSS", category: "framework" },
  { name: "Firebase", category: "backend" },
  { name: "Firestore", category: "database" },
  { name: "Cloudinary", category: "backend" },
  { name: "Git", category: "tools" },
  { name: "GitHub", category: "tools" },
  { name: "Vercel", category: "tools" },
  { name: "Android Studio", category: "tools" },
];

// Certificates are currently empty — nothing to migrate
const certificates: Array<Record<string, unknown>> = [];

function getAdminApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin credentials. Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY.",
    );
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
  });
}

async function migrateProjects(db: FirebaseFirestore.Firestore) {
  console.log("\n📦 Migrating projects...");

  for (const project of projects) {
    const docRef = db.collection("projects").doc(project.slug);
    const existing = await docRef.get();

    await docRef.set(project, { merge: true });

    if (existing.exists) {
      console.log(`  ✏️  Updated: ${project.slug}`);
    } else {
      console.log(`  ✅ Created: ${project.slug}`);
    }
  }

  console.log(`  Total: ${projects.length} projects`);
}

async function migrateSkills(db: FirebaseFirestore.Firestore) {
  console.log("\n🛠️  Migrating skills...");

  for (const skill of skills) {
    const docId = `${skill.category}-${skill.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const docRef = db.collection("skills").doc(docId);
    const existing = await docRef.get();

    await docRef.set(skill, { merge: true });

    if (existing.exists) {
      console.log(`  ✏️  Updated: ${skill.name}`);
    } else {
      console.log(`  ✅ Created: ${skill.name}`);
    }
  }

  console.log(`  Total: ${skills.length} skills`);
}

async function migrateCertificates(db: FirebaseFirestore.Firestore) {
  console.log("\n📜 Migrating certificates...");

  if (certificates.length === 0) {
    console.log("  (no certificates to migrate)");
    return;
  }

  for (const cert of certificates) {
    const docRef = db.collection("certificates").doc(cert.id as string);
    const existing = await docRef.get();

    await docRef.set(cert, { merge: true });

    if (existing.exists) {
      console.log(`  ✏️  Updated: ${cert.title}`);
    } else {
      console.log(`  ✅ Created: ${cert.title}`);
    }
  }

  console.log(`  Total: ${certificates.length} certificates`);
}

async function main() {
  console.log("🚀 Starting Firestore migration...\n");

  const app = getAdminApp();
  const db = getFirestore(app);

  try {
    await migrateProjects(db);
    await migrateSkills(db);
    await migrateCertificates(db);

    console.log("\n✨ Migration complete!");
    console.log(
      "   Documents are idempotent — re-running will update, not duplicate.",
    );
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

main();
