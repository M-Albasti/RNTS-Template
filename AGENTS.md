# AGENTS.md

## Cursor Cloud specific instructions

This is a **React Native 0.85** app (`RNTS-Template`). The cloud VM is headless Linux, so the
**Android app and iOS app cannot be launched** here (no emulator/simulator; iOS additionally needs
macOS + Xcode). The runnable development surface in this environment is the **Metro bundler**.

### Install
- Use `npm install --legacy-peer-deps`. The flag is required: `react-native-reanimated` declares a
  peer on `react-native-worklets@0.9.x` while the repo pins `^0.8.1`, so a plain `npm install` fails
  with `ERESOLVE`. There is no committed lockfile.
- `package.json` scripts reference `bun`/`bunx` (e.g. `start:development`), but `bun` is not required
  for the dev loop — `npm`/`npx` work fine.
- No `.env` file is needed: the `@env` alias (react-native-dotenv) is only referenced in
  `babel.config.js` and is not imported anywhere under `src/`.

### Run (dev server)
- `npm start` launches Metro on `http://localhost:8081`.
- Verify it is live: `curl http://localhost:8081/status` → `packager-status:running`.
- Force a full app compile / fetch the JS bundle:
  `curl "http://localhost:8081/index.bundle?platform=android&dev=true"` (returns ~17 MB).
- To produce a standalone bundle without the server:
  `npx react-native bundle --platform android --dev true --entry-file index.js --bundle-output /tmp/index.android.bundle --assets-dest /tmp/rnbundle-assets`

### Known broken checks (upstream/repo issues, not environment problems)
- `npm run lint` fails: `@react-native/eslint-config@0.85` pulls `eslint-plugin-ft-flow@2.x`, which
  only supports ESLint 8 (`context.getAllComments is not a function`), but the repo pins ESLint 9.
  This breaks both legacy and flat config modes. Don't try to "fix the environment" for this.
- `npm test` (Jest) fails on the single committed `__tests__/App.test.tsx`: it renders the full
  `<App />`, and the `@react-native/jest-preset` `transformIgnorePatterns` does not transform the
  ESM-only deps it pulls in (`@sentry/react-native`, `react-redux`, etc.). This is a repo config gap.
- There is no `typecheck` script. `npx tsc --noEmit` runs but reports pre-existing source-level type
  errors in `src/`.
