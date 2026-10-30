<p align="center">
  <img src="assets/audit-trail-mark.svg" alt="A text bubble with a check mark and revision lines" width="112" />
</p>

<h1 align="center">Mini Audit Trail Generator</h1>

<p align="center">A small React and Express app that saves text revisions and shows a word and length summary for each change.</p>

<p align="center">
  <a href="#run-locally">Run locally</a> ·
  <a href="#api">API</a> ·
  <a href="#storage-and-scope">Storage and scope</a> ·
  <a href="#tests">Tests</a>
</p>

## Run locally

The app uses a React frontend, an Express API, and a JSON file for revision history.

```bash
git clone https://github.com/AbhiramVSA/assignment-audit.git
cd assignment-audit
npm install
npm run setup
npm run dev
```

Open <http://localhost:3000>. The frontend uses `http://localhost:4000` for the API by default. Set `REACT_APP_API_BASE` before starting the frontend to use another API address.

## What it records

Each saved version returns a timestamp, the words added or removed, and the old and new character counts. The API accepts text up to 10,000 characters. The editor and history list run in the browser; the backend calculates each summary and persists the version history.

## API

| Method | Route | Result |
|---|---|---|
| `POST` | `/save-version` | Save a text version and return its summary. Body: `{"content":"updated text"}` |
| `GET` | `/versions` | Return saved versions from newest to oldest. |
| `GET` | `/healthz` | Return `{"status":"ok"}` when the API is running. |

Example:

```bash
curl -X POST http://localhost:4000/save-version \
  -H "Content-Type: application/json" \
  -d '{"content":"first text"}'
```

## Storage and scope

The backend stores version history in `backend/data/versions.json`. It writes through a temporary file before replacing the data file. This is a small single-user project. It has no authentication or per-user history, so do not expose the API to untrusted users.

The diff summary compares word counts without punctuation and reports raw character counts. The API response omits the saved text, although the backend keeps it in its local history file to compare the next version.

## Tests

Run the backend unit tests:

```bash
cd backend
npm test
```

## License

No license file is included in this repository.
