import React from 'react';
import {Image, Pressable, StyleSheet, View, ImageStyle} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveGalleryFavoritesStyles} from './styles/resolveGalleryFavoritesStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {GalleryImage} from '@Types/galleryTypes';

interface GalleryFavoritesProps {
  navigation: AppStackNavigationProp<'GalleryFavorites'>;
}

const GalleryFavorites = ({navigation}: GalleryFavoritesProps): React.JSX.Element => {
  const {t} = useTranslation();
  const favorites = useAppSelector(state => state.gallery.images.filter(i => i.favorite));
  const styles = useThemedStyles(resolveGalleryFavoritesStyles)

  if (favorites.length === 0) {
    return (
      <ScreenContainer>
        <ScreenHeader title={t('gallery.favorites')} onBack={() => navigation.goBack()} />
        <View style={styles.empty}>
          <TextView text={t('gallery.noFavoritePhotos')} muted align="center" />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader title={t('gallery.favorites')} onBack={() => navigation.goBack()} />
      <FlashList
        data={favorites}
        numColumns={2}
        keyExtractor={item => item.id}
        renderItem={({item}: {item: GalleryImage}) => (
          <Pressable
            style={styles.tile}
            onPress={() => navigation.navigate('ImageViewer', {imageId: item.id})}>
            <Image source={{uri: item.uri}} style={styles.image as ImageStyle} />
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
};

export default GalleryFavorites;
