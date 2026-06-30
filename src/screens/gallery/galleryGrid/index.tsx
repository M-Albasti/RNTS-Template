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
import {resolveGalleryGridStyles} from './styles/resolveGalleryGridStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {GalleryImage} from '@Types/galleryTypes';

interface GalleryGridProps {
  navigation: AppStackNavigationProp<'GalleryGrid'>;
}

const GalleryGrid = ({navigation}: GalleryGridProps): React.JSX.Element => {
  const {t} = useTranslation();
  const images = useAppSelector(state => state.gallery.images.filter(i => !i.hidden));
  const styles = useThemedStyles(resolveGalleryGridStyles)

  const renderItem = ({item}: {item: GalleryImage}) => (
    <Pressable
      style={styles.tile}
      onPress={() => navigation.navigate('ImageViewer', {imageId: item.id})}>
      <Image source={{uri: item.uri}} style={styles.image as ImageStyle} />
      <View style={styles.overlay}>
        <TextView text={item.title} variant="caption" style={styles.overlayText} />
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer>
      <ScreenHeader title={t('gallery.allPhotos')} onBack={() => navigation.goBack()} />
      <FlashList
        data={images}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </ScreenContainer>
  );
};

export default GalleryGrid;
