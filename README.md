# Apolo

A simple app for people who wanna practice or learn music theory.

## Structure

- `src/`: Vite web app source.
- `src/public/`: static files served from `/`, including locale JSON and future locale icons.
- `plugins/vite/`: local Vite plugins.
- `tauri/`: Tauri shell for desktop builds.

## Commands

- `pnpm dev:web`: run browser dev app.
- `pnpm dev:app`: run Tauri dev app.
- `pnpm build:web`: build browser app.
- `pnpm build:app`: build Tauri desktop app and Windows installer.
- `pnpm build`: alias for `pnpm build:web`.
