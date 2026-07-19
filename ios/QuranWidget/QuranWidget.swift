import WidgetKit
import SwiftUI

// MARK: - Quran Audio Widget

struct QuranWidgetEntry: TimelineEntry {
  let date: Date
  let title: String
  let subtitle: String
  let surahNumber: Int
  let ayahNumber: Int
  let isPlaying: Bool
  let isRepeatEnabled: Bool
}

struct QuranWidgetProvider: TimelineProvider {
  func placeholder(in context: Context) -> QuranWidgetEntry {
    QuranWidgetEntry(
      date: Date(),
      title: "Surah 1",
      subtitle: "Ayah 1",
      surahNumber: 1,
      ayahNumber: 1,
      isPlaying: false,
      isRepeatEnabled: false
    )
  }

  func getSnapshot(in context: Context, completion: @escaping (QuranWidgetEntry) -> Void) {
    completion(loadEntry())
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<QuranWidgetEntry>) -> Void) {
    let entry = loadEntry()
    completion(Timeline(entries: [entry], policy: .after(Date().addingTimeInterval(30))))
  }

  private func loadEntry() -> QuranWidgetEntry {
    let defaults = UserDefaults(suiteName: "group.com.rnts.template")
    let state = defaults?.dictionary(forKey: "quran_widget_state")
    let surah = state?["surahNumber"] as? Int ?? 1
    let ayah = state?["ayahNumber"] as? Int ?? 1
    let playing = state?["isPlaying"] as? Bool ?? false
    let repeatOn = state?["isRepeat"] as? Bool ?? false
    let title = state?["title"] as? String ?? "Surah \(surah)"
    return QuranWidgetEntry(
      date: Date(),
      title: title,
      subtitle: "Ayah \(ayah)",
      surahNumber: surah,
      ayahNumber: ayah,
      isPlaying: playing,
      isRepeatEnabled: repeatOn
    )
  }
}

struct QuranWidgetView: View {
  var entry: QuranWidgetEntry

  var body: some View {
    VStack(alignment: .leading, spacing: 10) {
      Link(destination: URL(string: "projectdeeplink://quran/open?surah=\(entry.surahNumber)&ayah=\(entry.ayahNumber)")!) {
        VStack(alignment: .leading, spacing: 2) {
          Text(entry.title)
            .font(.headline.weight(.bold))
            .foregroundStyle(.white)
          Text(entry.subtitle)
            .font(.subheadline)
            .foregroundStyle(.white.opacity(0.9))
        }
      }

      HStack(spacing: 8) {
        controlLink("projectdeeplink://quran/prev", systemName: "backward.fill")
        controlLink(
          entry.isPlaying ? "projectdeeplink://quran/pause" : "projectdeeplink://quran/play",
          systemName: entry.isPlaying ? "pause.fill" : "play.fill",
          prominent: true
        )
        controlLink("projectdeeplink://quran/next", systemName: "forward.fill")
        controlLink(
          "projectdeeplink://quran/repeat",
          systemName: "repeat",
          highlighted: entry.isRepeatEnabled
        )
        controlLink("projectdeeplink://quran/stop", systemName: "stop.fill")
      }
    }
    .padding()
    .containerBackground(for: .widget) {
      Color(red: 0.0, green: 0.41, blue: 0.36)
    }
  }

  @ViewBuilder
  private func controlLink(
    _ url: String,
    systemName: String,
    prominent: Bool = false,
    highlighted: Bool = false
  ) -> some View {
    Link(destination: URL(string: url)!) {
      Image(systemName: systemName)
        .font(prominent ? .title3.weight(.bold) : .body.weight(.semibold))
        .foregroundStyle(
          highlighted
            ? Color(red: 0.83, green: 0.69, blue: 0.22)
            : Color(red: 0.0, green: 0.3, blue: 0.25)
        )
        .frame(maxWidth: .infinity)
        .frame(height: prominent ? 40 : 34)
        .background(
          prominent
            ? Color(red: 0.95, green: 0.97, blue: 0.96)
            : Color(red: 0.88, green: 0.95, blue: 0.94)
        )
        .clipShape(RoundedRectangle(cornerRadius: prominent ? 20 : 10))
    }
  }
}

struct QuranAudioWidget: Widget {
  let kind = "QuranWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: QuranWidgetProvider()) { entry in
      QuranWidgetView(entry: entry)
    }
    .configurationDisplayName("Quran Audio")
    .description("Play, pause, skip, repeat, and open the current mushaf ayah.")
    .supportedFamilies([.systemMedium, .systemLarge])
  }
}

// MARK: - Prayer Times Widget

struct PrayerWidgetEntry: TimelineEntry {
  let date: Date
  let locationLabel: String
  let timezone: String
  let nextPrayerName: String
  let nextPrayerTime: String
  let countdown: String
  let fajr: String
  let dhuhr: String
  let asr: String
  let maghrib: String
  let isha: String
  let reminderEnabled: Bool
}

