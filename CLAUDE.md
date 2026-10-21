# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static HTML/CSS/JS site (Cedar Mill) built from Figma designs. No framework and no bundler: plain HTML pages, Tailwind CSS v4 (via `@tailwindcss/cli`) and native ES modules. The project is currently a bare scaffold: `pages/index.html` is an empty template and `assets/css`, `assets/js` and `assets/images` are empty.

## Commands

- `npm run dev`: compiles `assets/css/style.css` to `dist/style.css` with the Tailwind CLI in `--watch` mode, so it does not exit.
- `npm run build`: one-off minified CSS build, then assembles the deployable site in `public/` (pages at the root, plus `assets/` and `dist/`). Vercel runs this and serves `public/` (see `vercel.json`). `public/` is git-ignored.
- `npm run lint:fix`: runs ESLint with `--fix`, then Prettier `--write`, over the whole repo.
- Husky and lint-staged run ESLint and Prettier on staged files at commit. The repo has no ESLint, Prettier or Husky config files yet, and it is not a git repository yet.
- No test suite is set up.

## Architecture

- **CSS entry**: `assets/css/style.css` holds only the Tailwind `@import`, the imports of the other CSS files (`base.css`, `component.css`, `layout.css`, `utilities.css`, in that order) and one `@theme{}` block. Every design token lives in that block: breakpoints, `--spacing: 1px`, fonts, colors and text sizes. Because `--spacing` is 1px, utilities map straight to pixels (`pt-100` = 100px), and responsive variants are max-width breakpoints (`max-768:…`).
- **What goes in each CSS file**:
  - `base.css`: `@font-face`, heading sizes, `.title-*` and `.content-*` color modifiers, and the three `.container-fluid*` horizontal-padding wrappers.
  - `component.css`: buttons and form controls.
  - `layout.css`: header and footer only.
  - `utilities.css`: section styles and helper classes.
- **JS**: `assets/js/app.js` is the only entry point. It is loaded with `type="module"`, imports one init function per feature file, and calls each one inside a single `DOMContentLoaded` listener.
- **Assets**: images and icons are saved locally as WebP/AVIF under `assets/images/` (icons under `assets/icons/`). Fonts (Cormorant Garamond, Manrope) load from Google Fonts via `<link>` tags in each page's `<head>`, not local WOFF2 files. This was the user's decision and overrides performance rule 5. If a font isn't on Google Fonts, use the closest Google Fonts alternative.

## Rules

`.claude/rules/html-css-js-rules.md` is the authoritative coding standard and must be followed exactly. These are the rules most often missed:

- Every Figma value must be copied exactly. If a value is not yet a token, add it to `@theme{}` as a new token. Never snap to the nearest existing token, and never invent tokens.
- No arbitrary `[]` values, inline styles, raw CSS (except `@font-face`), `@media` queries, `@layer` blocks or `:root` variables. Style through `@apply` in the CSS files.
- The only Tailwind classes allowed in HTML are spacing (`p`, `m`, `pt`, `pb`), section `bg-*`, `max-w-*`, and flex/grid layout classes.
- Section horizontal padding must reuse a `.container-fluid*` class. If Figma has a new exact px value, add a step to those shared classes.
- Headings are wrapped in `.title` plus a color class, and paragraphs in `.content` plus a color class. Never put classes on `h1`–`h6` or `p` directly.
