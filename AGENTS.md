# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Code Space is the digital technology platform for Sint Lucas Antwerpen, built with 11ty (Eleventy) and hosted on Netlify. It hosts workshop information, guides, machine specifications, and project showcases for students.

## Commands

```bash
npm install          # Install dependencies
npm start            # Start dev server with hot reload (localhost:8080)
npm run build        # Production build (outputs to _site/)
npm run clean        # Remove _site directory
npm run format       # Format code with Prettier
```

Deployment: Push to `master` branch auto-deploys to Netlify.

## Architecture

- **Framework**: 11ty v3 with Liquid templating (ES modules)
- **Styling**: Plain CSS in `static/css/` — design system + main + tabs
- **Fonts**: Noto Sans (body), IBM Plex Mono (headings/code) via Google Fonts
- **Hosting**: Netlify with Node 20

### Key Directories

- `_includes/` - Liquid layout templates and reusable partials
  - Layouts: `base.liquid`, `default.liquid`, `workshop.liquid`, `machine.liquid`, `project.liquid`, `guide.liquid`, `page.liquid`
  - Partials: `card.liquid`, `tech-line.liquid`, `section-header.liquid`
- `workshops/` - Workshop content as markdown files with YAML frontmatter
- `guides/` - Technical guides and articles (formerly `posts/`)
- `machines/` - Machine pages (laser cutter, 3D printer, PCs, plotter) with images
- `projects/` - Student project showcases
- `static/` - CSS, images, and other assets (passthrough copy)
- `_site/` - Generated output (gitignored)

### CSS Architecture

- `design-system.css` - CSS variables (colors, fonts), typography classes (.text-T, .text-s, .text-d, .text-p, .text-i, .text-h, .text-link), card component, tech line, button, section header, and page-specific styles
- `main.css` - Global resets, base elements, forms, tables, footer, content utilities
- `tabs.css` - Site header, logo, tab navigation

### Color Palette (CSS Variables)

- `--color-main`: #333254 (dark purple — main content background)
- `--color-tabs`: #282842 (darker purple — tab bar, card backgrounds)
- `--color-back`: #1c1b2d (darkest — body background)
- `--color-highlight`: #acc41e (green-yellow — accents, links, buttons)
- `--color-white`: #fff
- `--color-border`: #84847c (grey — borders)

### Navigation

Defined in `_data/navigation.json`. Current tabs: Home, Machines, Projects, Guides, Workshops.

Reservations link to external service: `https://reservations.codespace.help/`

### Mobile Menu (<=768px)

The mobile navigation uses a card-stack system (class prefix `mobilemenu`) defined in `_includes/default.liquid` and styled in `static/css/tabs.css`. It replaces the desktop horizontal tabs on mobile/tablet viewports.

**Architecture**:
- Each nav tab is a `.mobilemenu__page` containing a `.mobilemenu__tab` (parallelogram tab label) and a `.mobilemenu__body` (content area)
- The active page's body (`<main class="mobilemenu__body mobilemenu__body--active">`) IS the main content container — `{{ content }}` renders inside it
- Active page detection uses `page.url == tab.url` or `page.url contains tab.url` (for sub-pages like `/machines/3d-printer/`)
- Non-active pages are `position: absolute`, active page is `position: relative` (in flow)
- The site header uses `height: 0; overflow: visible` so the logo floats over the card area without taking layout space

**Behavior**:
- **Closed**: Only the active tab is visible with a hamburger icon (Google Material Symbols `menu`)
- **Open**: Tapping the active tab fans out all cards in a cascade (`transform: translateY`). Icon changes to `close`. Content pushes down via `padding-top` on `.mobilemenu` container
- **Navigate**: Tapping a non-active card triggers `.mobilemenu__page--navigating` (rises to top, background changes to `--color-main`), then navigates
- Drop-shadows: active card always has shadow; non-active cards only get shadows when menu is open

**CSS Variables** (on `.mobilemenu`):
- `--card-reveal: 55px` — vertical spacing between fanned cards
- `--tab-label-h: 40px` — height of tab labels
- `--anim-duration: 300ms` — animation duration
- `--anim-easing: cubic-bezier(0.4, 0, 0.2, 1)` — animation easing

**Key classes**:
- `.mobilemenu` — container (id: `mobilemenu`)
- `.mobilemenu__page` / `--active` / `--navigating` — each nav card
- `.mobilemenu__tab` / `--active` — parallelogram tab label
- `.mobilemenu__body` / `--active` — card body (active = main content)
- `.mobilemenu__icon` / `__icon-menu` / `__icon-close` — hamburger/close icons
- `.mobilemenu--open` — modifier on container when menu is expanded

**Desktop (>768px)**: All `.mobilemenu__page` elements are `display: none` except the active one which is `display: block` with its tab label hidden. The desktop horizontal tabs (`.tab-nav`) are shown instead.

### Collections (in .eleventy.js)

- **workshops**: Grouped by `academic_year` field (20-21 through 24-25), sorted by `workshop_date`
- **machines**: Filtered by `tags: machine`
- **projects**: Loaded via `getFilteredByGlob('projects/*.md')`, sorted by year
- **guides**: Filtered by `tags: guide`

To add a new academic year, add `addWorkshopCollection(eleventyConfig, 'YY-YY');` in `.eleventy.js`.

### Reusable Components

- **Card** (`card.liquid`): Beveled top-right corner, accepts title/subtitle/text/image/url. Used on Machines, Projects, and Guides listing pages.
- **Tech Line** (`tech-line.liquid`): SVG decorative line — left segment lower, right segment higher, connected by 45-degree diagonal. Used as section dividers.
- **Section Header** (`section-header.liquid`): Tech line + optional subheading text.

### Machine Frontmatter

```yaml
---
layout: machine
tags: machine
name: Laser Cutter
machine_model: BeamBox Pro
description: "Specs and allowed materials..."
image_path: "/machines/mLaserCutter_CodeSpaceSLA.jpg"
---
```

### Guide Frontmatter

```yaml
---
layout: guide
tags: guide
title: Arduino for Artists
subtitle: Physical computing
description: Brief description for cards
---
```

### Workshop Frontmatter

```yaml
---
layout: workshop
tags: workshop
title: Workshop Title
summary: Brief description
academic_year: 24-25
workshop_date: 2024-12-06
workshop_time: 14:00 - 17:00
room: K.02.10
done: false
---
```

### Redirects

Old `/posts/*` URLs redirect to `/guides/*` via `netlify.toml` (301 redirects).
