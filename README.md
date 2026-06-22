# Personal Website

## Development

```bash
npm run dev      # start dev server at localhost:4321
npm run build    # production build to dist/
npm run preview  # preview the production build locally
```

---

## Adding content

### Blog posts

Create a Markdown file in `src/content/posts/`. The filename becomes the URL slug (e.g. `my-post.md` → `/posts/my-post`).

Required frontmatter:

```yaml
---
title: 'Post Title'
pubDate: 2026-01-15
description: 'One-sentence description.'
topic: mathematics    # mathematics | data science | poetry | game design | anthropology | electronics | misc
type: essay           # essay | book review | project update | curriculum
draft: false          # omit or set false to publish; true excludes it from all listings
---
```

`topic` and `type` drive the filter buttons on `/posts`. Add a new value to the list of an existing post and the button appears automatically.

### Works & projects

The "Works & Projects" section on the homepage is driven by the `works` array near the top of `src/pages/index.astro`. Add an entry there:

```ts
const works = [
  // existing entries …
  {
    href: "/posts/my-new-project",   // or an external URL / PDF path
    title: "My New Project",
    description: "One-line description shown under the title.",
    tags: ["games"],                 // any combination of existing or new tags
  },
];
```

Tags are derived automatically from the array, so any new tag string you add will appear as a filter button with no other changes needed.

### Card component

Each entry in `works` renders as a `Card`. The component lives at `src/components/Card.astro` and accepts:

| Prop | Type | Required |
|------|------|----------|
| `href` | string | yes |
| `title` | string | yes |
| `description` | string | no |
| `tags` | string[] | no |

Card aesthetics (border, hover, title color, description size) are all self-contained in that file.

---

## Changing the aesthetics

### Color tokens

All colors are CSS custom properties in the `:root` block at the top of `src/styles/global.css`:

```css
:root {
  --color-bg:           #FBF9FA;   /* page background */
  --color-text:         #2B2024;   /* body text */
  --color-accent:       #FD0054;   /* decorative only: card left border, site title underline */
  --color-accent-text:  #A80038;   /* links, card titles, badges */
  --color-accent-dark:  #6E0025;   /* hover/active states */
  --color-muted:        #777;      /* timestamps, descriptions, footer */
  --color-border:       #E0D8DA;   /* rules, card outlines, tag borders */
}
```

`--color-accent` is used only where readability doesn't matter (decorative borders, underlines). `--color-accent-text` is the readable variant for links and labels.

### Typography

```css
:root {
  --font-serif: Georgia, 'Times New Roman', serif;    /* headings, site title */
  --font-sans:  system-ui, -apple-system, sans-serif; /* body text */
}
```

To use a web font, add a `<link>` to the `<head>` in `src/layouts/Layout.astro` and swap the family name into these variables.

### Size knobs

| What | File | Property |
|------|------|----------|
| Section heading size | `src/styles/global.css` | `h1 { font-size }` |
| Post article title size | `src/layouts/PostLayout.astro` | `hgroup h1 { font-size }` |
| Site title size | `src/components/Header.astro` | `#site-title { font-size }` |
| Body line height | `src/styles/global.css` | `body { line-height }` |
| Article line height | `src/layouts/PostLayout.astro` | `article { line-height }` |
| Max article width | `src/layouts/PostLayout.astro` | `article { max-width }` |

### Card style

Edit `src/components/Card.astro`. The key rules:

- **Border accent** — `.card { border-left }` controls the colored left stripe
- **Hover background** — `.card:hover { background }` 
- **Title color** — `.card-title { color }` (currently `--color-accent-text`)
- **Description size/color** — `.card-desc { font-size, color }`

### Filter buttons

The tag filter buttons on the homepage and the topic/type filters on `/posts` share the same visual style: pill shape (`border-radius: 20px`), bold weight, accent fill when active. On the homepage these styles live in the `<style>` block of `src/pages/index.astro`; on the posts page they live in `src/pages/posts/index.astro`.

---

## File map

```
src/
├── components/
│   ├── Card.astro         # reusable card for works & projects
│   ├── Header.astro       # site title + nav
│   └── Footer.astro       # copyright line
├── content/
│   ├── config.ts          # content collection schema
│   └── posts/             # markdown post files
├── layouts/
│   ├── Layout.astro       # root HTML shell (imports Header, Footer, global.css)
│   └── PostLayout.astro   # article wrapper with title/meta hgroup
├── pages/
│   ├── index.astro        # homepage (about, interests, skills, works, recent posts)
│   └── posts/
│       ├── index.astro    # filterable post list
│       └── [...slug].astro  # dynamic post route
└── styles/
    └── global.css         # site-wide styles and CSS custom properties
```
