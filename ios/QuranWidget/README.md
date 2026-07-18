# Quran Audio Widget (iOS + Android)

## iOS WidgetKit setup

1. Open `ios/RNTS-Template.xcworkspace`.
2. **File → New → Target → Widget Extension**.
3. Product Name: `QuranWidget` (bundle id `com.rnts.template.QuranWidget`).
4. Replace the generated Swift files with the ones in this folder (`QuranWidget.swift`, `Info.plist`, entitlements).
5. Enable App Group `group.com.rnts.template` on **both** the app target and the widget target (Signing & Capabilities).
6. Embed the widget extension in the `RNTS-Template` app target.

## Android

The App Widget is registered in `AndroidManifest.xml`. After installing a build, long-press the home screen → Widgets → **Quran Audio**.

## Wire playback after merge

Controls open `projectdeeplink://quran/{play|pause|next|prev}`.

After the Quran audio controller is on `develop`, bind it once (e.g. in `QuranAudioHost`):

```ts
import {
  bindQuranWidgetPlayback,
  syncQuranHomeWidget,
} from '@services/quranAudioService/quranWidgetBridge';
import {quranAudioController} from '@services/quranAudioService/quranAudioController';

bindQuranWidgetPlayback({
  resume: quranAudioController.resume,
  pause: quranAudioController.pause,
  togglePlay: () => quranAudioController.togglePlay(),
  playNext: quranAudioController.playNext,
  playPrevious: quranAudioController.playPrevious,
  getSnapshot: () => {
    const snap = quranAudioController.getSnapshot();
    return {
      surahNumber: snap.surahNumber,
      ayahNumber: snap.activeAyahNumber,
      isPlaying: snap.isPlaying,
    };
  },
});

quranAudioController.subscribe(snapshot => {
  syncQuranHomeWidget({
    surahNumber: snapshot.surahNumber,
    ayahNumber: snapshot.activeAyahNumber,
    isPlaying: snapshot.isPlaying,
    title: `Surah ${snapshot.surahNumber}`,
  });
});
```
