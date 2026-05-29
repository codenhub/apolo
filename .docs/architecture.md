# App architecture

**Status:** DRAFT
**Last updated:** 2026-05-29

This document describes current Apolo structure. Apolo is a small music theory learning app using Vite for web and Tauri for desktop.

## Workspace

This is not a pnpm workspace. Source code lives in one app tree.

```
src/
├── core/    # App runtime modules with browser-facing infrastructure
├── public/  # Static assets served by Vite publicDir
├── shared/  # Browser-neutral helpers and types
├── ui/      # UI scripts, styles, and future components
└── index.html
plugins/
└── vite/    # Local Vite plugins
tauri/       # Tauri shell and native build config
```

Vite uses `src/` as `root` and `src/public/` as `publicDir`. Files in `src/public/` are served from `/` at runtime.

## Current App Scope

Current codebase is a shell. Planned features include note memorization, international note-name to solfege translation, metronome, tuner, and related music theory tools.

No backend/API exists today. Do not add server or workspace package boundaries until there is a concrete need.

## Frontend Entry

`src/index.html` is the only page entry. It loads:

- `src/ui/styles/index.css`
- `src/ui/scripts/index.ts`

`src/ui/scripts/index.ts` initializes cross-page UI concerns such as theme and i18n.

## Source Folders

`src/core/` contains app modules that wrap runtime infrastructure. Existing example:

- `modules/store/` - typed localStorage-backed store.

`src/shared/` contains browser-neutral helpers. Existing helpers:

- `helpers/error/` - normalized `AppError` shape and classification.
- `helpers/result/` - typed success/failure result helpers.
- `helpers/validation/` - validation/coercion helpers.

`src/ui/` contains UI runtime code:

- `scripts/feedback/` - result-to-user-feedback boundary.
- `scripts/i18n/` - locale loading and DOM translation.
- `scripts/theme/` - theme initialization.
- `scripts/toast/` - toast UI.
- `styles/` - global CSS, components, theme tokens.

`plugins/vite/` contains local build plugins. Existing plugins handle icons, deferred CSS, and i18n validation.

## Boundaries

Dependency direction:

- UI may import `core` and `shared`.
- Core may import `shared`.
- Shared must stay free of DOM, Vite, Tauri, and UI dependencies.
- Vite plugins may read app source/public files during dev/build, but runtime code must not import plugin code.
- Tauri native code stays in `tauri/`; frontend should call Tauri APIs only from explicit boundary modules when needed.

Rules:

1. Keep feature logic close to its feature until reuse is real.
2. Extract to `shared` only for browser-neutral, cross-feature helpers.
3. Extract to `core` when code wraps platform/storage/runtime infrastructure.
4. Keep UI behavior in `src/ui`; keep domain rules outside UI when they are not visual concerns.
5. Avoid new top-level packages or apps until deploy/runtime boundaries require them.
