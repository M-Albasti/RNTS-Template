import React, {useMemo} from 'react';
import {Image, Pressable, StyleSheet, View, ImageStyle} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveGalleryAlbumsStyles} from './styles/resolveGalleryAlbumsStyles';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';
import type {GalleryAlbum, GalleryImage} from '@Types/galleryTypes';

interface GalleryAlbumsProps {
  navigation: AppStackNavigationProp<'GalleryAlbums'>;
  route: AppRouteProp<'GalleryAlbums'>;
}

const GalleryAlbums = ({navigation, route}: GalleryAlbumsProps): React.JSX.Element => {
  const {t} = useTranslation();
  const albums = useAppSelector(state => state.gallery.albums);
  const images = useAppSelector(state => state.gallery.images);
  const albumId = route.params?.albumId;
  const styles = useThemedStyles(resolveGalleryAlbumsStyles)

  const albumImages = useMemo(
    () => (albumId ? images.filter(img => img.albumId === albumId) : []),
    [albumId, images],
  );

  if (albumId) {
    const album = albums.find(a => a.id === albumId);
    return (
      <ScreenContainer>
        <ScreenHeader
          title={album?.title || t('gallery.albumFallback')}
          onBack={() => navigation.navigate('GalleryAlbums', undefined)}
        />
        <FlashList
          data={albumImages}
          numColumns={2}
          keyExtractor={item => item.id}
          renderItem={({item}: {item: GalleryImage}) => (
            <Pressable
              style={styles.tile}
              onPress={() => navigation.navigate('ImageViewer', {imageId: item.id})}>
              <Image source={{uri: item.uri}} style={styles.thumb as ImageStyle} />
            </Pressable>
          )}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader title={t('gallery.albums')} navigation={navigation} />
      <FlashList
        data={albums}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <Spacer size="sm" />}
        renderItem={({item}: {item: GalleryAlbum}) => (
          <Pressable onPress={() => navigation.navigate('GalleryAlbums', {albumId: item.id})}>
            <Card>
              <View style={styles.row}>
                <Image source={{uri: item.coverUri}} style={styles.cover as ImageStyle} />
                <View style={styles.meta}>
                  <Heading text={item.title} level="h3" />
                  <TextView
                    text={t('gallery.photosCount', {count: item.count})}
                    variant="caption"
                    muted
                  />
                </View>
              </View>
            </Card>
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
};

export default GalleryAlbums;
