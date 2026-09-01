# My Portfolio — public site + "The Real Me" private area

A premium, dark-editorial personal portfolio with a **server-authenticated**
private zone. Real app, not a mockup: Next.js App Router, protected routes,
JWT httpOnly sessions, journal CRUD, auth-gated photo storage,
file-based persistence you can swap for a database.

No fake achievements, no invented links. Everything unknown renders as a
dashed `[placeholder]` until you replace it in `/content`.

---

## 1. Quick start (local)

```bash
npm install
cp .env.example .env.local     # then fill in real values (see §3)
npm run dev                    # http://localhost:3000
```

Production mode locally:

```bash
npm run build && npm start     # http://localhost:3000
```

Sanity check everything from your terminal (optional but smart):

```bash
BASE_URL=http://localhost:3000 PASSWORD='your-password' ./scripts/smoke-test.sh
```

---

## 2. Project structure

```
app/
  page.tsx                     public one-page portfolio (all sections)
  login/                       password gate (public URL, private content)
  private/                     PROTECTED dashboard, journal, photos
  api/auth/login|logout        session endpoints
  api/private/*                journal / content / photos — all auth-gated
  globals.css                  the whole design system (tokens, type, motion)
  icon.svg · opengraph-image.tsx · robots.ts · sitemap.ts
components/
  Nav / Footer / Reveal / Ph / Icons
  public/…                     Hero, About, Skills, Projects (filters),
                               Experience, Education, Building, Vision, Contact
  private/…                    Shell, Dashboard (editable), Journal, Gallery
content/                       ←←← EDIT YOUR WEBSITE HERE (see §4)
lib/
  session.ts · auth.ts         JWT signing/verify, timing-safe password check
  rate-limit.ts                login attempt limiter (swap for Redis if multi-server)
  store.ts · private-data.ts    persistence (swap JSON files for a DB here)
  types.ts · placeholder.ts
middleware.ts                  edge route guard for /private + /api/private
data/private/                  runtime data: journal.json, photos/, content.json
                               (git-ignored — never pushed to GitHub)
Dockerfile · docker-compose.yml
```

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript strict ·
`jose` (JWT) · `next/font/local` with self-hosted Fraunces / Inter / IBM Plex Mono ·
zero CSS frameworks (hand-written design system) · Docker-ready.

---

## 3. Environment variables (secrets)

`.env.example` lists all of them. Create `.env.local` (auto git-ignored):

| Variable | Purpose | How to generate |
|---|---|---|
| `PRIVATE_AREA_PASSWORD` | the only password that unlocks "The Real Me" | pick anything long & unique |
| `SESSION_SECRET` | signs the session cookie (min 32 chars) | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `SITE_URL` | canonical URL for SEO / OG tags | e.g. `https://yourname.com` |

Rules the code enforces for you:
- The password is **never** in the bundle, never in source, never sent to the browser — it is compared server-side with a timing-safe hash comparison.
- `SESSION_SECRET` is **required** in production (`next start`/Docker will refuse to boot without it) so you can't accidentally deploy insecure sessions.
- Sessions are httpOnly + SameSite=Lax cookies (JWT, 7-day expiry). Logout clears the cookie client-side; changing `SESSION_SECRET` instantly invalidates **all** issued sessions (kill-switch if a token is ever exposed).

**Change the private-area password:** set `PRIVATE_AREA_PASSWORD` in the
deployed environment (Vercel dashboard → Env Vars; or `.env.local` / compose file
locally) and restart. No code change anywhere.

---

## 4. Editing your content

Everything visible lives in `/content` — no component edits needed:

| File | You edit |
|---|---|
| `profile.ts` | name, tagline, summary, portrait path |
| `contact.ts` | email, phone, Instagram/GitHub/LinkedIn/X (null = hidden) |
| `about.ts` | About section facets & manifesto |
| `skills.ts` | 8 skill categories, descriptions, 1–5 levels |
| `projects.ts` | projects: name, role, tech, status, links, image |
| `experience.ts` | timeline entries (newest first) |
| `education.ts` | institution, degree, field, notes |
| `building.ts` | "Currently Building" items + status |
| `goals.ts` | short / medium / long-term vision |
| `private.ts` | default prompts for The Real Me sections |
| `meta.ts` | footer tagline, login intro |

**Placeholders:** anything matching `[like this]` renders with a dashed
"replace me" style — if you see dashes, it's still unedited. Nothing in
`[brackets]` is ever linked or presented as real. Contact/social rows stay
hidden/disabled until they hold a genuinely valid email/URL.

**Your portrait:** drop `public/images/profile.jpg` (4:5, e.g. 1200×1500).
The hero auto-detects it and swaps out the placeholder frame.

**Add a project:** copy a block in `content/projects.ts`, change values —
grid, filter counts and buttons update automatically. Set
`liveUrl`/`repoUrl` only when they exist. For a thumbnail put the file at
`public/images/projects/NAME.jpg` and set `image: "/images/projects/NAME.jpg"`.

**Update social links:** one line each in `content/contact.ts`. Header,
footer and contact rows all read from it.

**Private sections** (story, goals, dreams…) — edit **in the dashboard** after
login: Save writes to `data/private/content.json`, which is git-ignored.
`content/private.ts` only defines the starting prompts.

---

## 5. How authentication works

1. `POST /api/auth/login` (rate-limited: 8 fails / 10 min / IP) hashes the
   candidate + `PRIVATE_AREA_PASSWORD` with SHA-256 and compares with
   `crypto.timingSafeEqual`. Password never leaves the server.
