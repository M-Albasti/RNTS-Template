import WidgetKit
import SwiftUI

struct QuranWidgetEntry: TimelineEntry {
  let date: Date
  let title: String
  let subtitle: String
  let isPlaying: Bool
}

struct QuranWidgetProvider: TimelineProvider {
  func placeholder(in context: Context) -> QuranWidgetEntry {
    QuranWidgetEntry(date: Date(), title: "Quran", subtitle: "Ayah 1 · Surah 1", isPlaying: false)
  }

  func getSnapshot(in context: Context, completion: @escaping (QuranWidgetEntry) -> Void) {
    completion(loadEntry())
  }

  func getTimeline(in context: Context, completion: @escaping (Timeline<QuranWidgetEntry>) -> Void) {
    let entry = loadEntry()
    completion(Timeline(entries: [entry], policy: .after(Date().addingTimeInterval(60))))
  }

  private func loadEntry() -> QuranWidgetEntry {
    let defaults = UserDefaults(suiteName: "group.com.rnts.template")
    let state = defaults?.dictionary(forKey: "quran_widget_state")
    let surah = state?["surahNumber"] as? Int ?? 1
    let ayah = state?["ayahNumber"] as? Int ?? 1
    let playing = state?["isPlaying"] as? Bool ?? false
    let title = state?["title"] as? String ?? "Quran"
    return QuranWidgetEntry(
      date: Date(),
      title: title,
      subtitle: "Ayah \(ayah) · Surah \(surah)",
      isPlaying: playing
    )
  }
}

struct QuranWidgetView: View {
  var entry: QuranWidgetEntry

  var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      Text(entry.title)
        .font(.headline)
        .foregroundStyle(.white)
      Text(entry.subtitle)
        .font(.subheadline)
        .foregroundStyle(.white.opacity(0.9))
      HStack(spacing: 10) {
        Link(destination: URL(string: "projectdeeplink://quran/prev")!) {
          label("Prev")
        }
        Link(destination: URL(string: entry.isPlaying
                              ? "projectdeeplink://quran/pause"
                              : "projectdeeplink://quran/play")!) {
          label(entry.isPlaying ? "Pause" : "Play")
        }
        Link(destination: URL(string: "projectdeeplink://quran/next")!) {
          label("Next")
        }
      }
    }
    .padding()
    .containerBackground(for: .widget) {
      Color(red: 0.0, green: 0.41, blue: 0.36)
    }
  }

  @ViewBuilder
  private func label(_ text: String) -> some View {
    Text(text)
      .font(.caption.weight(.semibold))
      .foregroundStyle(Color(red: 0.0, green: 0.3, blue: 0.25))
      .frame(maxWidth: .infinity)
      .padding(.vertical, 6)
      .background(Color(red: 0.88, green: 0.95, blue: 0.94))
      .clipShape(RoundedRectangle(cornerRadius: 8))
  }
}

@main
struct QuranWidget: Widget {
  let kind = "QuranWidget"

  var body: some WidgetConfiguration {
    StaticConfiguration(kind: kind, provider: QuranWidgetProvider()) { entry in
      QuranWidgetView(entry: entry)
    }
    .configurationDisplayName("Quran Audio")
    .description("Control Quran recitation from your Home Screen.")
    .supportedFamilies([.systemMedium, .systemSmall])
  }
}
