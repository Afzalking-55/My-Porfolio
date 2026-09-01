# Runtime private data (git-ignored)

Everything in this folder is written by the app at runtime and is
**excluded from git on purpose** — journal entries, photo files and
saved "The Real Me" edits never reach GitHub.

- `content.json` → saved text of the private dashboard sections
- `journal.json` → journal entries
- `photos.json`  → photo metadata
- `photos/`      → uploaded image files (served ONLY via auth-gated API)

If you move to a database, this whole folder goes away — see lib/store.ts.
