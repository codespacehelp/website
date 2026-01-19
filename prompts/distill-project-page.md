# Distill Project Page (Code Space)

You are writing a case-study project page for Code Space (codespace.help). You have access to a folder with project files and images. Your job is to distill the project into a clear, technical post that explains how the system works, why the approach is interesting, and how it was implemented. This is not a tutorial or a list of tools.

## Output location

- Save the final post at `_project/index.md` inside the same folder.
- Copy any images you use into `_project/` and reference them with relative paths.

## Voice + framing

- The student is the initiator/author of the concept. Code Space provided coaching and technical support. Use that phrasing.
- Use neutral, precise language; avoid phrases like “Here’s the interesting part.”
- Aim for a friendly, efficient, technical tone.

## Frontmatter (required)

Add a frontmatter block at the top:

```
---
layout: project
tags: project
title: [Project Title]
summary: [Project Summary - max 20 words]
project_year: [If you can deduce from file metadata - otherwise write FIXME]
project_type: [e.g. Remote exhibition interface, Interactive narrative experience, Generative design system, ...]
tech_stack: [e.g. Python, SVG, Adobe Illustrator]
student: [Student's Name if you know it - otherwise write FIXME]
coaching: Code Space
thumbnail: /static/projects/<slug>/<image>
---
```

Rules:

- Extract metadata from filenames/README/frontmatter where possible.
- If any field is missing or unclear, write `FIXME` in its place.
- Ensure `project_year`/`project_month` match the project slug when applicable.
- Use a comma-separated string for `tech_stack` (not a YAML list).
- Pick a thumbnail that exists in `/static/projects/<slug>/`.

## Image + file hygiene

- All image links inside the post must use `/static/projects/<slug>/...` paths (no relative paths).
- Avoid duplicate top-level titles: if `title` is in frontmatter, do not add another `# Title` in the body.

## Structure

Use clear sections like:

1. The Concept - what was this project about?
2. The Engine / System Overview - what are the large scale components and how do they fit together?
3. Core Mechanisms (e.g., navigation, data model, rendering)
4. Interaction Details (UI, overlays, feedback loops)
5. Working Method (steps, workflow, repeatable process)
6. Technical Notes (constraints, performance, formats)
7. Outcome & Takeaways
8. Conclusion + Credits

Adjust headings as needed, but keep the flow.

## Code sections (CWEB-style)

- Interleave short explanation paragraphs with compact code snippets.
- Precede each snippet with a short label (e.g., “Navigation logic”, “Scene rendering”).
- Add brief inline comments inside code blocks to explain intent.
- Keep snippets short and focused; do not paste entire files.

## Content goals

- Explain why the approach is interesting, not just what was done.
- Make the underlying system reproducible.
- Be concise: prefer explanation over exhaustive lists.
