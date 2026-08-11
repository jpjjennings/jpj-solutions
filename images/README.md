# Images

This folder is for local image assets used by the JPJ Solutions website.

## Current setup

The live site currently pulls **portfolio and preview images directly from
[Unsplash](https://cdn.prod.website-files.com/6151dc84942ef8fe3bbcf36e/62b02c6b2ec6e72c6f8a0337_unsplash_few_things.png via remote URLs (see the `data-image` and
`src` attributes on each `.project-card` in `index.html`). This keeps the repo
lightweight and requires no local files to get started.

## Recommended local assets to add here

For production you should host your own optimised images rather than relying on
remote URLs. Suggested files to drop into this folder:

| File | Used for | Suggested size |
| ---- | -------- | -------------- |
| `og-preview.jpg` | Open Graph / Twitter social share card | 1200 × 630 |
| `avatar.jpg` | About-section portrait (replaces the "JPJ" initials circle) | 560 × 560 |
| `project-shopease.jpg` … | Portfolio thumbnails / modal images | 1200 × 800 |
| `favicon.svg` / `favicon.png` | Browser tab icon | 100 × 100 |

## How to swap the Unsplash images for local ones

1. Add your optimised image to this `images/` folder.
2. In `index.html`, find the relevant `.project-card` and update **both**:
   - `src="images/your-file.jpg"` (grid thumbnail)
   - `data-image="images/your-file.jpg"` (modal / lightbox large view)
3. Update the `alt` text to describe your new image.
4. Keep files compressed (use WebP/AVIF where possible) for fast loading.

> Tip: the `<img>` tags already use `loading="lazy"` and explicit
> `width`/`height` to avoid layout shift — keep those attributes when swapping.
