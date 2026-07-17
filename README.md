# Jiaming Ye · Academic Homepage

A lightweight academic homepage built with plain HTML, CSS, and JavaScript. There is no framework, build step, or runtime dependency.

## Add a publication

Open `data/publications.js` and add one object anywhere inside `window.PUBLICATIONS`:

```js
{
  title: "Your paper title",
  authors: ["Jiaming Ye", "Coauthor Name"],
  venue: "Full venue name",
  venueShort: "ASE",
  date: "2026-07-17", // YYYY-MM-DD, YYYY-MM, or YYYY
  type: "Conference",
  topics: ["testing"]  // testing, smart-contracts, quantum, analysis
},
```

The page automatically sorts all records from newest to oldest and groups them by year. A complete date is recommended when several papers are published in the same year. There is no need to move older entries.

## Preview locally

Run any static file server from this directory, for example:

```powershell
python -m http.server 4173
```

Then visit `http://localhost:4173`.

## Deploy to Vercel

Import this repository in Vercel and keep the defaults:

- Framework preset: `Other`
- Build command: leave empty
- Output directory: leave empty (repository root)

Every push will produce a new deployment. The site also works on GitHub Pages and other static hosting platforms.
