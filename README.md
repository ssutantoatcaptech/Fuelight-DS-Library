# Fuelight DS Library

Design tokens synced from Figma via [Tokens Studio](https://tokens.studio/), transformed to CSS custom properties via [Style Dictionary](https://styledictionary.com/).

## How it works

```
Figma Variables → Token Studio (plugin) → tokens/tokens.json → Style Dictionary → build/css/
```

1. **Token Studio** syncs Figma variables to `tokens/tokens.json` on this repo
2. **Style Dictionary** + `@tokens-studio/sd-transforms` resolves math, references, and composites
3. **CSS custom properties** are output to `build/css/light.css` and `build/css/dark.css`
4. **GitHub Actions** auto-rebuilds CSS whenever `tokens.json` changes

## Usage

```html
<!-- Light theme (default) -->
<link rel="stylesheet" href="build/css/light.css">

<!-- Dark theme (add to override) -->
<link rel="stylesheet" href="build/css/dark.css">
<body data-theme="dark">
```

```css
.my-button {
  background: var(--flButtonPrimaryBackground);
  color: var(--flButtonPrimaryText);
  border-radius: var(--flButtonBorderRadius);
}
```

## Local development

```bash
npm install
npm run build
```

## Token structure

| Set | Purpose |
|-----|---------|
| `core` | Primitives: colors, dimensions, spacing, typography, radius, opacity |
| `light` | Semantic tokens for light mode (fg, bg, accent, shadows) |
| `dark` | Semantic tokens for dark mode |
| `theme` | Component tokens (button, card, typography, shadows) |

## Figma source

[Design System — Fuelight](https://www.figma.com/design/itYb61KOPXsUQcSJrgl48I/)
