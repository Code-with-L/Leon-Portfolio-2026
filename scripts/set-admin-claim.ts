#!/usr/bin/env npx tsx

/**
 * Bootstrap admin claim for a Firebase user.
 *
 * Usage:
 *   npx tsx scripts/set-admin-claim.ts <uid>
 *   npx tsx scripts/set-admin-claim.ts --email <email>
 *
 * Requires FIREBASE_ADMIN_* environment variables to be set.
 * Run once to grant admin access to a specific user.
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function getApp() {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const pk = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: pk ? pk.replace(/\\n/g, "\n") : undefined,
    }),
  });
}

async function setAdminClaim(uid: string) {
  const app = getApp();
  const auth = getAuth(app);

  await auth.setCustomUserClaims(uid, { admin: true });

  console.log(`Admin claim set for user: ${uid}`);
  console.log("The user must sign out and sign back in for the claim to take effect.");
}

async function findUidByEmail(email: string): Promise<string> {
  const app = getApp();
  const auth = getAuth(app);

  const user = await auth.getUserByEmail(email);
  return user.uid;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Usage:");
    console.error("  npx tsx scripts/set-admin-claim.ts <uid>");
    console.error("  npx tsx scripts/set-admin-claim.ts --email <email>");
    process.exit(1);
  }

  let uid: string;

  if (args[0] === "--email" && args[1]) {
    uid = await findUidByEmail(args[1]);
    console.log(`Found user UID: ${uid}`);
  } else {
    uid = args[0];
  }

  await setAdminClaim(uid);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
