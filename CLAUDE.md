# CLAUDE.md — maarijbhai.github.io

Spec for this repository. Read fully before making changes. Follow it exactly; ask before deviating.

---

## 1. What this is

A personal engineering portfolio for **Maarij**, final-year BScEng Electrical & Computer Engineering at the University of Cape Town (graduating 2026). Submitted as a university assignment **and** used as a job-application front door for graduate software and embedded roles in Cape Town.

**Live at:** `https://maarijbhai.github.io`
**Repo name:** `maarijbhai.github.io` (must match the GitHub username exactly)

### Assessment criteria — the site is marked on these, optimise for them

1. Creativity and design — originality, effective overall design
2. Content and interest — portrays who he is; informative and interesting
3. Images and graphics — used to enhance, well integrated
4. Layout — attractive, usable, well organised
5. Navigation — easy forwards and backwards, **all links must work**
6. Artefacts — evidence of achievements and skills
7. Writing mechanics — no spelling or grammatical errors

Not on the list: technical sophistication of the stack. Do not spend effort on clever engineering that does not show up visually. Effort goes to content, imagery, layout, and polish.

**Deadline: Friday 21 August, 23:55.** Working and complete beats clever and half-finished. If a choice is between polish and completeness, choose completeness.

---

## 2. Local setup

The project lives in a **local, non-synced folder** — e.g. `C:\dev\maarijbhai.github.io`.

**Never place this repo inside OneDrive, Dropbox, or Google Drive.** Cloud sync corrupts `.git` during writes and causes file-lock failures against `node_modules`. Git and GitHub are the backup; no sync tool is needed.

---

## 3. Stack

- **Astro 5** (static output, no SSR)
- **Content collections** for projects — one markdown file per project
- **Plain CSS** with custom properties in a single `global.css`. No Tailwind, no CSS framework.
- **`astro:assets`** (`<Image />`) for all local images — non-negotiable
- **Fontsource** for self-hosted fonts
- **GitHub Actions** -> GitHub Pages

### Hard constraints

- **No new dependencies without asking.** The list above is the whole list.
- **No React, Vue, or Svelte.** For interactivity, write a small vanilla `<script>`.
- **No file over 2 MB in the repo.** GitHub Pages caps at 100 MB/file and ~1 GB/repo.
- **No video files committed.** Unlisted YouTube embeds, or short (<15 s) muted `.webm` loops under 2 MB.
- Static output only. No server code, no API routes, no database.

### Astro config

```js
// astro.config.mjs
export default defineConfig({
  site: 'https://maarijbhai.github.io',
  // NO `base` — repo is <username>.github.io, so the site is served from root.
});
```

If `base` appears here, the repo name is wrong.

---

## 4. Design direction

The visual language is **the engineering datasheet** — the document Maarij reads every day. Precise, information-dense, hairline-ruled, unafraid of tabular data. Not a "creative portfolio" template, not a startup landing page.

Deliberately avoided: cream-and-terracotta editorial, dark-mode-with-neon-accent, numbered-section broadsheet. Those are defaults, not decisions.

### Colour tokens

```css
--paper:  #FBFBF9;  /* page background — datasheet stock, barely warm */
--ink:    #14181D;  /* body text, near-black with a cool cast */
--muted:  #5C6672;  /* captions, metadata, secondary text */
--rule:   #C9CFD6;  /* hairlines, borders, table rules */
--signal: #1B4DB1;  /* links, active nav, primary accent (silkscreen blue) */
--trace:  #E8A33D;  /* measured values and data highlights ONLY */
```

`--trace` is rationed. It marks numbers that were actually measured (gain, efficiency, accuracy, latency). If it appears anywhere it is not marking real data, remove it.

### Typography

- **Display** — `Archivo` (600/700). Headings, nav, project titles. Tight tracking at large sizes.
- **Body** — `Source Serif 4` (400/600). All prose. Keeps 200-word write-ups readable.
- **Data** — `IBM Plex Mono` (400/500). Spec blocks, tags, dates, captions. Uppercase with generous letter-spacing at small sizes.

Type scale (rem): `0.75 / 0.875 / 1 / 1.25 / 1.5 / 2 / 2.75 / 3.75`. Body at 1.125rem, measure capped at 68ch.

```bash
npm install @fontsource-variable/archivo @fontsource-variable/source-serif-4 @fontsource/ibm-plex-mono
```