2. Success signs a 7-day JWT (`jose`, HS256, `SESSION_SECRET`) and sets an
   **httpOnly, SameSite=Lax, Secure-in-prod** cookie `rm_session`.
3. `middleware.ts` guards `GET /private/*` (redirect → `/login?next=…`) and
   `GET/POST /api/private/*` (401 for APIs) at the edge.
4. Every route handler re-verifies the cookie in-process (defense in depth),
   and only then reads/writes private data.
5. Private photos are stored **outside** `/public`; bytes stream only through
   `/api/private/photos/[id]` with `Cache-Control: no-store`. A logged-out
   visitor (or crawler) gets 401 even with the exact file ID.
6. `robots.txt` + `noindex` on all private routes + empty private sitemap.

---

## 6. Deploying for real

**Requirements:** a Node runtime (18+ / 22 recommended). The private area's
persistence adapts automatically: on Vercel it uses **Vercel KV** (JSON docs) +
**Vercel Blob** (photos) when those stores are connected; anywhere else it uses
the `/data` folder on disk (so it must be readable & writable).

### Option A — Docker (VPS, Railway, Render, Fly…)
```bash
docker compose up --build -d      # reads PRIVATE_AREA_PASSWORD & SESSION_SECRET from .env
```
Mount `./data:/app/data` (already in compose) or a volume, otherwise uploads
disappear on re-deploy.

### Option B — plain Node on a VPS
```bash
git clone <your-repo> && cd <your-repo>
npm ci && npm run build
cp .env.example .env.local   # fill it
PORT=3000 npm start
# reverse proxy (Caddy is the lazy choice: `reverse_proxy localhost:3000` → auto-HTTPS)
```

### Option C — Vercel (simplest)
1. Import the repo (Next.js is auto-detected) and deploy.
2. Marketplace → install **Vercel KV** and **Vercel Blob**, apply both to
   Production. Their env vars (`KV_REST_API_URL`, `KV_REST_API_TOKEN`,
   `BLOB_READ_WRITE_TOKEN`) are injected automatically — the app switches to
   them at boot. Until they exist, Vercel writes are refused with a clear
   error instead of silently vanishing.
3. Env vars: `PRIVATE_AREA_PASSWORD`, `SESSION_SECRET` (≥32 chars),
   `SITE_URL` (full `https://…` URL or unset — blank values are ignored).
4. Settings → Functions → Maximum Request Body Size = 5 MB (platform cap);
   keep photos under it.
5. Smoke-test it: `BASE_URL=https://… PASSWORD=… scripts/smoke-test.sh`.

Photos live in a **private** Blob store: their URLs 401 at the CDN, bytes are
only streamed through the auth-checked `/api/private/photos/[id]` route.

### Custom domain
Point an A/CNAME record at your host (or add it in Vercel/Railway/Render),
then set `SITE_URL=https://yourdomain.com` and restart. HTTPS is provided by
Caddy/Let's Encrypt, or free via the PaaS. Cookies auto-upgrade to `Secure` in production.

### Push to GitHub (first time)
```bash
git init -b main            # already done here
git add -A && git commit -m "Portfolio: public site + The Real Me private area"
git branch -M main
git remote add origin https://github.com/<you>/my-portfolio.git
git push -u origin main
```
`.gitignore` already keeps `.env*` and `/data/private/*` out — verify on GitHub
that those files are absent.

---

## 7. Testing done

Verified against dev **and** production builds (60-check suite):
layout sections render · every nav anchor exists · login wrong/correct/empty
· lockout at 8 attempts · cookie flags (httpOnly) · /private, /private/journal,
/private/photos + all APIs return 307/401 without session · direct URL access,
refresh while authed/unauthed · tampered JWT rejected · journal create/search/
edit/delete · content save + unknown-key rejection · photo upload/type-check/
size-check · photo bytes 401 without session · path-traversal IDs blocked ·
logout + re-access blocked · missing portrait degrades to placeholder ·
404/loading/error pages · robots + sitemap exclude private routes ·
no secret appears in any HTML.

Mobile: hamburger menu, single-column grids at ≤720px, 100svh hero,
touch-friendly targets; `prefers-reduced-motion` respected; skip-link and
focus-visible outlines included.

---

## 8. Connect a real database later

`lib/store.ts` (+ `lib/private-data.ts`) is the only layer that touches
storage: `readJSON / writeJSON / putPhoto / getPhoto / removePhoto`. It already
implements two backends (Vercel KV + Blob, local files); adding Postgres /
Supabase / MongoDB means adding one more branch there and nothing else — APIs,
journal, photos, private content — keeps working unchanged. Auth can
similarly move to an auth provider by swapping `lib/auth.ts` session issuance
for provider sessions; routes and middleware keep their shape.

---

## 9. Remaining setup checklist (yours)

- [ ] `.env.local` → real `PRIVATE_AREA_PASSWORD` + `SESSION_SECRET` + `SITE_URL`
- [ ] `content/profile.ts` → your name, tagline, `public/images/profile.jpg`
- [ ] `content/contact.ts` → email, phone, Instagram/GitHub (LinkedIn if you have it)
- [ ] `content/projects.ts` → first real project; delete placeholder blocks
- [ ] `content/experience.ts` / `education.ts` → real entries only
- [ ] Dashboard → write your first private entries + upload photos
- [ ] GitHub repo + deploy (§6) → run `scripts/smoke-test.sh` against the live URL
- [ ] Optional: HTTPS + domain, backups of `/data` (it now holds your journal)

*Everything you didn't provide stays a visible placeholder — the site is
designed to earn its facts, not invent them.*
