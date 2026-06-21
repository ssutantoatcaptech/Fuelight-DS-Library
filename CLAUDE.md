# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
# Build tokens → CSS via Style Dictionary
npm run build

# The build reads tokens/tokens.json and outputs to build/css/
```

## Architecture

This is a **Token Studio → Style Dictionary → CSS** pipeline for the Fuelight Design System. The flow:

1. Tokens are exported from Figma via Tokens Studio into `tokens/tokens.json`
2. `sd.config.js` processes tokens (math, references, composites) via Style Dictionary
3. Compiled CSS custom properties land in `build/css/light.css` and `build/css/dark.css`
4. `components/` contains BEM-style CSS using `fl-` prefix, referencing compiled tokens with fallbacks
5. `icons/` holds SVG assets synced from Figma

Components follow the pattern: `var(--token-name, #fallback)` and are added to `components/index.css` barrel.

---

# Fuelight Design System Context & AI Guardrails

## 1. System Guardrails & Strict Constraints
* **Pure CSS Architecture:** This codebase relies on a vanilla HTML/CSS setup (95.5% CSS). Do NOT install or introduce utility frameworks (e.g., Tailwind), CSS-in-JS libraries, or external UI component frameworks (e.g., Radix, shadcn) unless explicitly commanded.
* **No Hardcoded Values:** Every color, spacing increment, border-radius, font size, or transition *must* utilize the compiled CSS variables found in `build/css/`. If a required token feels missing, map it to the closest logical primitive or halt and ask.
* **Output Directory Isolation:** * Do NOT manually edit files in `build/css/` (e.g., `light.css`, `dark.css`). These are compiled automated outputs from Style Dictionary.
    * All generated UI screens, sandbox previews, and modular layouts must be built cleanly inside the `components/` directory.

## 2. Directory Map & Source of Truth
When writing code, generating components, or parsing variables, adhere strictly to this repository structure:
* `tokens/tokens.json`: The source of truth dictionary exported from Figma via Tokens Studio.
* `sd.config.js`: The Style Dictionary configuration processing token math, references, and composites.
* `build/css/light.css`: Core primitives and light mode semantic variable tokens (Default).
* `build/css/dark.css`: Dark mode semantic variable overrides.
* `components/`: Contains production-ready screen-level and block-level UI components (e.g., the 360 analytics screen layouts).
* `icons/`: Pure SVG icon assets synced directly from the Figma Design System.
* `scripts/`: Internal asset and syncing utilities.

## 3. Token Tier Hierarchy & Theme Mapping
Apply design system variables using the following exact tiered hierarchy:
1.  **Core Set (Primitives - `--flCore...`):** Global structural constants. Use primarily for foundational layouts, base grid spacing, or un-themed values.
2.  **Semantic Sets (`--flBg...`, `--flFg...`):** Context-aware overrides for surfaces, borders, interactive states, and text colors.
3.  **Theme Set (Component Tokens):** High-level explicit mappings for elements like buttons, inputs, and cards (e.g., `--flButtonPrimaryBackground`, `--flButtonBorderRadius`).

### Dark Mode Implementation
Dark mode is activated globally via a data attribute on the body element. Ensure component states rely on semantic token shifts rather than manual hex overrides:
```css
/* Style Dictionary automatically handles variable overrides on the root, 
   but specific structural overrides should match this selector wrapper: */
body[data-theme="dark"] .YourComponentClass {
  /* Layout-specific tweaks if required */
}
```
