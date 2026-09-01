# Portfolio - Mohamed Badusha

Static one-page portfolio. No build step, no dependencies, no tracking.

```
index.html          markup and all copy
assets/css/style.css  design tokens + layout
assets/js/main.js     SSO flow animation, scroll reveals
.nojekyll             tells GitHub Pages to serve files as-is
```

## Preview locally

Open `index.html` in a browser. That's it - there is nothing to install or run.

If you want a local server (needed only if you later add `fetch` calls):

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Publish to GitHub Pages

1. Push to `main`.
2. Repo → **Settings** → **Pages**.
3. Source: **Deploy from a branch** → branch `main`, folder `/ (root)` → **Save**.
4. Live at `https://mohamedbadus.github.io/Portfolio/` in about a minute.

## Editing

All copy lives in `index.html`. Search for `TODO(Badusha)` - those are the
placeholders that still need real content:

- what you actually built in each Zoho role
- your final CGPA (the site says 8.18 through the sixth semester)

Colors and type are CSS custom properties at the top of `style.css`:
`--signal` (cyan, a request in transit) and `--seal` (amber, a signed assertion).
