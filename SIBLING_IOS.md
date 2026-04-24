# iOS Sibling — FaceCheck (SwiftUI)

This Next.js web app is the browser-facing sibling of a SwiftUI iOS app. They share design language, mock-data rules, and data contract.

## Locations

| Side | Purpose | Path / URL |
|---|---|---|
| **Web (Next.js)** (this repo) | Mobile-first web prototype for team review + iteration | `/Users/maxlin/max_projects/facecheck-web/` |
| **iOS SwiftUI** | Native iPhone app (ARKit + TrueDepth target for later phase) | `/Users/maxlin/max_projects/FaceCheck/` |
| GitHub (web) | This repo | https://github.com/MaxLinked/facecheck-app |

## Source of truth (lives on iOS side)

When these change on iOS, mirror to web:

| iOS file | Web mirror |
|---|---|
| `api-contract/sample-assessment.json` | `public/sample-assessment.json` *(copy on update)* |
| `api-contract/README.md` | — (referenced in docs) |
| `FaceCheck/Mock/MockRules.swift` | `src/lib/mock.ts` |
| `FaceCheck/Components/FCDesign.swift` | `src/lib/design.ts` + `src/app/globals.css` @theme |
| `docs/research/prototype-spec.md` | (read-only reference when building new screens) |

## Diagram of what's parallel

```
iOS                                    Web (this)
───                                    ───
FaceCheckApp.swift            ←→       src/app/layout.tsx
RootView.swift                ←→       src/app/layout.tsx + PhoneFrame + TabBar
Screens/HomeScreen.swift      ←→       src/app/page.tsx
Screens/CaptureScreen.swift   ←→       src/app/capture/page.tsx
Screens/AnalyzingScreen.swift ←→       src/app/analyzing/page.tsx
Screens/ResultScreen.swift    ←→       src/app/report/[id]/page.tsx
Screens/AvatarScreen.swift    ←→       src/app/avatar/[id]/page.tsx
Screens/HistoryScreen.swift   ←→       src/app/history/page.tsx
Models/*.swift                ←→       src/lib/types.ts
Mock/MockAssessmentGenerator  ←→       src/lib/mock.ts
Components/FCDesign.swift     ←→       src/lib/design.ts
RootView SessionStore         ←→       src/lib/store.ts (Zustand + localStorage)
```

## What's intentionally different

- Camera: iOS uses native PhotosPicker + UIImagePickerController; web uses `<input type="file" accept="image/*" capture>`
- Persistence: UserDefaults (iOS) vs. localStorage via Zustand persist (web)
- Framer Motion animates the web Avatar rotate-drag; iOS uses native SwiftUI `.rotation3DEffect`

## When contracts drift

If iOS changes `AssessmentReport` shape:

1. Bump both `iOS:FaceCheck/Models/AssessmentReport.swift` and `web:src/lib/types.ts`
2. Refresh `api-contract/sample-assessment.json` and copy to both repos (or keep iOS as source and re-import)
3. Run `npm run build` on web to catch type mismatches
4. Run `xcodebuild build` on iOS to catch Swift mismatches

## AI collaboration between sessions

Both repos' `CLAUDE.md` points at this file (or its iOS counterpart) so a fresh Claude session in either repo immediately knows about the sibling and shared contracts. Don't duplicate business logic — if it belongs in both, canonicalize one side and port.

## Quick commands

Run web locally:
```bash
npm run dev           # http://localhost:3000
```

See iOS repo git log:
```bash
git -C /Users/maxlin/max_projects/FaceCheck log --oneline | head
```
