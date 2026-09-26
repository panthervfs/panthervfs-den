# Repository Guidance

## Architecture

- This is a dependency-free static GitHub Pages site built from root-level HTML,
  `assets/css/style.css`, and `assets/js/fresh-navigation.js`.
- Reuse the existing page shell, semantic HTML, CSS classes, and relative links.
  Do not introduce a framework or build step for changes that fit the current
  structure.
- Primary navigation is repeated in `index.html`, `campaigns.html`, `notes.html`,
  `costgnome.html`, `shopping-list.html`, `bathys-anemos.html`, and each
  `bathys-anemos-session-*.html` page. Keep those copies synchronized and set
  exactly one appropriate `aria-current="page"` value on each page.

## Design and content

- Preserve the dark-fantasy palette, Cinzel headings, compact cards, callouts,
  and responsive layout established in `assets/css/style.css`.
- Keep pages accessible: retain skip links, semantic landmarks, associated form
  labels, visible focus states, and descriptive link text.
- Treat every published page as public. Do not add secrets, personal contact
  details, addresses, private records, unpublished campaign material, or other
  sensitive information.
- Keep copy concise and consistent with the site's practical, lightly themed
  tone. CostGnome is the top-level area for shopping and price research.
- Bathys Anemos pages are manually curated public recaps of approved, already
  played events. Use character names only; omit player and DM names, private
  finances, build bookkeeping, local vault paths, Obsidian links, PDFs, copied
  rules text, and unplayed material.
- Never directly sync, export, or copy the private Obsidian journal into this
  repository. Write original summaries and add a spoiler warning to each
  campaign index or session page.

## Changes and verification

- Update `README.md` when adding pages or changing how site content is
  maintained.
- After changing shared CSS or JavaScript, update its version query on every
  HTML reference, including `404.html`, to refresh GitHub Pages caches.
- Preview locally with `python3 -m http.server 8000`.
- Verify internal links, the active navigation state, and desktop/mobile layout.
  This repository has no automated test suite or package manager.
