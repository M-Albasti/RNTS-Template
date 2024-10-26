interface SoundsProps {
  id: string;
  url: string;
  title: string;
  artist: string;
  artwork: string;
  album: string;
  duration: number;
}

export const sounds: SoundsProps[] = [
  {
    id: '1',
    url: 'https://www.chosic.com/wp-content/uploads/2021/07/The-Epic-Hero-Epic-Cinematic-Keys-of-Moon-Music.mp3',
    title: 'Keys of moon',
    artist: 'The Epic Hero',
    artwork: 'https://picsum.photos/id/1003/200/300',
    album: '',
    duration: 149,
  },
  {
    id: '2',
    url: 'https://www.chosic.com/wp-content/uploads/2021/07/Raindrops-on-window-sill.mp3',
    title: 'Raindrops on window sill',
    artist: '',
    artwork: 'https://picsum.photos/id/10/200/300',
    album: 'Chosic',
    duration: 119,
  },
  {
    id: '3',
    url: 'https://www.chosic.com/wp-content/uploads/2021/07/purrple-cat-equinox.mp3',
    title: 'Equinox',
    artist: 'Purple Cat',
    artwork: 'https://picsum.photos/id/1016/200/300',
    album: '',
    duration: 140,
  },
  {
    id: '4',
    url: 'https://www.chosic.com/wp-content/uploads/2021/04/And-So-It-Begins-Inspired-By-Crush-Sometimes.mp3',
    title: 'And So It Begins',
    artist: '',
    artwork: 'https://picsum.photos/id/1019/200/300',
    album: 'Artificial Music',
    duration: 208,
  },
  {
    id: '5',
    url: 'https://www.chosic.com/wp-content/uploads/2021/05/inossi-got-you.mp3',
    title: 'Got You',
    artist: '',
    artwork: 'https://picsum.photos/id/103/200/300',
    album: 'INOSSI',
    duration: 178,
  },
  {
    id: '6',
    url: 'https://www.chosic.com/wp-content/uploads/2021/04/kvgarlic__largestreamoverloginforestmarch.mp3',
    title: 'Peaceful water stream',
    artist: '',
    artwork: 'https://picsum.photos/id/1038/200/300',
    album: 'Chosic',
    duration: 66,
  },
];
