# Home-screen widgets (iOS + Android)

Two widgets ship with this feature:

1. **Quran Audio** — play / pause / prev / next / repeat / stop, plus tap the surah title to open the current mushaf ayah.
2. **Prayer Times** — location + timezone, next-prayer countdown, Adhan reminder toggle, open Prayer Times in-app.

## iOS WidgetKit setup

1. Open `ios/RNTS-Template.xcworkspace`.
2. **File → New → Target → Widget Extension** (if not already added).
3. Product Name: `QuranWidget` (bundle id `com.rnts.template.QuranWidget`).
4. Replace generated Swift with `ios/QuranWidget/QuranWidget.swift` (contains a `WidgetBundle` with both widgets).
5. Enable App Group `group.com.rnts.template` on **both** the app target and the widget target.
6. Embed the widget extension in the `RNTS-Template` app target.
7. Ensure `PrayerWidgetModule.swift` / `.m` are in the app target (same as QuranWidgetModule).

## Android

Widgets are registered in `AndroidManifest.xml`:

- **Quran Audio** → `QuranAudioWidgetProvider`
- **Prayer Times** → `PrayerTimesWidgetProvider`

After installing a build: long-press home → Widgets → add either widget.

## Deep links

| URL | Action |
|---|---|
| `projectdeeplink://quran/play` | Resume |
| `projectdeeplink://quran/pause` | Pause |
| `projectdeeplink://quran/next` | Next surah |
| `projectdeeplink://quran/prev` | Previous surah |
| `projectdeeplink://quran/stop` | Stop |
| `projectdeeplink://quran/repeat` | Toggle surah repeat |
| `projectdeeplink://quran/open?surah=2&ayah=255` | Open mushaf at ayah |
| `projectdeeplink://prayer/open` | Open Prayer Times screen |
| `projectdeeplink://prayer/remind` | Toggle reminder for upcoming prayer |

JS hosts (`QuranWidgetHost`, `PrayerWidgetHost`) are mounted from `App.tsx` and bind live Redux / audio controller state.
