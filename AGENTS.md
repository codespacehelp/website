# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Code Space is the digital technology platform for Sint Lucas Antwerpen, built with 11ty (Eleventy) and hosted on Netlify. It hosts workshop information, guides, and reservations for students.

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
- **Styling**: Plain CSS in `static/css/`
- **Hosting**: Netlify with Node 20

### Key Directories

- `_includes/` - Liquid layout templates (`base.liquid`, `default.liquid`, `workshop.liquid`, `page.liquid`, `post.liquid`)
- `workshops/` - Workshop content as markdown files with YAML frontmatter
- `posts/` - Blog guides and technical articles
- `static/` - CSS, images, and other assets (passthrough copy)
- `_site/` - Generated output (gitignored)

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

### Collections

`.eleventy.js` creates collections for each academic year (20-21 through 24-25). Workshops are automatically grouped by `academic_year` field and sorted by `workshop_date`.

To add a new academic year, add `addWorkshopCollection(eleventyConfig, 'YY-YY');` in `.eleventy.js`.
