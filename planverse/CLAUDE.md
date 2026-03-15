# Planverse — Interior Layout Planning SaaS

## Project Overview
Planverse is a SaaS application for interior room layout planning with AI-powered design feedback. Users drag and drop furniture onto a canvas, choose interior styles, and receive Claude Vision analysis of their layout.

## Tech Stack
- **Framework**: Next.js 14 (App Router) + TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Canvas**: react-konva + konva (drag & drop furniture)
- **AI**: @anthropic-ai/sdk — Claude Opus 4.6 with Vision
- **Backend**: Supabase (auth + storage + PostgreSQL)
- **UI Components**: shadcn/ui + lucide-react

## Project Structure
```
planverse/
├── app/
│   ├── page.tsx                  ← Landing page (dark theme, hero section)
│   ├── studio/
│   │   └── page.tsx              ← Main canvas editor (SSR disabled for Konva)
│   └── api/
│       └── analyze/
│           └── route.ts          ← POST endpoint: base64 image → Claude Vision → JSON analysis
├── components/
│   ├── canvas/
│   │   ├── StudioCanvas.tsx      ← Konva Stage + Layer, grid, room boundary, drag & drop
│   │   └── FurnitureItem.tsx     ← Individual draggable Konva Group (Rect + Text emoji)
│   ├── panels/
│   │   ├── FurniturePanel.tsx    ← Sidebar with 10 furniture items to add to canvas
│   │   └── AIPanel.tsx           ← Displays Claude analysis results with score bars
│   └── StyleSelector.tsx         ← 6 interior styles: modern, scandinavian, industrial, bohemian, minimalist, japandi
├── lib/
│   ├── anthropic.ts              ← Anthropic client singleton
│   ├── supabase.ts               ← Supabase client singleton
│   └── furniture-data.ts         ← FURNITURE_CATALOG: 10 items with dimensions, colors, emojis
├── types/
│   └── index.ts                  ← FurnitureItem, FurnitureType, LayoutStyle, Project, AIAnalysis, etc.
└── .env.local.example            ← Required environment variables
```

## Key Conventions
- **Canvas**: StudioCanvas is dynamically imported (`dynamic(..., { ssr: false })`) to avoid SSR issues with Konva
- **Furniture positions**: Stored in cm (room coordinates), scaled to pixels for display using `scale = min(canvasW/roomW, canvasH/roomH)`
- **AI Analysis**: POST `/api/analyze` accepts `{ imageBase64, style, roomDimensions }`, returns `AIAnalysis` JSON
- **TypeScript**: Strict mode. Use types from `@/types` for all domain objects.
- **Imports**: Use `@/` alias for all internal imports

## Environment Variables
Copy `.env.local.example` to `.env.local` and fill in:
- `ANTHROPIC_API_KEY` — Claude Vision API key
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key

## Development
```bash
npm run dev     # Start dev server at http://localhost:3000
npm run build   # Build for production
npm run start   # Start production server
```

## Routes
- `/` — Landing page with hero, features, CTA
- `/studio` — Canvas editor with furniture panel, style selector, AI panel
- `/api/analyze` — POST endpoint for Claude Vision analysis

## Furniture Catalog (10 items)
sofa, bed, desk, dining_table, wardrobe, tv, plant, bathtub, chair, lamp

## AI Analysis Structure (AIAnalysis type)
```typescript
{
  summary: string;
  suggestions: string[];
  styleMatch: number;        // 0-100
  spaceUtilization: string;
  flowAssessment: string;
  colorPalette: string[];    // hex colors
  improvements: { priority: "high"|"medium"|"low"; description: string }[];
}
```

## TODO / Next Steps
- [ ] Supabase auth integration (email/password, OAuth)
- [ ] Save/load projects to Supabase database
- [ ] Room dimension customization UI
- [ ] Furniture rotation controls
- [ ] Undo/redo history
- [ ] Export floor plan as PDF/PNG
- [ ] Pricing/subscription with Stripe
