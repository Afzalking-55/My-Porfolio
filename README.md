# Mohamed Afzal — Portfolio

A premium personal portfolio built with Next.js, React, TypeScript, and a small custom design system.

## Stack

- Next.js 15 App Router
- React 19
- TypeScript (strict)
- JWT + httpOnly cookies for the private area
- Vercel KV + Blob support, with local file persistence for non-serverless deployments
- Self-hosted fonts
- No CSS framework

## Project structure

```
app/              Next.js routes, pages, API handlers, metadata
components/       Reusable UI, split into public and private sections
content/          Public portfolio content
lib/              Auth, sessions, storage, rate limiting, shared types
data/private/     Local runtime data (git-ignored)
public/           Static assets
scripts/          Smoke tests and utility scripts
```

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

For a production build:

```bash
npm run build
npm start
```

Optional smoke test:

```bash
BASE_URL=http://localhost:3000 PASSWORD='your-password' ./scripts/smoke-test.sh
```

## Environment variables

Create `.env.local` from `.env.example`.

| Variable | Purpose |
| --- | --- |
| `PRIVATE_AREA_PASSWORD` | Password for the private “The Real Me” area |
| `SESSION_SECRET` | Secret used to sign session tokens; use 32+ random characters |
| `SITE_URL` | Canonical site URL for metadata and SEO |

Generate a session secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Never commit real environment files or private runtime data.

## Editing the portfolio

Most public content lives in `/content`:

- `profile.ts` — name, tagline, summary, portrait
- `contact.ts` — email and social links
- `about.ts` — about section
- `skills.ts` — skills
- `projects.ts` — projects
- `experience.ts` — experience
- `education.ts` — education
- `building.ts` — current projects
- `goals.ts` — goals and vision
- `meta.ts` — shared copy and metadata

Add the profile image at:

```
public/images/profile.jpg
```

## Private area

The private area is available under `/private` and protected by:

- rate-limited password login
- signed JWT session cookies
- `httpOnly` + `SameSite=Lax` cookies
- middleware protection for private pages and APIs
- a second auth check inside private API handlers
- private photo storage outside `/public`

Local deployments use `data/private/` for persistence. Vercel deployments can use Vercel KV and Vercel Blob.

## Deployment

The project is ready for Vercel or a Node/Docker deployment.

For Vercel, configure:

- `PRIVATE_AREA_PASSWORD`
- `SESSION_SECRET`
- `SITE_URL`

Connect Vercel KV and Vercel Blob when using the private area's persistent content and photo uploads.

## Checks

Run the TypeScript check with:

```bash
npm run typecheck
```

Run the full production build with:

```bash
npm run build
```

---

Built by **Mohamed Afzal**.