### Signature element — the spec block

Every project page opens with a datasheet-style parameter block: two columns, mono type, hairline rules between rows. Real parameters only, from frontmatter — Role, Period, Stack, Key result. This is the one memorable repeated device on the site. It encodes real information; it is not decoration.

Carry the same hairline logic into the project grid and section dividers. Everything else stays quiet: generous whitespace, no shadows, no gradients, `border-radius: 2px` maximum.

### Motion

Almost none. A single fade-and-rise on project cards entering the viewport, 300 ms. Nav underline on hover. Nothing else. All of it disabled under `@media (prefers-reduced-motion: reduce)`.

### Quality floor — not optional

- Responsive down to 360 px — test the project grid and spec block specifically
- Visible keyboard focus rings using `--signal`
- Semantic HTML: real `<nav>`, `<main>`, `<article>`, one `<h1>` per page, headings in order
- Alt text on every image describing engineering content ("assembled power board showing buck converter stage"), never "image1"
- Body text contrast >= 4.5:1

---

## 5. File structure

```
maarijbhai.github.io/
├── CLAUDE.md
├── README.md
├── MEDIA.md                       # checklist of real media still to be added
├── astro.config.mjs
├── package.json
├── .github/workflows/deploy.yml
├── scripts/
│   ├── make-placeholders.mjs      # generates placeholder images
│   └── process-media.sh           # ffmpeg/sharp batch conversion (used later)
├── raw-media/                     # GIT-IGNORED. Drop originals here.
│   └── <project-slug>/
├── public/
│   ├── cv/maarij-cv.pdf
│   └── favicon.svg
└── src/
    ├── content.config.ts
    ├── content/projects/
    │   ├── ecg-digitisation.md
    │   ├── antarctic-remote-sensing.md
    │   ├── usb-c-pd-charger.md
    │   ├── micromouse.md
    │   └── voice-triage-pwa.md
    ├── assets/
    │   ├── placeholders/
    │   │   ├── hero-16x9.png
    │   │   └── figure-4x3.png
    │   ├── portrait.png            # placeholder until a real photo exists
    │   └── projects/<slug>/
    ├── components/
    │   ├── Nav.astro
    │   ├── Footer.astro
    │   ├── ProjectCard.astro
    │   ├── SpecBlock.astro
    │   ├── Figure.astro
    │   ├── VideoEmbed.astro
    │   └── PrevNext.astro
    ├── layouts/
    │   ├── Base.astro
    │   └── Project.astro
    ├── pages/
    │   ├── index.astro
    │   ├── about.astro
    │   ├── projects/index.astro
    │   ├── projects/[...slug].astro
    │   ├── cv.astro
    │   ├── contact.astro
    │   └── 404.astro
    └── styles/global.css
```

Add to `.gitignore`: `raw-media/`

---

## 6. Media placeholders — build the site fully before real media exists

Real photos and videos arrive later. **The site must build, deploy, and look finished with placeholders in place.** Nothing is blocked on media.

### Placeholder images

`scripts/make-placeholders.mjs` generates flat PNGs in the design palette (`--rule` background, `--muted` mono label showing the intended dimensions). Generate two sizes: `hero-16x9.png` at 1600×900 and `figure-4x3.png` at 1200×900.

Every project's `hero` points at a placeholder until a real image is dropped in. Alt text is written for the *intended* image now, not for the placeholder.

### Swapping in real media later

Convention — real files go in `src/assets/projects/<slug>/` and are named by role:

```
src/assets/projects/micromouse/
├── hero.jpg          # replaces the hero placeholder
├── figure-01.jpg
└── figure-02.jpg
```

Swapping is then a one-line frontmatter change per project. Design every component so this is true.

### Video

`VideoEmbed.astro` takes an optional `youtubeId` prop:
- If set — renders a lazy-loaded, responsive 16:9 YouTube embed
- If empty — renders a hairline-ruled placeholder box with a mono label reading `VIDEO — TO BE ADDED`

Never let a missing video break a layout or leave a gap.

### MEDIA.md

Maintain a checklist so Maarij knows exactly what to shoot or find:

| Project | Hero | Figures | Video | Status |
|---|---|---|---|---|
| ECG digitisation | placeholder | 0/2 | — | needs media |

Update it whenever real media lands.

### ffmpeg commands (for later, when real media arrives)

