# Leon Muriithi — Developer Portfolio

A full-stack developer portfolio built with Next.js, Firebase, Cloudinary, and TypeScript.

## Tech Stack

- **Framework:** Next.js 16.3.1 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Firestore (with local fallback)
- **Auth:** Firebase Authentication + Admin SDK
- **Media:** Cloudinary (image uploads, optimization, CDN)
- **Runtime:** React 19

## Project Structure

```
src/
  app/
    admin/          # Admin dashboard + CRUD pages
    api/admin/      # Admin API routes (data + upload endpoints)
    (public)/       # Public portfolio pages
  actions/          # Server Actions (auth, CRUD, image operations)
  components/
    admin/          # Admin form components, shell, image field
    layout/         # Header, Footer
    ui/             # Reusable UI primitives
  config/           # Site configuration
  data/             # Local fallback data (used when Firebase is not configured)
  lib/
    firebase/       # Firebase client + admin SDK initialization
    cloudinary.ts   # Server-only Cloudinary SDK wrapper
    admin-auth.ts   # Server-side session verification
    auth-context.tsx # Client-side auth state
    validation.ts   # Input validation (including image validation)
  repositories/     # Data access layer (Firestore-first, local fallback)
  types/            # TypeScript type definitions
scripts/            # Setup and migration scripts
```

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd "Leon Portfolio"
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

#### Firebase Client SDK (browser-safe, uses `NEXT_PUBLIC_` prefix)

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

#### Firebase Admin SDK (server-only, NEVER use `NEXT_PUBLIC_` prefix)

```
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

The `FIREBASE_ADMIN_PRIVATE_KEY` should be the full PEM key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` headers. In `.env.local`, newlines in the key should be represented as literal `\n` characters.

#### Cloudinary (server-only, NEVER use `NEXT_PUBLIC_` prefix)

```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 3. Firebase project setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** with Email/Password provider
3. Create a **Firestore** database
4. Register a **Web app** and copy the config values to `.env.local`
5. Generate a **Service Account** key (Project Settings → Service Accounts → Generate New Private Key)
6. Copy the service account values to the `FIREBASE_ADMIN_*` env vars

### 4. Cloudinary setup

1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. From the Dashboard, copy your **Cloud Name**, **API Key**, and **API Secret**
3. Add them to `.env.local` as `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
4. Images are stored in the `portfolio/projects/` and `portfolio/certificates/` folders on Cloudinary

### 5. Firestore security rules

Deploy the rules in `firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

Rules grant:
- **Public read** on `projects`, `certificates`, `skills`
- **Admin-only write** (requires `admin: true` custom claim)
- **Deny all** on unknown collections

### 6. Create admin account

1. Create a user in Firebase Authentication (via console or the login page)
2. Run the admin claim bootstrap script:

```bash
npm run set-admin -- <uid>
# or
npm run set-admin -- --email user@example.com
```

3. The user must **sign out and sign back in** for the custom claim to take effect

### 7. Migrate local data to Firestore (optional)

If you have local data in `src/data/` and want to populate Firestore:

```bash
npm run migrate
```

This is idempotent — safe to run multiple times. Uses stable document IDs.

## Development

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Production Build

```bash
npm run build
npm run start
```

The build verifies TypeScript types and generates optimized static/dynamic pages.

## Deployment

### Vercel (recommended)

1. Push to GitHub
2. Import in Vercel
3. Add all environment variables in Vercel project settings
4. Deploy

### Other platforms

Ensure:
- Node.js 18+ runtime
- All `NEXT_PUBLIC_*`, `FIREBASE_ADMIN_*`, and `CLOUDINARY_*` env vars are set
- `firestore.rules` are deployed to your Firebase project

## Security Model

### Authentication

- Firebase Authentication handles identity (email/password)
- Firebase Admin SDK verifies ID tokens server-side
- Session cookies (httpOnly, secure in production) maintain server-side auth state
- 5-day session expiration

### Authorization

- Custom claims (`admin: true`) are set via the `set-admin` script
- All admin API routes and Server Actions call `verifyAdmin()` before any data access
- The client-side `isAdmin` flag is only used for UI visibility, never for authorization
- Admin route protection is defense-in-depth: client-side redirect + server-side session verification

### Firestore rules

- Public read on portfolio content
- Write restricted to authenticated users with `admin: true` claim
- Unknown collections are denied

### Input validation

- All form inputs are validated server-side in Server Actions
- String length limits prevent abuse
- URL fields are validated for valid format and protocol
- Enum fields are validated against allowed values
- Image uploads validated for MIME type (JPEG, PNG, WebP, AVIF), file size (5 MB max), and format

### Media (Cloudinary)

- All Cloudinary operations are server-only (`CLOUDINARY_*` vars have no `NEXT_PUBLIC_` prefix)
- Upload and delete routes require admin authentication
- Image replacement follows upload-first strategy: new image uploaded before old is deleted
- Public IDs are validated against allowed folder prefixes (`portfolio/projects/`, `portfolio/certificates/`)
- Orphaned assets are logged server-side, not exposed to clients

## Firestore Collections

| Collection | Document ID | Fields |
|-----------|-------------|--------|
| `projects` | slug | title, shortDescription, description, category, technologies[], featured, status, year, githubUrl, liveUrl, image{url, publicId, alt} |
| `certificates` | auto-generated | title, issuer, type, date, skills[], credentialUrl, image{url, publicId, alt} |
| `skills` | `{category}-{name}` | name, category, description |

## Image Management

### Supported Formats

- JPEG, PNG, WebP, AVIF
- Maximum file size: 5 MB

### Upload Workflow

1. Admin selects image in the form (client-side preview shown)
2. On form submit, image is uploaded to Cloudinary via authenticated API route
3. Cloudinary returns optimized URL and public ID
4. Image metadata (`url`, `publicId`, `alt`) is saved in the Firestore document
5. Previous image (if any) is deleted from Cloudinary after successful upload

### Deletion

- When a project or certificate is deleted, its associated Cloudinary image is also deleted
- Images can be removed from individual items via the admin form

## Admin Workflow

1. Navigate to `/admin/login`
2. Sign in with Firebase credentials
3. Dashboard shows collection counts
4. Create/edit/delete projects, certificates, and skills
5. Upload images for projects and certificates
6. Changes are immediately reflected on the public site via `revalidatePath`

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run migrate` | Migrate local data to Firestore |
| `npm run set-admin` | Grant admin claim to a Firebase user |
