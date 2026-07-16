# Atieh Barati Nia — Personal Research Portfolio

A responsive, animated, dependency-free portfolio website built for GitHub Pages.

## Included

- Animated graph-network hero background
- Dark and light themes
- Responsive mobile navigation
- Scroll-reveal and hover interactions
- Research, project, publication, timeline, and contact sections
- Live public GitHub repository count and project star counts
- SEO and social-sharing metadata
- Accessibility and reduced-motion support

## Run locally

No build process is required.

### Fastest method

Open `index.html` in a browser.

### Recommended local server

From this folder, run one of these commands:

```bash
python -m http.server 8000
```

or, on Windows if `python` maps differently:

```bash
py -m http.server 8000
```

Then open `http://localhost:8000`.

## Publish on GitHub Pages

For the clean address `https://atiehbaratinia.github.io`, create a **public** repository named exactly:

```text
atiehbaratinia.github.io
```

Upload all files from this folder to the repository root. Then open:

**Repository → Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main → Folder: /(root) → Save**

## Customize

- Edit biography and section text in `index.html`.
- Change colors at the top of `styles.css`.
- Replace `profile.jpg` with a newer portrait while keeping the same filename, or update its path in `index.html`.
- Add a CV by placing it in the repository and adding a button such as `<a href="Atieh-Barati-Nia-CV.pdf">CV</a>`.
- Update the Open Graph URL after the final domain is known.
