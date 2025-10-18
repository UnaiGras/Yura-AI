# Repository Guidelines

## Project Structure & Module Organization
- `app/` contains Expo Router segments like `(auth)`, `(tabs)`, and `purchase`; extend routing there and register providers through `app/_layout.tsx`.
- Shared UI and config live in `components/`, `constants/`, `lib/`, and `types/`; keep route files lean by placing helpers here.
- Global state is managed in `contexts/` plus companion hooks, while fonts and imagery sit in `assets/`; update those in tandem with `app.json`.

## Build, Test, and Development Commands
- `npm install` synchronizes Expo SDK 54 dependencies after cloning or editing `package.json`.
- `npm run start` launches Metro; add `--clear` if assets stick, or use `npm run android|ios|web` for a specific target.
- `npx tsc --noEmit` is the required pre-commit type check.
- Ship-ready builds use `eas build --platform android --profile development` once native modules (`npx expo install expo-av`) and Expo CLI auth are in place.

## Coding Style & Naming Conventions
- Write TypeScript functional components, matching the existing 2-space Prettier formatting (`app/_layout.tsx` is the reference).
- Prefer the `@/` alias for internal imports and keep module boundaries focused (providers in `contexts/`, UI in `components/`).
- Components/screens use PascalCase, hooks camelCase with `use`, and config constants camelCase unless framework demands uppercase.

## Testing Guidelines
- Run `npx tsc --noEmit` plus a manual pass of the impacted flow in Expo Go (login, purchases, or Relax audio as appropriate).
- Add targeted `react-test-renderer` specs under `components/__tests__/` when fixing regressions; mock contexts via existing provider APIs.
- Validate audio updates by exercising the Relax tab and `MiniPlayer` to confirm background playback survives.

## Commit & Pull Request Guidelines
- Keep commit subjects action-oriented and concise (e.g., `Implement auth persistence, subscriptions, and relax audio`); expand detail in bodies if needed.
- PRs should summarize the change, list manual test steps (`npm run start` platform), and attach UI captures for visual tweaks.
- Call out new environment keys, EAS profile adjustments, or migration steps before requesting review.

## Environment & Configuration
- Configure `EXPO_PUBLIC_REVENUECAT_API_KEY` (and optional entitlement id) via `.env` or `app.json > extra`; keep sensitive Firebase secrets outside the repo and load them into `firebaseConfig.js` locally.
- After adding native modules, rerun `npx expo install <package>` so Metro and EAS stay aligned.
