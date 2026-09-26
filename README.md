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
- `campaigns.html`: approved public campaign links and publishing boundaries.
- `bathys-anemos.html`: the Bathys Anemos session index.
- `bathys-anemos-session-01.html` through
  `bathys-anemos-session-04.html`: dated public session recaps.
- `notes.html`: public note links.
- `costgnome.html`: the landing page for items being researched before purchase.
- `shopping-list.html`: CostGnome's current price-research list.

To update the shopping list, edit the grouped item descriptions and D&D Beyond
links in `shopping-list.html`. Each item in CostGnome prices has a labeled price
line; replace `??? GP` when its price is known. Keep healing tiers and detox
options separate, and distinguish campaign exceptions from standard rules. This
is a static wishlist, not a purchase tracker; quantities remain undecided until
confirmed. Changes are published through Git.

### Add a Bathys Anemos session

The private Obsidian journal is reference material, not a publishable source
file. For each new played session:

1. Write a concise original recap as a new zero-padded HTML page.
2. Include the session date, a spoiler warning, major played events, and where
   the party stopped.
3. Use character names only. Omit player and DM names, private finances,
   character-build bookkeeping, local paths, Obsidian links, PDF references,
   rules text, and unplayed campaign material.
4. Add the session to `bathys-anemos.html` and connect the previous/next links.
Do not copy or automatically publish files from the private vault.

## Publish with GitHub Pages

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
