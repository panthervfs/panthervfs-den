# Copilot Instructions

## Repository structure

This repository is a small, dependency-free static site for GitHub Pages.
Implement features with root-level HTML, `assets/css/style.css`, and
`assets/js/fresh-navigation.js`; do not add frameworks, generated files, or a
build system unless explicitly requested.

## Implementation conventions

- Follow the existing HTML page shell and reuse established components such as
  `.page-header`, `.section`, `.card`, `.link-panel`, `.button`, and `.callout`.
- Keep primary navigation synchronized across `index.html`, `campaigns.html`,
  `notes.html`, `costgnome.html`, `shopping-list.html`, `bathys-anemos.html`,
  and every `bathys-anemos-session-*.html` page.
- Use one contextually correct `aria-current="page"` per navigable page. A
  CostGnome subpage should mark CostGnome as current; a Bathys Anemos page
  should mark Campaigns as current.
- Preserve semantic landmarks, skip links, descriptive labels, keyboard focus
  styles, and responsive behavior.
- Keep the dark-fantasy visual language and concise public-facing copy.
- Treat all content as publicly accessible. Exclude sensitive personal data,
  private records, addresses, secrets, and unpublished campaign content.
- Keep internal page links relative so local preview and the GitHub Pages
  project path both work.
- Build Bathys Anemos session pages as hand-written original summaries of
  approved, already played events. Include spoiler warnings and use character
  names only.
- Do not directly copy or sync the private Obsidian journal. Exclude player and
  DM names, private finances, build-sheet bookkeeping, local paths, Obsidian
  wikilinks, PDFs, copied rules text, and unplayed material.

## Documentation and validation

- Update `README.md` for page additions or maintenance-workflow changes.
- If shared CSS or JavaScript changes, update the matching asset version query
  in every HTML file that references it, including `404.html`.
- Validate with a local server (`python3 -m http.server 8000`), check all
  internal links, and inspect desktop and narrow layouts.
- Do not invent automated test commands; the repository currently has no test
  runner or package manager.
