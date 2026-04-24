# FaceCheck Web — Claude / agent orientation

Read [`SIBLING_IOS.md`](./SIBLING_IOS.md) first. This repo has an iOS SwiftUI sibling and shared source-of-truth contracts (mock rules, design tokens, data schema).

## Stack

- Next.js 16 (App Router, RSC), React 19, TypeScript strict, Tailwind CSS 4
- Zustand (+ persist middleware) for `SessionStore`
- lucide-react for icons, framer-motion for animations
- No backend in Phase 1; `APIService` wiring is planned

## Source of truth lives on iOS side

Don't invent tokens, types, or mock rules — mirror from `/Users/maxlin/max_projects/FaceCheck/` counterparts:

- `src/lib/types.ts` ← `FaceCheck/Models/*.swift`
- `src/lib/design.ts` ← `FaceCheck/Components/FCDesign.swift`
- `src/lib/mock.ts` ← `FaceCheck/Mock/MockRules.swift` + `MockAssessmentGenerator.swift`

## Development

```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # production build
```

## Deployment

Connected to https://github.com/MaxLinked/facecheck-app → Vercel auto-deploys on push to `main`.

## Structure

```
src/
├── app/               App Router pages
│   ├── layout.tsx     RootLayout with PhoneFrame + TabBar
│   ├── page.tsx       Home
│   ├── capture/       photo picker
│   ├── analyzing/     fake progress screen
│   ├── report/[id]/   Patient/Clinical toggle
│   ├── avatar/[id]/   rotatable 3D-ish face
│   ├── history/       trend + stats + distribution + sessions list
│   └── settings/      demo case picker + clear history + about
├── components/        PhoneFrame, TabBar, atoms (Card, GradeChip, ...)
└── lib/               design, types, mock, store, utils
```

## House rules

- All pages are Client Components (use `"use client"`)
- Tier C UI (grade/sunnybrook/synkinesis/regions/metrics) must wrap in `<PreviewBadge>`
- When tweaking layouts, also update the iOS counterpart if visual parity matters
- New screens: add matching SwiftUI screen on iOS side, or document as web-only in `SIBLING_IOS.md`

## Current status

Phase 1: mock-driven UI demo. No API integration yet. See `SIBLING_IOS.md` for what's parallel and what's not.
