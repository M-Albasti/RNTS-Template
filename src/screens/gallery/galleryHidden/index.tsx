import React from 'react';
import {Image, Pressable, StyleSheet} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {GalleryImage} from '@Types/galleryTypes';

interface GalleryHiddenProps {
  navigation: AppStackNavigationProp<'GalleryHidden'>;
}

const GalleryHidden = ({navigation}: GalleryHiddenProps): React.JSX.Element => {
  const {t} = useTranslation();
  const hidden = useAppSelector(state => state.gallery.images.filter(i => i.hidden));
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      list: {flex: tokens.layout.flex.fill},
      tile: {
        flex: tokens.layout.flex.fill,
        margin: tokens.spacing.xs,
        borderRadius: tokens.radius.md,
        overflow: tokens.layout.overflow.hidden,
        aspectRatio: 1,
      },
      image: {width: '100%', height: '100%'},
      empty: {...tokens.layout.presets.center, flex: tokens.layout.flex.fill},
    }),
  );

  if (hidden.length === 0) {
    return (
      <ScreenContainer>
        <ScreenHeader title={t('gallery.privateVault')} onBack={() => navigation.goBack()} />
        <TextView text={t('gallery.noHiddenPhotos')} muted align="center" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader title={t('gallery.privateVault')} onBack={() => navigation.goBack()} />
      <FlashList
        data={hidden}
        numColumns={2}
        style={styles.list}
        keyExtractor={item => item.id}
        renderItem={({item}: {item: GalleryImage}) => (
          <Pressable
            style={styles.tile}
            onPress={() => navigation.navigate('ImageViewer', {imageId: item.id})}>
            <Image source={{uri: item.uri}} style={styles.image} />
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
};

export default GalleryHidden;
