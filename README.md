# Rishabh Srinivasan — Portfolio

An interactive portfolio built with React, TypeScript, Vite, Three.js and
Framer Motion. Static output, deployable to GitHub Pages with no backend.

---

## Running it

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:7777>.

Other scripts:

| Command             | What it does                                                  |
| ------------------- | ------------------------------------------------------------- |
| `npm run dev`       | Dev server with hot reload                                     |
| `npm run build`     | Type-check, build to `dist/`, write the SPA 404 fallback       |
| `npm run preview`   | Serve the built `dist/` exactly as it will be deployed         |
| `npm run typecheck` | Type-check only                                                |

---

## Where the content lives

Everything factual comes from one file. Edit it and the whole site follows.

- **`src/data/profile.ts`** — experience, projects, skills, education,
  recognition. Each role and project appears once; the comments note where two
  résumés gave the same role different titles.
- **`src/config.ts`** — name, contact details, links, and the hero's role and
  rotating disciplines.

Two things worth knowing:

- The **AdvaGen Pharma** role is titled *Business Analyst Intern* here, matching
  the BA résumé that is offered for download. The AI and SDE résumés call the
  same role *Data Engineering Intern*. One line in `profile.ts` switches it.
- The **résumé download** is `public/resume/Rishabh-Srinivasan-Resume.pdf`.
  Replace that file to update it; the filename is referenced from `config.ts`.

### The photo

The portrait lives at `public/profile/portrait.jpg`. To swap it, replace that
file and update the `width`/`height` on the `Image` in
`src/routes/home/portrait.tsx` to the new intrinsic size. If the file is ever
absent, the About section falls back to a designed identity panel rather than
showing a broken frame.

---

## How it is put together

```
src/
  components/     design system — Button, Heading, Transition, DecoderText, …
  routes/home/    the single-page scroll: intro, experience, projects, analysis,
                  skills, about, index, contact
  routes/project/ the case-study template, driven by profile.ts
  visuals/        the animated schematics (agent graph, pipelines, forecast)
  styles/         reset, global keyframes, custom media definitions
```

**Design tokens** live in `src/components/theme/theme.ts` as a plain object and
are emitted as CSS custom properties at runtime. Change a colour or a type step
there and it propagates everywhere, including the WebGL layer (`glColors`).

**Motion** is CSS-transition based, staged by a small `Transition` component
that hands each section a `status` string. Sections reveal once via
`IntersectionObserver` and then stay revealed.

**The hero field** is a lat/long lattice of points wrapped in a coordinate
graticule, displaced by simplex noise in a custom shader. It leans toward the
pointer, intensifies as the page scrolls, reduces its point count on smaller
screens, honours `prefers-reduced-motion`, and drops to 22% opacity past the
hero so it never competes with body copy.

**No screenshots are invented.** Each project is illustrated with an animated
schematic of its own architecture, drawn from what the résumés actually
describe. Where a detail isn't recorded — the names of five of the nine agents,
which forecasting model won — the visual leaves it unlabelled rather than
filling it in.

---

## Deploying to GitHub Pages

The workflow at `.github/workflows/deploy.yml` builds and publishes on every
push to `main`. It detects the right base path automatically:

- Repository named `<username>.github.io` → served at `/`
- Any other repository name → served at `/<repo>/`

**One-time setup:**

1. Push this repository to GitHub.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to `main` (or run the workflow manually from the **Actions** tab).

Client-side routes survive a hard refresh: the build copies `index.html` to
`404.html`, which GitHub Pages serves for unknown paths. A `.nojekyll` file is
written so Pages doesn't strip asset folders.

To build for a subpath locally:

```bash
BASE_PATH=/your-repo-name/ npm run build
```

---

## Browser support

Modern evergreen browsers. The site uses CSS nesting, `@layer`, `color-mix()`
and `oklch()` — all of which are flattened or preserved by the build for
Chrome 112+, Edge 112+, Firefox 117+ and Safari 16.4+.

Without WebGL the hero still renders correctly; the field simply doesn't draw.
