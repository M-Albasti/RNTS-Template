import Foundation
import WidgetKit

@objc(PrayerWidgetModule)
class PrayerWidgetModule: NSObject {
  @objc
  func updateWidget(_ payload: NSDictionary) {
    let map: [String: Any] = [
      "locationLabel": payload["locationLabel"] as? String ?? "",
      "timezone": payload["timezone"] as? String ?? "",
      "nextPrayerKey": payload["nextPrayerKey"] as? String ?? "",
      "nextPrayerName": payload["nextPrayerName"] as? String ?? "",
      "nextPrayerTime": payload["nextPrayerTime"] as? String ?? "",
      "countdown": payload["countdown"] as? String ?? "",
      "fajr": payload["fajr"] as? String ?? "--",
      "dhuhr": payload["dhuhr"] as? String ?? "--",
      "asr": payload["asr"] as? String ?? "--",
      "maghrib": payload["maghrib"] as? String ?? "--",
      "isha": payload["isha"] as? String ?? "--",
      "reminderEnabled": payload["reminderEnabled"] as? Bool ?? false,
      "updatedAt": Date().timeIntervalSince1970,
    ]
    QuranWidgetBridge.updatePrayer(map)
    if #available(iOS 14.0, *) {
      WidgetCenter.shared.reloadTimelines(ofKind: "PrayerTimesWidget")
    }
  }
}
