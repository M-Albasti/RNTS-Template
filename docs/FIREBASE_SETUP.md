# Firebase Setup Guide (Analytics, Crashlytics, Remote Config, Cloud Messaging)

This app uses **React Native Firebase** (`@react-native-firebase/*`).

Package | Purpose
--------|--------
`@react-native-firebase/app` | Core Firebase SDK
`@react-native-firebase/auth` | Authentication (already used)
`@react-native-firebase/analytics` | Event & screen tracking
`@react-native-firebase/crashlytics` | Crash reports
`@react-native-firebase/remote-config` | Feature flags & remote values
`@react-native-firebase/messaging` | FCM push notifications
`@notifee/react-native` | Local + foreground notification display

JS entry points:

- `src/config/firebaseInit.tsx` — startup init (Crashlytics, Remote Config, Messaging)
- `index.js` — FCM background handler (`setBackgroundMessageHandler`)
- `src/components/organisms/firebase/FirebaseMessagingHost.tsx` — foreground FCM listener

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
7. **Cloud Messaging** → upload iOS APNs key → send test push with device token from app
8. **Authentication** → enable sign-in providers you use (Email, Google, Phone, etc.)
9. **Android SHA-1 / SHA-256** → Project settings → Android app → add fingerprints (required for Google Sign-In)
10. Run `cd ios && pod install` after Firebase package updates
11. Rebuild and verify with **Analytics DebugView**, a test Crashlytics crash, and an FCM test message

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

## Step 6 — Enable Cloud Messaging (FCM)

Push notifications use **Firebase Cloud Messaging** plus **Notifee** to display alerts when the app is in the foreground.

### In Firebase Console

1. Open your project → **Build** → **Cloud Messaging**
2. If prompted, enable the **Firebase Cloud Messaging API** (Google Cloud)
3. Ensure both **Android** and **iOS** apps are registered (Step 2)
4. **Upload APNs key (iOS, required for real devices):**
   - Apple Developer → **Keys** → create a key with **Apple Push Notifications service (APNs)**
   - Firebase Console → Project settings → **Cloud Messaging** → iOS app → upload the `.p8` key (Key ID + Team ID)
5. Send a **test message** from Cloud Messaging → **Send test message** using the device token shown in the app

### Google service files (you provide these)

| Platform | File | Path |
|----------|------|------|
| Android | `google-services.json` | `android/app/google-services.json` |
| iOS | `GoogleService-Info.plist` | `ios/RNTS-Template/GoogleService-Info.plist` |

Download fresh copies from Firebase Console whenever you create a new Firebase project or change the app bundle ID / package name. These files are **not committed** — add them locally after cloning.

### Native setup already in this template

| Platform | What is configured |
|----------|-------------------|
| Android | `POST_NOTIFICATIONS` permission, default FCM icon/color/channel in `AndroidManifest.xml` |
| Android | `firebase.json` → `messaging_android_notification_channel_id` = `fcm-default` |
| iOS | `aps-environment` in `RNTS-Template.entitlements` |
| iOS | `remote-notification` in `Info.plist` → `UIBackgroundModes` |
| JS | Background handler in `index.js`, foreground handler in `FirebaseMessagingHost` |

### After adding or replacing service files

```bash
npm install --legacy-peer-deps
cd ios && pod install && cd ..
npm run android   # or npm run ios
```

Rebuild native apps whenever you change Firebase packages, `firebase.json`, or service files.

### In the app

1. Open **Islamic → Reminders**
2. Turn **Enable reminders** **On** → grants notification permission and registers FCM
3. Copy the **Firebase push token** and paste it into Firebase Console test message
4. Foreground pushes are displayed via Notifee; background notification payloads are handled by the OS

Hourly **local** Islamic reminders (adhkar / ayah / hadith) still use Notifee scheduled triggers and work without FCM. FCM is for **server-sent** pushes from your Firebase project.

### iOS Xcode capabilities (verify once)

In Xcode → **RNTS-Template** target → **Signing & Capabilities**:

- **Push Notifications** (enabled)
- **Background Modes** → **Remote notifications** (enabled)

The entitlements file already includes `aps-environment`.

---

## Step 7 — Enable Google Sign-In / Auth (already in project)

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
- [ ] Cloud Messaging enabled + iOS APNs key uploaded
- [ ] FCM test message received (token from Islamic → Reminders)
- [ ] Camera permission strings in `Info.plist` (already present)
- [ ] `VisionCamera_enableCodeScanner=true` in `android/gradle.properties` (already set)

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Analytics empty | Enable DebugView; wait 24h for standard reports |
| Crashlytics empty | Use release build; reopen app after crash |
| Remote Config not updating | Publish in console; restart app; check fetch interval |
| FCM token empty | Enable reminders in app; grant notification permission; rebuild after adding service files |
| iOS push not received | Upload APNs `.p8` key in Firebase; use physical device; check Push capability in Xcode |
| Android push not received | Confirm `google-services.json`; Android 13+ notification permission granted |
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
       ├─ initFirebaseMessaging()
       └─ trackAppOpen()

index.js
  └─ messaging().setBackgroundMessageHandler()

FirebaseMessagingHost
  └─ onMessage → Notifee display (foreground FCM)

Islamic → Reminders
  └─ registerFirebasePushNotifications() + hourly Notifee schedule

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
