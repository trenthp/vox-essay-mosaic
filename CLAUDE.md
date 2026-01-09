# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vox Essay Mosaic is a static website for a personal essay publication that releases quarterly themed editions featuring 20 curated voices. The first edition theme is "Transformation." The site is a marketing/landing page with author profiles, submission information, and email signup.

## Development

This is a vanilla HTML/CSS/JS project with no build tools or package manager. To develop:

1. Open any HTML file directly in a browser
2. Use a local server for development (e.g., `python -m http.server` or VS Code Live Server)

## Architecture

### CSS Structure (load order matters)

1. **`css/base.css`** - Resets, reduced-motion preferences, link resets
2. **`css/styles.css`** - Main styles with CSS custom properties for theming:
   - Color palette via `--gray-*` variables
   - Neumorphic shadow system (`--neu-outset`, `--neu-inset`, `--neu-flat`, `--neu-subtle`)
   - All interactive elements use these shadow variables for pressed/unpressed states
3. **`css/pages.css`** - Shared styles for content pages (about, contact, submit, faq)
4. **`css/author.css`** - Author profile page specific styles

### JavaScript (`js/main.js`)

Single file handling:
- Parallax effect on floating words (disabled for `prefers-reduced-motion`)
- Email form submission with success state
- Intersection Observer for mosaic tile reveal animations

### Page Types

- **`index.html`** - Home/landing with hero, author mosaic grid, quote, and signup
- **`author.html`** - Individual author profile template
- **`about.html`, `submit.html`, `faq.html`, `contact.html`** - Content pages using `pages.css`
- **`author-faq.html`** - FAQ specific to contributors

### Design System

- Font: Inter (Google Fonts) with weights 300, 400, 500, 600
- Minimal grayscale palette with black as the only accent color

**Shadow system (interactive elements only):**
- Neumorphic shadows (`--neu-outset`, `--neu-inset`) are ONLY for functional/pressable elements
- Buttons toggle between `--neu-outset` (raised) and `--neu-inset` (pressed) on hover
- Form inputs use `--neu-inset` to indicate "pressable" input area
- Never apply neumorphic shadows to decorative or informational elements

**Grid pattern (non-interactive content):**
- `--grid-pattern` CSS variable defines a subtle 80px grid
- `.grid-pattern` utility class applies grid to any container
- Used on content areas that need visual interest without implying interactivity (e.g., quote section)

**Non-interactive elements:**
- Use subtle borders (`border: 1px solid var(--gray-200)`) instead of shadows
- Examples: stat cards, feature items, theme tags, informational badges

## Documentation

The `docs/` folder contains editorial content (submission guidelines, contributor agreement, etc.) - these are reference materials, not part of the website build.
