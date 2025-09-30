# HealthMateAI App Guide

This document summarizes the current architecture of the app after integrating Firebase Authentication, RevenueCat subscriptions, and the Relax audio experience. Use it as the primary reference for environment setup, feature behavior, and day-to-day development tasks.

## Contents
- [Environment](#environment)
- [Firebase Authentication](#firebase-authentication)
- [RevenueCat Subscriptions](#revenuecat-subscriptions)
- [Relax Audio Experience](#relax-audio-experience)
- [Running & Testing](#running--testing)
- [EAS Build (Android)](#eas-build-android)
- [Key Files](#key-files)

## Environment

Install dependencies with `npm install` (Expo SDK 54). The project depends on the following native packages:

- `react-native-purchases` – handled manually in code (no extra config needed).
- `expo-secure-store` – already configured via Expo plugins.
- `expo-av` – required for the Relax audio player. If you set up the project from scratch, (re-)run `npx expo install expo-av` to ensure the native module is linked.

### Required environment variables

Set these in `.env` or via `app.json > extra` (public keys only):

| Variable | Purpose |
| --- | --- |
| `EXPO_PUBLIC_REVENUECAT_API_KEY` | RevenueCat public SDK key for configuring Purchases. |
| `EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID` (optional) | Entitlement ID that marks premium access. If omitted, the app treats any active entitlement as premium. |

Firebase credentials are defined in `firebaseConfig.js`. Update this file with your project’s keys as needed.

## Firebase Authentication

- **Provider**: `contexts/AuthContext.tsx` wraps the entire app and exposes `signIn`, `signUp`, `signOut`, authentication state, and a loading flag.
- **Screens**: `app/(auth)/login.tsx` and `app/(auth)/signup.tsx` implement email/password flows using Firebase Auth (`createUserWithEmailAndPassword`, `signInWithEmailAndPassword`).
- **Routing Logic**: `app/index.tsx` redirects users to the auth stack when logged out or to the tab stack when logged in.
- **Profile Tab**: `app/(tabs)/(profile)/index.tsx` displays the signed-in user’s email, allows sign-out, kicks off RevenueCat restore, and links to the paywall to manage upgrades.

All authentication requests respect Firebase session persistence with Expo Secure Store.

## RevenueCat Subscriptions

- **Configuration**: `constants/revenueCat.ts` centralizes key loading from environment variables or `app.json` extras.
- **Provider**: `contexts/PurchasesContext.tsx` wires RevenueCat into the auth flow. It logs users in/out of RevenueCat when Firebase auth changes, fetches offerings, tracks purchases, exposes premium status, and listens for customer info updates.
- **Hook**: `hooks/usePurchases.ts` provides a convenience wrapper for consuming purchase state in components.
- **Paywall**: `app/purchase.tsx` renders the current offering dynamically using `components/purchases/PackageCard.tsx`. It supports purchase, restore, pull-to-refresh, and shows premium status messaging.
- **Profile Integration**: Upgrading/restoring is reachable from the Profile tab via the `usePurchases` hook; entitlement IDs are displayed for debugging.

Make sure you set the RevenueCat API key before testing purchases. Without it, the provider logs a warning and surfaces messaging in the paywall UI.

## Relax Audio Experience

- **Data Source**: `constants/relaxSounds.ts` defines category metadata and sample long-form audio URLs (free, royalty-free tracks for demo purposes).
- **Player Provider**: `contexts/AudioPlayerContext.tsx` controls audio lifecycle using `expo-av`, supports background playback, looping, pause/resume/stop, and manages the mini player state.
- **Hook**: `hooks/useAudioPlayer.ts` exposes the provider context to components.
- **Mini Player**: `components/audio/MiniPlayer.tsx` renders a persistent overlay with play/pause, stop, and dismiss actions. It is included globally in `app/_layout.tsx` so playback controls are always available.
- **Relax Tab**: `app/(tabs)/(relax)/index.tsx` is a sectioned list of categories with per-track controls. Tapping a card starts playback (or toggles pause/resume if already selected) and updates the mini player.

The provider configures the audio mode for background playback and keeps the current track playing when navigating away.

## Running & Testing

```bash
npm install          # ensure dependencies (expo-av, react-native-purchases, etc.)
npx tsc --noEmit     # type-check the project
npm run start        # start the Expo dev server
```

Because the CLI cannot access the network in some environments, you may need to run `npx expo install expo-av` manually once outside of the restricted environment to obtain the native module.

## EAS Build (Android)

Profiles are defined in `eas.json` (`development`, `preview`, `production`). To prepare for `eas build --platform android --profile development`:

1. Install dependencies: `npm install`.
2. Ensure `expo-av` is installed natively (see above).
3. Log in with the Expo CLI if you are not already: `npx expo login`.
4. Verify project config parses correctly (already validated via `npx expo config --json`).

Once those steps pass, run the build when online:

```bash
eas build --platform android --profile development
```

*(The command was **not** executed in this environment, but supporting checks like `npx expo config --json` and `npx tsc --noEmit` have succeeded, indicating the project is ready for an EAS development build.)*

## Key Files

- `firebaseConfig.js` – Firebase initialization with Secure Store persistence.
- `contexts/AuthContext.tsx`, `hooks/useAuth.ts` – Authentication provider and hook.
- `contexts/PurchasesContext.tsx`, `hooks/usePurchases.ts` – RevenueCat integration.
- `app/purchase.tsx`, `components/purchases/PackageCard.tsx` – Paywall UI.
- `constants/relaxSounds.ts`, `contexts/AudioPlayerContext.tsx`, `hooks/useAudioPlayer.ts` – Relax audio data + playback service.
- `components/audio/MiniPlayer.tsx`, `app/(tabs)/(relax)/index.tsx` – UI for background audio playback.
- `app/_layout.tsx` – Wraps routing with Auth, Purchases, and Audio providers and mounts the mini player.

Refer back here whenever you need to troubleshoot authentication flows, subscription handling, or the Relax audio feature.
