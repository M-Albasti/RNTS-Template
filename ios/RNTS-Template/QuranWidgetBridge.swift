import Foundation

/**
 * Writes Quran / prayer widget state into the App Group so WidgetKit
 * can render without talking to JS directly.
 */
enum QuranWidgetBridge {
  static let appGroupId = "group.com.rnts.template"
  static let quranKey = "quran_widget_state"
  static let prayerKey = "prayer_widget_state"

  static func bootstrap() {
    _ = UserDefaults(suiteName: appGroupId)
  }

  static func update(
    surahNumber: Int,
    ayahNumber: Int,
    isPlaying: Bool,
    title: String,
    isRepeat: Bool = false
  ) {
    guard let defaults = UserDefaults(suiteName: appGroupId) else {
      return
    }
    defaults.set(
      [
        "surahNumber": surahNumber,
        "ayahNumber": ayahNumber,
        "isPlaying": isPlaying,
        "isRepeat": isRepeat,
        "title": title,
        "updatedAt": Date().timeIntervalSince1970,
      ],
      forKey: quranKey
    )
    defaults.synchronize()
  }

  static func updatePrayer(_ payload: [String: Any]) {
    guard let defaults = UserDefaults(suiteName: appGroupId) else {
      return
    }
    defaults.set(payload, forKey: prayerKey)
    defaults.synchronize()
  }
}
