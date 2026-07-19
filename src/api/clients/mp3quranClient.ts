import {mp3quranHttpClient} from '@config/network/islamicHttpClient';
import {
  parseMushafPageFromTimingUrl,
  type QuranAyahTiming,
} from '@helpers/quranAudioHelpers';

type Mp3QuranAyahTimingDto = {
  ayah: number;
  start_time: number;
  end_time: number;
  page?: string | null;
};

/**
 * Fetches verse-level timestamps for a continuous surah MP3 from mp3quran.net.
 * Used so the mushaf page can follow the reciter during playback.
 */
export const mp3quranClient = {
  getSurahAyahTiming: async (
    surahNumber: number,
    readId: number,
  ): Promise<QuranAyahTiming[]> => {
    const {data} = await mp3quranHttpClient.get<Mp3QuranAyahTimingDto[]>(
      '/ayat_timing',
      {params: {surah: surahNumber, read: readId}},
    );

    if (!Array.isArray(data)) {
      return [];
    }

    const cues: QuranAyahTiming[] = [];
    let lastPage = 1;

    for (const item of data) {
      // ayah 0 is basmala preamble on some reads — keep page sync, skip ayah highlight.
      const pageFromUrl = parseMushafPageFromTimingUrl(item.page);
      if (pageFromUrl != null) {
        lastPage = pageFromUrl;
      }

      if (item.ayah < 1) {
        continue;
      }

      cues.push({
        ayahNumber: item.ayah,
        startMs: item.start_time,
        endMs: item.end_time,
        pageNumber: pageFromUrl ?? lastPage,
      });
    }

    return cues;
  },
};
