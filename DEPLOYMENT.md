# Deployment Guide

## Option A — GitHub website upload (no terminal required)

1. Sign in to GitHub.
2. Click **New repository**.
3. Name it **atiehbaratinia.github.io**.
4. Set it to **Public** and create it.
5. Click **Add file → Upload files**.
6. Upload `index.html`, `styles.css`, `script.js`, `favicon.svg`, `.nojekyll`, and the documentation files.
7. Commit the upload to `main`.
8. Open **Settings → Pages**.
9. Under **Build and deployment**, select **Deploy from a branch**.
10. Choose **main** and **/(root)**, then save.
11. Open `https://atiehbaratinia.github.io` after deployment completes.

## Option B — Git command line

```bash
git init
git add .
git commit -m "Launch personal portfolio"
git branch -M main
git remote add origin https://github.com/AtiehBaratinia/atiehbaratinia.github.io.git
git push -u origin main
```

Then enable Pages from the `main` branch and `/(root)` in the repository settings.

## Updating the site later

Edit a file, then upload/commit the changed version. GitHub Pages redeploys when the publishing branch changes.

## Custom domain later

Buy a domain such as `atiehbaratinia.com`, enter it under **Settings → Pages → Custom domain**, configure the DNS records with the domain provider, and enable **Enforce HTTPS** once available.
