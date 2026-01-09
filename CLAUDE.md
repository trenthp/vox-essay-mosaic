# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vox Essay Mosaic is a static website for a personal essay publication that releases quarterly themed editions featuring 20 curated voices. The first edition theme is "Transformation." The site is a marketing/landing page with author profiles, submission information, and email signup.

## Development

This is an Astro project deployed to Vercel.

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (localhost:4321)
npm run build      # Build for production
npm run preview    # Preview production build
```

## Architecture

### Project Structure

```
src/
├── components/
│   ├── layout/          # Nav.astro, Footer.astro
│   ├── ui/              # EmailForm.astro, MosaicTile.astro
│   └── Analytics.astro  # Pluggable Umami integration
├── content/
│   ├── authors/         # Markdown files for each author
│   ├── essays/          # Essay content (future)
│   └── editions/        # Edition metadata
├── layouts/
│   ├── Base.astro       # Root layout with head, nav, footer
│   ├── Page.astro       # Content pages (about, faq, etc.)
│   └── Author.astro     # Author profile pages
├── lib/                 # Utility functions
├── pages/               # File-based routing
│   ├── index.astro
│   ├── about.astro
│   ├── submit.astro
│   ├── faq.astro
│   ├── author-faq.astro
│   ├── contact.astro
│   └── authors/[...slug].astro
└── styles/              # CSS files
    ├── base.css
    ├── styles.css
    ├── pages.css
    └── author.css
```

### Content Collections

Authors, essays, and editions are managed via Astro content collections. Schema defined in `src/content.config.ts`.

**Adding an author:**
```markdown
<!-- src/content/authors/name-slug.md -->
---
name: "Author Name"
number: "01"
essayTitle: "Essay Title"
theme: "Theme Tag"
bio: "Author bio text..."
excerpt: "Opening excerpt from essay..."
teaser: "Description of the essay..."
edition: edition-one
published: true
---
```

### CSS Structure

1. **`styles/base.css`** - Resets, reduced-motion preferences
2. **`styles/styles.css`** - Main styles, neumorphic system, components
3. **`styles/pages.css`** - Content page styles
4. **`styles/author.css`** - Author profile styles

### Design System

- Font: Inter (Google Fonts) with weights 300, 400, 500, 600
- Minimal grayscale palette with black as accent

**Shadow system (interactive elements only):**
- `--neu-outset`: Raised/unpressed state
- `--neu-inset`: Pressed state
- Only apply to buttons, form inputs, interactive tiles

**Non-interactive elements:**
- Use borders (`border: 1px solid var(--gray-200)`) instead of shadows

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Analytics (Umami)
UMAMI_SCRIPT_URL=https://your-umami.com/script.js
UMAMI_WEBSITE_ID=your-website-id

# Email Service
EMAIL_SERVICE=buttondown
EMAIL_FORM_ACTION=https://buttondown.com/api/emails/embed-subscribe/USERNAME
```

## External Services

| Service | Purpose | Status |
|---------|---------|--------|
| **Umami** | Analytics with scroll depth | Configure via env vars |
| **Buttondown/ConvertKit** | Email signups | Configure via env vars |
| **Tally** | Submission forms | Embed in submit page |
| **n8n** | Automation (Tally → Notion) | Self-hosted on Railway |
| **Notion** | Submission tracking | Database for pipeline |
| **Vercel** | Hosting | Auto-deploy from main |

## Documentation

The `docs/` folder contains editorial content (submission guidelines, contributor agreement, etc.) - these are reference materials, not part of the website build.
