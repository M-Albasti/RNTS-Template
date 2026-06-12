import {PayloadAction, createSlice} from '@reduxjs/toolkit';

import {GalleryAlbum, GalleryImage, GallerySort} from '@Types/galleryTypes';

export type GalleryState = {
  albums: GalleryAlbum[];
  images: GalleryImage[];
  sort: GallerySort;
  searchQuery: string;
};

const initialState: GalleryState = {
  albums: [
    {id: 'a1', title: 'Nature', coverUri: 'https://picsum.photos/seed/m1/600/600', count: 3},
    {id: 'a2', title: 'Urban', coverUri: 'https://picsum.photos/seed/m2/600/600', count: 2},
    {id: 'a3', title: 'Travel', coverUri: 'https://picsum.photos/seed/m4/600/600', count: 1},
  ],
  images: [
    {id: '1', title: 'Mountains', uri: 'https://picsum.photos/seed/m1/600/600', albumId: 'a1', favorite: true, hidden: false, caption: 'Alpine sunrise'},
    {id: '2', title: 'City', uri: 'https://picsum.photos/seed/m2/600/600', albumId: 'a2', favorite: false, hidden: false},
    {id: '3', title: 'Forest', uri: 'https://picsum.photos/seed/m3/600/600', albumId: 'a1', favorite: true, hidden: false},
    {id: '4', title: 'Ocean', uri: 'https://picsum.photos/seed/m4/600/600', albumId: 'a3', favorite: false, hidden: false},
    {id: '5', title: 'Desert', uri: 'https://picsum.photos/seed/m5/600/600', albumId: 'a1', favorite: false, hidden: true},
    {id: '6', title: 'Lake', uri: 'https://picsum.photos/seed/m6/600/600', albumId: 'a2', favorite: true, hidden: false},
  ],
  sort: 'date',
  searchQuery: '',
};

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const image = state.images.find(img => img.id === action.payload);
      if (image) image.favorite = !image.favorite;
    },
    toggleHidden: (state, action: PayloadAction<string>) => {
      const image = state.images.find(img => img.id === action.payload);
      if (image) image.hidden = !image.hidden;
    },
    setGallerySort: (state, action: PayloadAction<GallerySort>) => {
      state.sort = action.payload;
    },
    setGallerySearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {toggleFavorite, toggleHidden, setGallerySort, setGallerySearchQuery} =
  gallerySlice.actions;
export default gallerySlice.reducer;
