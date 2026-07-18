import Foundation

/**
 * Writes Quran playback state into the App Group so the WidgetKit extension
 * can render play/pause controls without talking to JS directly.
 */
enum QuranWidgetBridge {
  static let appGroupId = "group.com.rnts.template"
  static let suiteKey = "quran_widget_state"

  static func bootstrap() {
    // Ensure the suite exists early; widget reads the same keys.
    _ = UserDefaults(suiteName: appGroupId)
  }

  static func update(surahNumber: Int, ayahNumber: Int, isPlaying: Bool, title: String) {
    guard let defaults = UserDefaults(suiteName: appGroupId) else {
      return
    }
    defaults.set(
      [
        "surahNumber": surahNumber,
        "ayahNumber": ayahNumber,
        "isPlaying": isPlaying,
        "title": title,
        "updatedAt": Date().timeIntervalSince1970,
      ],
      forKey: suiteKey
    )
    defaults.synchronize()
  }
}
