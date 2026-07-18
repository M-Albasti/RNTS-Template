import Foundation
import WidgetKit

@objc(QuranWidgetModule)
class QuranWidgetModule: NSObject {
  @objc
  func updateWidget(_ payload: NSDictionary) {
    let surah = (payload["surahNumber"] as? NSNumber)?.intValue ?? 1
    let ayah = (payload["ayahNumber"] as? NSNumber)?.intValue ?? 1
    let playing = payload["isPlaying"] as? Bool ?? false
    let title = payload["title"] as? String ?? "Quran"
    QuranWidgetBridge.update(
      surahNumber: surah,
      ayahNumber: ayah,
      isPlaying: playing,
      title: title
    )
    if #available(iOS 14.0, *) {
      WidgetCenter.shared.reloadTimelines(ofKind: "QuranWidget")
    }
  }
}
