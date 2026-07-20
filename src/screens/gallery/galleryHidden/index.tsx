import React, {useMemo} from 'react';
import {Image, Pressable, StyleSheet, ImageStyle} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveGalleryHiddenStyles} from './styles/resolveGalleryHiddenStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {GalleryImage} from '@Types/galleryTypes';

interface GalleryHiddenProps {
  navigation: AppStackNavigationProp<'GalleryHidden'>;
}

const GalleryHidden = ({navigation}: GalleryHiddenProps): React.JSX.Element => {
  const {t} = useTranslation();
  const images = useAppSelector(state => state.gallery.images);
  const hidden = useMemo(() => images.filter(i => i.hidden), [images]);
  const styles = useThemedStyles(resolveGalleryHiddenStyles);

  if (hidden.length === 0) {
    return (
      <ScreenContainer>
        <ScreenHeader title={t('gallery.privateVault')} navigation={navigation} />
        <TextView text={t('gallery.noHiddenPhotos')} muted align="center" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader title={t('gallery.privateVault')} navigation={navigation} />
      <FlashList
        data={hidden}
        numColumns={2}
        style={styles.list}
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

export default GalleryHidden;
