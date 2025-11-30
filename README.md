# Mini Audit Trail Generator

Single-page React UI backed by an Express API that tracks text edits, computes compact diff summaries (unique added/removed words, length deltas), and persists them inside a JSON file with atomic writes.

## Project structure

```
.
├─ backend/           # Express API + diff logic + JSON storage
│  ├─ data/versions.json
│  ├─ index.js
│  ├─ lib/
│  │  ├─ diff.js
│  │  ├─ diff.test.js
│  │  └─ storage.js
│  └─ routes/versions.js
├─ frontend/          # React SPA (CRA) with Editor + VersionsList
│  ├─ public/index.html
│  └─ src/
│     ├─ App.jsx
│     ├─ components/
│     │  ├─ Editor.jsx
│     │  └─ VersionsList.jsx
│     ├─ index.js
│     └─ styles.css
├─ package.json       # root scripts, concurrently wiring
└─ run-dev.ps1        # helper script that forwards to `npm run dev`
```

## Getting started

1. **Install dependencies**
   ```powershell
   npm install            # installs root tooling (concurrently)
   npm run setup          # installs backend + frontend packages
   ```
2. **Run the full stack** (backend on `4000`, frontend on `3000` with CRA proxy-free fetches):
   ```powershell
   npm run dev
   # or
   ./run-dev.ps1
   ```
3. Open http://localhost:3000 and start typing.

## API

- `POST /save-version`
  - Body: `{ "content": "string up to 10k chars" }`
  - Response: version payload with `{ id, timestamp (YYYY-MM-DD HH:mm), addedWords[], removedWords[], oldLength, newLength }`
- `GET /versions`
  - Returns newest → oldest list in same shape.

`curl` samples:
```bash
curl -X POST http://localhost:4000/save-version \
  -H "Content-Type: application/json" \
  -d '{"content":"first text"}'

curl http://localhost:4000/versions
```

## Diff + storage notes

- Tokens normalize by lowercasing and stripping punctuation except apostrophes. Arrays hold unique words only. Length metrics use raw character counts to mirror the assignment example numbers.
- JSON persistence happens via temp-file writes + rename, queued through a naive promise chain so concurrent saves serialize. A `content` field is kept server-side only to evaluate future diffs.
- TODO for later: replace the JSON layer with SQLite and add optimistic locking once multiple users hit the endpoint simultaneously.

## Testing

Jest unit tests live in `backend/lib/diff.test.js`.
```powershell
cd backend
npm test
```

## Deployment hints

- **Backend**: deploy to Render/Railway as a Node service (set `PORT`, keep `data/versions.json` on disk or switch to SQLite for stateless hosts).
- **Frontend**: deploy to Vercel/Netlify via `npm run build` and point it to the backend URL through `REACT_APP_API_BASE`.
- Document timezone expectations (currently `YYYY-MM-DD HH:mm` using server locale). Adjust to ISO strings and persist UTC when moving to multi-region hosting.

## Next steps worth considering

1. Add basic auth + per-user namespaces before exposing to real users.
2. Streamline diffs by showing previews client-side before save.
3. Promote JSON storage to SQLite/Postgres for safer multi-instance deployments.