struct PrayerWidgetProvider: TimelineProvider {
  func placeholder(in context: Context) -> PrayerWidgetEntry {
    PrayerWidgetEntry(
      date: Date(),
      locationLabel: "City, Country",
      timezone: "Timezone",
      nextPrayerName: "Dhuhr",
      nextPrayerTime: "12:30",
      countdown: "01:20:00",
      fajr: "04:50",
      dhuhr: "12:30",
      asr: "15:45",
      maghrib: "18:10",
      isha: "19:40",
      reminderEnabled: false
    )
  }

  func getSnapshot(in context: Context, completion: @escaping (PrayerWidgetEntry) -> Void) {
    completion(loadEntry())
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<PrayerWidgetEntry>) -> Void) {
    let entry = loadEntry()
    completion(Timeline(entries: [entry], policy: .after(Date().addingTimeInterval(30))))
  }

  private func loadEntry() -> PrayerWidgetEntry {
    let defaults = UserDefaults(suiteName: "group.com.rnts.template")
    let state = defaults?.dictionary(forKey: "prayer_widget_state")
    return PrayerWidgetEntry(
      date: Date(),
      locationLabel: state?["locationLabel"] as? String ?? "Set your location",
      timezone: state?["timezone"] as? String ?? "",
      nextPrayerName: state?["nextPrayerName"] as? String ?? "Next prayer",
      nextPrayerTime: state?["nextPrayerTime"] as? String ?? "--:--",
      countdown: state?["countdown"] as? String ?? "--:--:--",
      fajr: state?["fajr"] as? String ?? "--",
      dhuhr: state?["dhuhr"] as? String ?? "--",
      asr: state?["asr"] as? String ?? "--",
      maghrib: state?["maghrib"] as? String ?? "--",
      isha: state?["isha"] as? String ?? "--",
      reminderEnabled: state?["reminderEnabled"] as? Bool ?? false
    )
  }
}

struct PrayerWidgetView: View {
  var entry: PrayerWidgetEntry

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      Text(entry.locationLabel)
        .font(.headline.weight(.bold))
        .foregroundStyle(Color(red: 0.96, green: 0.90, blue: 0.78))
        .lineLimit(1)
      if !entry.timezone.isEmpty {
        Text(entry.timezone)
          .font(.caption)
          .foregroundStyle(.white.opacity(0.75))
          .lineLimit(1)
      }

      HStack(alignment: .firstTextBaseline) {
        VStack(alignment: .leading, spacing: 2) {
          Text(entry.nextPrayerName)
            .font(.title3.weight(.semibold))
            .foregroundStyle(.white)
          Text(entry.nextPrayerTime)
            .font(.subheadline)
            .foregroundStyle(Color(red: 0.83, green: 0.69, blue: 0.22))
        }
        Spacer()
        Text(entry.countdown)
          .font(.title2.monospacedDigit().weight(.bold))
          .foregroundStyle(.white)
      }

      HStack {
        prayerChip("Fajr", entry.fajr)
        prayerChip("Dhuhr", entry.dhuhr)
        prayerChip("Asr", entry.asr)
        prayerChip("Maghrib", entry.maghrib)
        prayerChip("Isha", entry.isha)
      }

      HStack(spacing: 8) {
        Link(destination: URL(string: "projectdeeplink://prayer/remind")!) {
          Label(
            entry.reminderEnabled ? "Reminder On" : "Remind",
            systemImage: entry.reminderEnabled ? "bell.fill" : "bell"
          )
          .font(.caption.weight(.semibold))
          .foregroundStyle(Color(red: 0.12, green: 0.24, blue: 0.18))
          .frame(maxWidth: .infinity)
          .padding(.vertical, 8)
          .background(Color(red: 0.83, green: 0.69, blue: 0.22))
          .clipShape(RoundedRectangle(cornerRadius: 10))
        }
        Link(destination: URL(string: "projectdeeplink://prayer/open")!) {
          Label("Open prayers", systemImage: "arrow.right.circle.fill")
            .font(.caption.weight(.semibold))
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 8)
            .background(Color.white.opacity(0.15))
            .clipShape(RoundedRectangle(cornerRadius: 10))
        }
      }
    }
    .padding()
    .containerBackground(for: .widget) {
      Color(red: 0.06, green: 0.24, blue: 0.18)
    }
  }

  @ViewBuilder
  private func prayerChip(_ name: String, _ time: String) -> some View {
    VStack(spacing: 2) {
      Text(name)
        .font(.system(size: 9, weight: .semibold))
        .foregroundStyle(.white.opacity(0.7))
      Text(time)
        .font(.system(size: 10, weight: .bold).monospacedDigit())
        .foregroundStyle(.white)
    }
    .frame(maxWidth: .infinity)
  }
}

struct PrayerTimesWidget: Widget {
  let kind = "PrayerTimesWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: PrayerWidgetProvider()) { entry in
      PrayerWidgetView(entry: entry)
    }
    .configurationDisplayName("Prayer Times")
    .description("Upcoming prayer countdown, location, reminders, and quick open.")
    .supportedFamilies([.systemMedium, .systemLarge])
  }
}

@main
struct RNTSWidgetBundle: WidgetBundle {
  var body: some Widget {
    QuranAudioWidget()
    PrayerTimesWidget()
  }
}
