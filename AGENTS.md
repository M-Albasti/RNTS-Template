# AGENTS.md

## Cursor Cloud specific instructions

This is a **React Native 0.85** app (`RNTS-Template`). The cloud VM is headless Linux, so the
**Android app and iOS app cannot be launched** here (no emulator/simulator; iOS additionally needs
macOS + Xcode). The runnable development surface in this environment is the **Metro bundler**.

### Install
- Use `npm install --legacy-peer-deps`. The flag is required: `react-native-reanimated` declares a
  peer on `react-native-worklets@0.10.x` while older pins may fail; use `^0.10.1`.
- `package.json` scripts reference `bun`/`bunx` (e.g. `start:development`), but `bun` is not required
  for the dev loop — `npm`/`npx` work fine.
- Copy env before first run: `cp .env.example .env` (required — `src/config/apiConfig.tsx` imports `@env`; babel rejects missing vars).

### CI/CD
- Local full pipeline: `npm run ci` (validate i18n → typecheck → lint → test → Android + iOS Metro bundles).
- GitHub Actions: `.github/workflows/ci.yml` on push/PR to `develop` and `master`.
- Jobs: quality gates (ubuntu) → Metro Android/iOS bundles (ubuntu) → `assembleDebug` (ubuntu) → iOS Simulator `xcodebuild` (`macos-15`).
- **Why iOS needs macOS:** native iOS compile requires Xcode; Linux runners cannot build iOS. Metro iOS JS bundling still runs on ubuntu.
- **New Architecture must always stay enabled** — Android: `newArchEnabled=true` in `android/gradle.properties`; iOS: `RCTNewArchEnabled` in `Info.plist`. Never disable for CI or local builds.
- Android CI builds **arm64-v8a only** with ABI splits disabled (`-PenableAbiSplits=false`) for runner time; this does not affect New Architecture.
- iOS CI builds Debug for the Simulator (arm64) with code signing disabled; uses a placeholder `GoogleService-Info.plist` (same pattern as Android `google-services.json`).
- iOS Podfile forces `RNFB*` pods to **static libraries** (not static frameworks) so Clang modules do not absorb React headers under `use_frameworks!` + prebuilt RNCore (fixes `RCTPromiseRejectBlock` / `RCT_EXPORT_*` failures in RNFBMessaging).
- `stream-chat-react-native` is excluded from native autolinking (`react-native.config.js`) — unused in `src/` (Jest mock only).
- Commit `package-lock.json` whenever `package.json` deps change — CI uses `npm install --legacy-peer-deps`.
- ESLint uses `eslint.config.js` (ESLint 9 flat config, ft-flow plugin removed).
- Jest smoke tests in `__tests__/smoke.test.ts` (not full App render).

### Run (dev server)
- `npm start` launches Metro on `http://localhost:8081`.
- Verify it is live: `curl http://localhost:8081/status` → `packager-status:running`.
- Force a full app compile / fetch the JS bundle:
  `curl "http://localhost:8081/index.bundle?platform=android&dev=true"` (returns ~17 MB).
- To produce a standalone bundle without the server:
  `npx react-native bundle --platform android --dev true --entry-file index.js --bundle-output /tmp/index.android.bundle --assets-dest /tmp/rnbundle-assets`

### Known broken checks (upstream/repo issues, not environment problems)
- `npm run lint` reports ~116 unused-var **warnings** (errors fixed). Unused imports accumulated across template modules.
- There is a `typecheck` script (`npm run typecheck`). It passes on `develop`.
