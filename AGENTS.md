# AGENTS.md

## Cursor Cloud specific instructions

This is a **React Native 0.85** app (`RNTS-Template`). The cloud VM is headless Linux, so the
**Android app and iOS app cannot be launched** here (no emulator/simulator; iOS additionally needs
macOS + Xcode). The runnable development surface in this environment is the **Metro bundler**.

### Install
- Use `npm install --legacy-peer-deps`. The flag is required: `react-native-reanimated` declares a
  peer on `react-native-worklets@0.9.x` while the repo pins `^0.9.2`, so a plain `npm install` fails
  with `ERESOLVE`. There is no committed lockfile.
- `package.json` scripts reference `bun`/`bunx` (e.g. `start:development`), but `bun` is not required
  for the dev loop — `npm`/`npx` work fine.
- Copy env before first run: `cp .env.example .env` (required — `src/config/apiConfig.tsx` imports `@env`; babel rejects missing vars).

### CI/CD
- Local full pipeline: `npm run ci` (validate i18n → typecheck → lint → test → Android bundle).
- GitHub Actions: `.github/workflows/ci.yml` on push/PR to `develop` and `master`.
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
