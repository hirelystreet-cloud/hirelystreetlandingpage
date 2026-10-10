<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
# HirelyStreet landing page

Stack: Next.js (App Router), TypeScript, Tailwind v4.

## Rules
- Read DESIGN.md before ANY UI work. Its tokens, radii, type scale and Do/Don't lists are law.
- Display font: Inter 900, tracking -0.04em, line-height 0.85-0.95 (never Wise Sans). Body: Inter.
- Brand green from the logo is primary. Lime (#9fe870) only as a fill or on dark green, never as text on white.
- Pills (9999px) for buttons/tags/nav. Cards 10px, large cards 28px. Flat UI: no gradients or decorative shadows on components.
- Section rhythm: white → Linen Mist → Forest Ink. Max one lime element per viewport.
- Never copy Wise branding, imagery or copy.
- UI mockups (request card, proposal cards, tags, ratings) are built in HTML/CSS, never as images.
- Illustrations live in /public/images (see GRAPHICS.md). Always use next/image, WebP, explicit width/height, meaningful alt text.
- Logo files live in /public/brand. Use only those; never redraw or recolor the logo.
- Mobile-first; most users are on phones in India.
- Never invent stats, testimonials or customer logos. Use only CONTENT.md.

## Workflow
- ONE section or task per prompt, then stop and summarize what changed.
- After changes run `npm run lint` and `npm run build` and fix errors.
- Don't edit DESIGN.md, CONTENT.md or GRAPHICS.md unless asked.

## Commands
Dev: `npm run dev` · Build: `npm run build` · Lint: `npm run lint`