```bash
# Photo -> web-ready, max 1600px wide
ffmpeg -i input.jpg -vf "scale='min(1600,iw)':-2" -q:v 3 hero.jpg

# Video -> short silent loop under 2 MB
ffmpeg -i input.mp4 -t 12 -an -vf "scale=1280:-2,fps=24" -c:v libvpx-vp9 -crf 36 -b:v 0 loop.webm
```

Anything longer than ~15 s goes to unlisted YouTube instead.

---

## 7. Content schema

```ts
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title:      z.string(),
    blurb:      z.string().max(160),
    period:     z.string(),            // "Mar – Jun 2025"
    order:      z.number(),
    featured:   z.boolean().default(false),
    role:       z.string(),            // "Firmware and PCB design"
    domain:     z.enum(['hardware', 'embedded', 'software', 'ml', 'rf']),
    stack:      z.array(z.string()),
    keyResult:  z.string(),            // ONE measured outcome with a number
    hero:       image(),
    heroAlt:    z.string(),
    youtubeId:  z.string().optional(),
    repo:       z.string().url().optional(),
    demo:       z.string().url().optional(),
  }),
});

export const collections = { projects };
```

`keyResult` is required. If a project has no measurable outcome, raise it with Maarij — do not invent a number and do not make the field optional to work around it.

`domain` drives filter chips on the projects index. Filtering is vanilla JS toggling a class.

---

## 8. Page requirements

**Home** — full-width hero (placeholder for now), name, one-line positioning, three featured project cards, entry points to Projects and About.

**About** — professional-identity page, first person, ~400 words. Path into engineering, what he's drawn to (embedded systems and RF, moving increasingly into software), the AQUA Project internship, tutoring EEE3088F. Written as a person, not a CV in prose. Includes a portrait (placeholder for now).

**Projects index** — card grid, filter chips by `domain`, sorted by `order`.

**Project page** — spec block, hero figure, then narrative under:
*Problem -> constraints -> what I built -> result -> what I'd do differently.*
Two figure slots plus a `VideoEmbed` slot, all placeholder-tolerant. Ends with "← All projects" and prev/next.

**CV** — embedded PDF preview plus download button. The PDF must open.

**Contact** — email, LinkedIn, GitHub. Plain links, no form (no backend).

### Navigation rules — marked criterion, treat as hard requirement

- Persistent nav on every page, current page marked `aria-current="page"`
- Every project page has both a back link and prev/next
- Footer repeats primary nav
- A real `404.astro` with a route home
- **Zero broken links.** Verify before every commit.

---

## 9. Writing

Register: direct, specific, no marketing language. Engineers are the readers.

- Lead with what was built and what it measured, not with adjectives
- Numbers over claims: "9.4 dBi, VSWR < 1.5 across the band" beats "high-performance antenna"
- Banned: "passionate about", "cutting-edge", "leveraged", "delve", "showcase", "journey"
- South African English: optimise, analyse, metre, colour
- Contractions fine; exclamation marks not
- **Writing mechanics is a marked criterion.** Never commit lorem ipsum. Placeholder *prose* is forbidden even where placeholder *images* are expected — if real copy is missing, ask Maarij for it.

---

## 10. Build order

Complete and verify each step before starting the next.

1. Astro scaffold + `astro.config.mjs` + GitHub Actions workflow -> **confirm live deploy** before anything else
2. `global.css` — tokens, type scale, resets, focus states
3. `Base.astro` — head, skip link, `Nav`, `Footer`
4. `scripts/make-placeholders.mjs` -> generate placeholder assets
5. `content.config.ts` + all five project markdown files with real frontmatter and real prose
6. `SpecBlock.astro`, `Figure.astro`, `VideoEmbed.astro`, `ProjectCard.astro`, `PrevNext.astro`
7. `Project.astro` + `pages/projects/[...slug].astro`
8. `pages/projects/index.astro` with filters
9. `index.astro`, `about.astro`, `cv.astro`, `contact.astro`, `404.astro`
10. Responsive pass at 360 px, then link check, then `npm run build`

---

## 11. Working agreement

- Small, reviewable changes. One component or page per step, then stop.
- Explain what changed and why in one or two sentences.
- Never invent project facts, dates, or measurements. If a detail is missing, ask.
- Never bulk-rewrite files that already work.
- Run `npm run build` before declaring anything done — a passing dev server is not proof.
- Prefer deleting to adding. If a section does not earn its place, cut it.
