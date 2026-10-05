# PantherVFS's Den

A dark-fantasy static hub for public-safe notes and useful shared resources.

## Local preview

From this repository:

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000/>.

## Update the site

### Main pages

- `index.html`: home page and campaign spotlight.
- `campaigns.html`: Session Notes and Character Sheets button panels, plus publishing boundaries.
- `bathys-anemos.html`: the Bathys Anemos session index.
- `sophirus.html`: approved read-only level-8 character snapshot.
- `bathys-anemos-session-01.html` through
  `bathys-anemos-session-05.html`: public session recaps.
- `notes.html`: public note links.
- `costgnome.html`: the landing page for items being researched before purchase.
- `shopping-list.html`: CostGnome items that do not have confirmed prices.
- `store-pricing-list.html`: CostGnome items with confirmed store prices.

Add items without confirmed prices to `shopping-list.html`. When a price is
confirmed, move the complete item entry to the appropriate category in
`store-pricing-list.html` and replace its research status with a labeled price.
Keep item descriptions and D&D Beyond links intact, preserve separate healing
and detox categories, and distinguish campaign exceptions from standard rules.
These are static reference lists, not purchase trackers; quantities remain
undecided until confirmed. Changes are published through Git.

### Add a Bathys Anemos session

The private Obsidian journal is reference material, not a publishable source
file. For each new played session:

1. Write a concise original recap as a new zero-padded HTML page.
2. Include the confirmed play date, a spoiler warning, major played events, and
   where the party stopped. If the play date is unknown, label the recap by
   session number and state that the date is not recorded. Keep any publication
   date explicitly separate rather than inferring a play date from the schedule.
3. Use character names only. Omit player and DM names, private finances,
   character-build bookkeeping, local paths, Obsidian links, PDF references,
   rules text, and unplayed campaign material.
4. Add the session to `bathys-anemos.html` and connect the previous/next links.
Do not copy or automatically publish files from the private vault.

## Publish with GitHub Pages

### Refresh the character snapshot locally

Use **Export to Den (local only)** in the additional 2024-style Obsidian view on
desktop. The explicitly configured destination must be this repository's real
local checkout. The export replaces only `sophirus.html` and
`assets/css/character-sheet-2024.css`, using fresh committed character values
and an allowlisted mechanical presentation. Do not hand-edit generated snapshot
content; review/update its source projection when equipment or build references
change. The page's timestamp distinguishes a snapshot from live play state.

Only this approved character page may contain build statistics, current/max
resources, companion values, remaining consumables and linked currency.
Player/DM identities, private journal/history, acquisition stories, raw vault
data, local paths and PDFs remain excluded. This does not change recap rules.

Preview with `python3 -m http.server 8000 --bind 127.0.0.1` and open
<http://127.0.0.1:8000/sophirus.html>. Export neither commits nor publishes.
Review the local diff before any separately authorized publication.

1. Create a public GitHub repository named `panthervfs-den`.
2. Add it as this repository's remote and push `main`:

   ```sh
   git remote add origin https://github.com/panthervfs/panthervfs-den.git
   git push -u origin main
   ```

3. In the GitHub repository, open **Settings > Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)` folder, then save.

The site will be available at:
<https://panthervfs.github.io/panthervfs-den/>

## Cache behavior

GitHub Pages sets a CDN cache lifetime of up to 10 minutes. The site adds
document no-cache metadata, versioned assets, timestamped same-site navigation,
and back/forward-cache handling so normal navigation requests the latest
deployment. After changing CSS or JavaScript, update the version value on its
HTML references as an additional asset cache reset.

## Privacy

GitHub Pages is public hosting. Treat the site as public even if the URL is only
shared with friends. Do not publish secrets, private documents, sensitive photos,
personal contact details, or files whose metadata should remain private.
