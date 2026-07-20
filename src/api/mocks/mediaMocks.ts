import type MockAdapter from 'axios-mock-adapter';

import type {
  MediaAudiosResponseDto,
  MediaVideosResponseDto,
} from '@api/server/media.dto';

const SAMPLE_FILE = 'https://samplefile.com';

/** Dummy video catalog — SampleFile CDN playable MP4s + picsum thumbs. */
export const mockVideosCatalog: MediaVideosResponseDto = {
  items: [
    {
      id: 'v1',
      title: 'City Lights Reel',
      description: 'A short cinematic loop for player and feed media tests.',
      subtitle: 'SampleFile · 15s',
      thumb: 'https://picsum.photos/seed/cityreel/400/300',
      url: `${SAMPLE_FILE}/samples/download/video/mp4/mp4_15s_sample_file_868KB.mp4`,
    },
    {
      id: 'v2',
      title: 'Golden Hour',
      description: '30-second H.264 sample suitable for mobile streaming demos.',
      subtitle: 'SampleFile · 30s',
      thumb: 'https://picsum.photos/seed/goldenhour/400/300',
      url: `${SAMPLE_FILE}/samples/download/video/mp4/mp4_30s_sample_file_1.7MB.mp4`,
    },
    {
      id: 'v3',
      title: 'Quick Clip',
      description: 'Ultra-short sample for scrubbing and thumbnail tests.',
      subtitle: 'SampleFile · 5s',
      thumb: 'https://picsum.photos/seed/quickclip/400/300',
      url: `${SAMPLE_FILE}/samples/download/video/mp4/mp4_5s_sample_file_279KB.mp4`,
    },
    {
      id: 'v4',
      title: 'Weekend Story',
      description: 'One-minute sample for longer playback and buffering checks.',
      subtitle: 'SampleFile · 60s',
      thumb: 'https://picsum.photos/seed/weekend/400/300',
      url: `${SAMPLE_FILE}/samples/download/video/mp4/mp4_60s_sample_file_3.4MB.mp4`,
    },
    {
      id: 'v5',
      title: 'HD Showcase',
      description: '1080p H.264 / AAC clip for quality and aspect-ratio testing.',
      subtitle: 'SampleFile · 1080p',
      thumb: 'https://picsum.photos/seed/hdshow/400/300',
      url: `${SAMPLE_FILE}/samples/download/video/mp4/mp4_h264_aac_1080p_sample.mp4`,
    },
    {
      id: 'v6',
      title: 'Portrait Friendly',
      description: '720p sample that works well in list and fullscreen players.',
      subtitle: 'SampleFile · 720p',
      thumb: 'https://picsum.photos/seed/portraitvid/400/300',
      url: `${SAMPLE_FILE}/samples/download/video/mp4/mp4_h264_aac_720p_sample.mp4`,
    },
  ],
};

/** Dummy audio catalog — SampleFile CDN playable MP3s. */
export const mockAudiosCatalog: MediaAudiosResponseDto = {
  items: [
    {
      id: 'a1',
      title: 'Morning Loop',
      artist: 'SampleFile',
      album: 'Studio Loops',
      artwork: 'https://picsum.photos/seed/morningloop/400/400',
      url: `${SAMPLE_FILE}/samples/download/audio/mp3/mp3_music_loop_sample.mp3`,
      duration: 30,
    },
    {
      id: 'a2',
      title: 'Voice Note Demo',
      artist: 'SampleFile',
      album: 'Field Notes',
      artwork: 'https://picsum.photos/seed/voicenote/400/400',
      url: `${SAMPLE_FILE}/samples/download/audio/mp3/mp3_voice_note_sample.mp3`,
      duration: 20,
    },
    {
      id: 'a3',
      title: 'Fifteen Seconds',
      artist: 'SampleFile',
      album: 'Shorts',
      artwork: 'https://picsum.photos/seed/fifteensec/400/400',
      url: `${SAMPLE_FILE}/samples/download/audio/mp3/mp3_15s_sample_file_236KB.mp3`,
      duration: 15,
    },
    {
      id: 'a4',
      title: 'Half Minute Pulse',
      artist: 'SampleFile',
      album: 'Shorts',
      artwork: 'https://picsum.photos/seed/halfmin/400/400',
      url: `${SAMPLE_FILE}/samples/download/audio/mp3/mp3_30s_sample_file_470KB.mp3`,
      duration: 30,
    },
    {
      id: 'a5',
      title: 'One Minute Mix',
      artist: 'SampleFile',
      album: 'Sessions',
      artwork: 'https://picsum.photos/seed/onemin/400/400',
      url: `${SAMPLE_FILE}/samples/download/audio/mp3/mp3_60s_sample_file_939KB.mp3`,
      duration: 60,
    },
    {
      id: 'a6',
      title: 'Quick Tone',
      artist: 'SampleFile',
      album: 'Shorts',
      artwork: 'https://picsum.photos/seed/quicktone/400/400',
      url: `${SAMPLE_FILE}/samples/download/audio/mp3/mp3_5s_sample_file_80KB.mp3`,
      duration: 5,
    },
  ],
};

export const registerMediaMocks = (mock: MockAdapter): void => {
  mock.onGet('/media/videos').reply(200, mockVideosCatalog);
  mock.onGet('/media/audios').reply(200, mockAudiosCatalog);
};
