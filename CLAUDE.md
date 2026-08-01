# bfzli

A personal blog, "a place where I share my thoughts and learnings", built with Astro and deployed to Cloudflare (Wrangler).

## Project Structure

```
bfzli/
├── src/
│   ├── assets/         # Icons, illustrations, per-experience assets
│   ├── components/     # Astro and Solid components
│   ├── config/         # Site configuration
│   ├── content/        # MDX post collections
│   ├── data/           # Static data
│   ├── layouts/        # Page layouts
│   ├── pages/          # Routes
│   ├── styles/         # Global styles
│   ├── types/          # Centralized types
│   └── utils/          # Helpers
├── scripts/
│   ├── plan-posts.ts   # Post planning + coverage reporting
│   ├── write-post.ts   # Post drafting
│   ├── topics.json     # Topic pool
│   └── queue.json      # Planned post queue
├── public/             # Static assets
├── astro.config.ts
└── wrangler.toml       # Cloudflare deployment
```

## Tech Stack

Astro 5 with MDX, SolidJS islands, Tailwind, and `@astrojs/sitemap`. TypeScript throughout. Prettier plus ESLint for formatting and linting, wired to a Husky pre-commit hook. SVGO for icon optimization.

## Scripts

All scripts run from the project root.

```bash
npm run www:dev        # Dev server on port 9999
npm run www:build      # check + lint + astro build
npm run www:preview    # Build then preview on port 8888
npm run www:check      # astro check (type check)
npm run www:format     # Prettier write
npm run www:lint       # ESLint with --fix

npm run posts:plan     # Plan upcoming posts into scripts/queue.json
npm run posts:write    # Draft a post from the queue
npm run posts:coverage # Report topic coverage
```

## Conventions

- TypeScript everywhere, types centralized in `src/types/`
- Content lives in `src/content/` as MDX with frontmatter
- Icons go through `src/assets/icons.ts`, never inline SVG in pages
- Run `npm run www:build` before deploying, it gates on check and lint

Licensed MIT.
