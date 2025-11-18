# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal academic website built with Docusaurus 3.4.0 for Seungwon Yang, an HCI researcher at POSTECH. The site showcases publications, projects, and various web-based developer tools. It uses a hybrid approach combining Docusaurus pages (React/TypeScript) with MDX/Markdown content, styled with Tailwind CSS and shadcn/ui components.

**Key Technologies:**
- Docusaurus 3.4.0 (React-based static site generator)
- TypeScript
- Tailwind CSS v4 with custom Docusaurus integration
- shadcn/ui components (Radix UI primitives)
- SWC loader for faster TypeScript compilation

## Development Commands

```bash
# Install dependencies (npm is preferred over yarn despite README mentioning yarn)
npm install

# Start development server (opens browser, hot reload enabled)
npm start

# Type checking only
npm run typecheck

# Build for production (outputs to build/ directory)
npm build

# Serve production build locally
npm run serve

# Clear Docusaurus cache and generated files
npm run clear

# Add new shadcn/ui components
npx shadcn@latest add [component-name]
```

## Architecture and Code Organization

### Page Types and Routing

The site uses **file-based routing** with three distinct page types:

1. **Pure Markdown pages** (`src/pages/**/*.md`): Rendered using Docusaurus's default layout
   - Example: `src/pages/about.md`

2. **React/TSX pages** (`src/pages/**/*.tsx`): Full control over layout and components
   - Example: `src/pages/index.tsx`, `src/pages/tools.tsx`

3. **MDX pages** (`src/pages/**/*.mdx`): Markdown with React component imports
   - Example: `src/pages/misc/voca-web.mdx`

**Important:** The `docs` and `blog` features are explicitly disabled in `docusaurus.config.ts` (lines 37-38). All content lives in `src/pages/`.

### Component Structure

**UI Components** (`src/components/ui/`):
- shadcn/ui components adapted for Docusaurus
- Use the `cn()` utility from `@/lib/utils` for class name merging
- Follow Radix UI patterns with Tailwind styling
- Components: `button.tsx`, `card.tsx`, `input.tsx`, `select.tsx`, `tabs.tsx`, etc.

**Page Components**:
- Feature cards on homepage (`src/pages/index.tsx`) use inline component definitions
- Tools page (`src/pages/tools.tsx`) has complex filtering/search with keyboard shortcuts
- Individual tool pages (`src/pages/tools/*`) are standalone interactive React apps

### Styling System

**Dual Styling Approach** (Tailwind + Docusaurus CSS variables):

1. **Docusaurus CSS Variables** (`src/css/custom.css`):
   - Primary colors: `--ifm-color-primary` and variants (dark, darker, darkest, light, lighter, lightest)
   - Background colors: `--ifm-background-color`, `--ifm-card-background-color`
   - Font colors: `--ifm-font-color-base`, `--ifm-font-color-secondary`
   - Supports light/dark theme via `[data-theme="dark"]`

2. **Tailwind CSS v4**:
   - Extended with custom colors mapped to Docusaurus CSS variables (see `tailwind.config.js` lines 28-42)
   - Custom animations: `terminal-blink`, `terminal-glow`, `fadeInUp`, `gradientShift`
   - Monospace font styling via `.terminal-text` class
   - Preflight disabled to avoid conflicts with Docusaurus (line 6)

**Usage Pattern**: Use Tailwind utilities for component styling, but reference Docusaurus CSS variables via `var(--ifm-*)` in inline styles for theme consistency.

### Path Alias Configuration

The `@/` alias is configured to point to `src/`:
- Webpack alias in `docusaurus.config.ts` (lines 162-166)
- TypeScript path mapping in `tsconfig.json`
- Components reference: `@/lib/utils`, `@/components/ui/*`

### Tool Pages Architecture

Tools are cataloged in `src/pages/tools.tsx` with metadata:
- Category-based filtering (image, text, utility, time, audio)
- Tag-based search
- Grid/list view modes with keyboard shortcuts (Ctrl+K, Ctrl+G, 1-6 keys)
- Each tool is a separate page in `src/pages/tools/[tool-name].tsx`

Common patterns for tool pages:
- Client-side only (browser APIs like FileReader, Canvas, etc.)
- Use shadcn/ui components for UI consistency
- Include error handling and user feedback via `sonner` toast notifications

## Important Conventions

### Adding New Tools

1. Create tool page in `src/pages/tools/[name].tsx`
2. Add entry to `tools` array in `src/pages/tools.tsx` with:
   - `to`: route path
   - `name`: display name
   - `description`: short description
   - `category`: one of 'image', 'text', 'utility', 'time', 'audio'
   - `tags`: array of searchable keywords

### Adding shadcn/ui Components

Run `npx shadcn@latest add [component]` which:
- Downloads component to `src/components/ui/`
- Automatically uses `@/` path alias
- May need manual adjustment for Docusaurus compatibility

### Static Assets

- Images: `static/img/`
- PDFs: `static/` (e.g., `cv.pdf`)
- Reference in code: `require("/cv.pdf").default` or `/img/filename.jpg`

### Publications Management

Edit `src/pages/publications.tsx` to update:
- `publications` array for conference papers
- `demonstrations` array for posters/demos/workshops
- Uses dangerouslySetInnerHTML for `<strong>` tags in citations

## Configuration Files

- `docusaurus.config.ts`: Site metadata, navbar, footer, theme config, webpack customization
- `tailwind.config.js`: Tailwind extended theme with Docusaurus variable mappings
- `babel.config.js`: Babel preset for Docusaurus
- `tsconfig.json`: TypeScript configuration with `@/` path alias
- `components.json`: shadcn/ui configuration (path alias, Tailwind config location)

## Development Notes

- **Node version**: Requires Node.js >= 18.0 (specified in `package.json`)
- **Dark mode**: Implemented via Docusaurus's `[data-theme="dark"]` attribute
- **Terminal aesthetics**: Site uses monospace fonts and terminal-inspired animations for developer tool pages
- **External link icons**: Custom CSS fixes alignment (lines 43-57 in `custom.css`)
- **SWC compilation**: Uses `swc-loader` instead of Babel for faster TypeScript builds (configured in webpack plugin)

## Deployment

Deployed via GitHub Pages:
- Production URL: https://ysw.kr/
- Deploy command: `npm run deploy` or with SSH: `USE_SSH=true npm run deploy`
- CNAME file in `static/` for custom domain
