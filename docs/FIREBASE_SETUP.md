# Firebase Setup Guide (Analytics, Crashlytics, Remote Config)

This app uses **React Native Firebase** (`@react-native-firebase/*`).

Package | Purpose
--------|--------
`@react-native-firebase/app` | Core Firebase SDK
`@react-native-firebase/auth` | Authentication (already used)
`@react-native-firebase/analytics` | Event & screen tracking
`@react-native-firebase/crashlytics` | Crash reports
`@react-native-firebase/remote-config` | Feature flags & remote values

JS entry point: `src/config/firebaseInit.tsx` (called from `App.tsx` on startup).

---

## Step 1 — Create / open Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project** (or open your existing project)
3. Follow the wizard (Google Analytics can be enabled — recommended)

---

## Step 2 — Register your apps

You need **two** apps in the same Firebase project:

### Android

1. Firebase Console → **Project settings** (gear icon)
2. **Your apps** → **Add app** → **Android**
3. **Android package name:** `com.rnts.template` (must match `applicationId` in `android/app/build.gradle`)
4. Download **`google-services.json`**
5. Place it at:

```
android/app/google-services.json
```

6. The Gradle plugins are already configured in this template:
   - `com.google.gms.google-services`
   - `com.google.firebase.crashlytics`

### iOS

1. **Add app** → **iOS**
2. **Bundle ID:** must match Xcode (e.g. `com.rnts.template` — check `ios/RNTS-Template/Info.plist` / Xcode target)
3. Download **`GoogleService-Info.plist`**
4. Place it at:

```
ios/RNTS-Template/GoogleService-Info.plist
```

5. Open Xcode → drag the plist into the **RNTS-Template** target (if not already added)
6. `FirebaseApp.configure()` is already called in `ios/RNTS-Template/AppDelegate.swift`
7. **`GoogleService-Info.plist` is not committed to git** — you must download it from Firebase Console and add it locally
8. Root **`firebase.json`** is included — required so iOS builds do not disable Crashlytics collection

### After adding config files

```bash
cd ios && pod install && cd ..
bun run android   # or bun run ios
```

Rebuild native apps after any Firebase package or `firebase.json` change.

---

## Step 3 — Enable Analytics

Analytics is **automatically collected** once `google-services.json` / `GoogleService-Info.plist` are in place.

### In Firebase Console

1. Go to **Analytics** → **Dashboard**
2. Enable **Google Analytics** for the project if prompted
3. Link to a **Google Analytics 4** property if asked

### In this app

Events are logged from:

| Event name | When |
|------------|------|
| `app_open` | App startup after Firebase init |
| `login_success` / `login_failed` | API & Firebase auth flows |
| `register_success` / `register_failed` | Registration flows |
| `logout` | User signs out |
| `camera_snap_captured` | User takes a Snap photo |
| `camera_qr_scanned` | QR code detected |
| `camera_barcode_scanned` | Barcode detected |
| `camera_filter_changed` | User picks a face filter |
| Screen views | All navigated screens (automatic via `NavigationContainer`) |

User ID is synced to Analytics + Crashlytics on login, logout, and Redux rehydrate.

View them under **Analytics** → **Events** (may take up to 24h for first data; use **DebugView** for instant testing).

### DebugView (recommended while developing)

**Android:**

```bash
adb shell setprop debug.firebase.analytics.app com.rnts.template
```

**iOS:** In Xcode → Edit Scheme → Run → Arguments → add:

```
-FIRAnalyticsDebugEnabled
```

Then open Firebase Console → **Analytics** → **DebugView**.

---

## Step 4 — Enable Crashlytics

### In Firebase Console

1. Open **Crashlytics** in the left menu
2. Click **Enable Crashlytics** if you see the setup card
3. Select your Android and iOS apps
4. Complete the wizard (native SDK is already integrated in this template)

### Verify it works

1. Run a **release** build (Crashlytics often skips debug crashes on Android)
2. Optional: call `triggerTestCrash()` from `@config/firebaseInit` in dev only
3. Force a test crash, reopen the app (Crashlytics sends reports on next launch)
4. Check **Crashlytics** → **Issues** (can take 5–15 minutes)

Non-fatal errors are recorded via `recordCrashError()` (ErrorBoundary, unknown Firebase auth errors, server API 5xx, camera capture failures).

---

## Firebase Console checklist

Do these once per project:

