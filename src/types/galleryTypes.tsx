export type GallerySort = 'date' | 'name' | 'favorite';

export type GalleryImage = {
  id: string;
  title: string;
  uri: string;
  albumId: string;
  favorite: boolean;
  hidden: boolean;
  caption?: string;
};

export type GalleryAlbum = {
  id: string;
  title: string;
  coverUri: string;
  count: number;
};
