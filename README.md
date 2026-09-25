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
- `campaigns.html`: a placeholder for future creator-approved campaign material.
- `notes.html`: public note links.
- `shopping-list.html`: the shopping list linked from Notes.

To update the shopping list, edit the grouped item descriptions and D&D Beyond
links in `shopping-list.html`. Keep healing tiers and detox options separate,
and distinguish campaign exceptions from standard rules. This is a static
wishlist, not a purchase tracker; quantities remain undecided until confirmed.
Changes are published through Git.

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