1. **Create project** (enable Google Analytics when prompted)
2. **Register Android app** → download `google-services.json` → `android/app/`
3. **Register iOS app** → download `GoogleService-Info.plist` → `ios/RNTS-Template/` + Xcode target
4. **Analytics** → confirm GA4 property is linked (usually automatic)
5. **Crashlytics** → click **Enable Crashlytics** for both apps
6. **Remote Config** → add parameters from Step 5 below → **Publish changes**
7. **Authentication** → enable sign-in providers you use (Email, Google, Phone, etc.)
8. **Android SHA-1 / SHA-256** → Project settings → Android app → add fingerprints (required for Google Sign-In)
9. Run `cd ios && pod install` after Firebase package updates
10. Rebuild and verify with **Analytics DebugView** and a test Crashlytics crash (release build recommended)

---

## Step 5 — Enable Remote Config

### In Firebase Console

1. Open **Remote Config** in the left menu
2. Click **Create configuration** / **Add parameter**

Add these parameters (match defaults in `src/config/firebaseRemoteConfigDefaults.ts`):

| Parameter key | Type | Example value | Purpose |
|---------------|------|---------------|---------|
| `camera_snap_enabled` | Boolean | `true` | Show/hide Snap camera card |
| `camera_qr_enabled` | Boolean | `true` | Show/hide QR scanner |
| `camera_barcode_enabled` | Boolean | `true` | Show/hide barcode scanner |
| `maintenance_mode` | Boolean | `false` | Block app usage — shows maintenance screen |
| `maintenance_message` | String | *(empty)* | Optional extra message on maintenance screen |
| `welcome_message` | String | `Welcome to RNTS Template` | Future: dynamic copy |
| `min_app_version` | String | `1.0.0` | Future: force-update checks |

3. Click **Publish changes**

### How the app uses it

- `initRemoteConfig()` runs on startup (`App.tsx`)
- `fetchAndActivate()` downloads published values
- Camera hub reads flags via `getRemoteConfigBoolean()`
- Dev builds fetch immediately (`minimumFetchIntervalMillis: 0`)
- Production caches for 1 hour

To test a change: publish in console → restart app (or call `refreshRemoteConfig()`).

---

## Step 6 — Enable Google Sign-In / Auth (already in project)

If not done yet:

1. **Authentication** → **Sign-in method** → enable Email, Google, Phone, etc.
2. Add SHA-1 / SHA-256 for Android (Project settings → Your apps → Android → Add fingerprint)
3. Add iOS URL schemes for Google/Facebook as documented in your auth setup

---

## Checklist before release

- [ ] `google-services.json` in `android/app/`
- [ ] `GoogleService-Info.plist` in iOS target (download locally — not in repo)
- [ ] `firebase.json` at project root (already in repo)
- [ ] `pod install` after Firebase package updates
- [ ] Analytics DebugView shows events
- [ ] Crashlytics enabled in console + test crash received
- [ ] Remote Config parameters published
- [ ] Camera permission strings in `Info.plist` (already present)
- [ ] `VisionCamera_enableCodeScanner=true` in `android/gradle.properties` (already set)

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Analytics empty | Enable DebugView; wait 24h for standard reports |
| Crashlytics empty | Use release build; reopen app after crash |
| Remote Config not updating | Publish in console; restart app; check fetch interval |
| QR scan not working on Android | Rebuild after `VisionCamera_enableCodeScanner=true` |
| `google-services.json` missing | Download from Firebase Console → Project settings |
| Gradle Crashlytics error | Ensure Crashlytics classpath + plugin in `android/build.gradle` and `android/app/build.gradle` |

---

## Related code paths

```
App.tsx
  └─ initFirebaseServices()
       ├─ initCrashlytics()
       ├─ initRemoteConfig()
       └─ trackAppOpen()

NavigationContainer
  └─ onStateChange → logScreenView (all screens)

Redux firebaseAuthMiddleware
  └─ sync Analytics/Crashlytics user on login, logout, rehydrate

Auth services
  └─ login_success / login_failed / register_* / logout events

Drawer → Camera
  └─ CameraHub (Remote Config toggles)
       ├─ SnapCamera (filters + Analytics)
       ├─ QrScanner (useCodeScanner)
       └─ BarcodeScanner (useCodeScanner)
```

For SQLite / Redux docs see `src/redux/storage/sqlite/README.md`.
