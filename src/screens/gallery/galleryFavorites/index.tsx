import React from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';

import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {GalleryImage} from '@Types/galleryTypes';

interface GalleryFavoritesProps {
  navigation: AppStackNavigationProp<'GalleryFavorites'>;
}

const GalleryFavorites = ({navigation}: GalleryFavoritesProps): React.JSX.Element => {
  const favorites = useAppSelector(state => state.gallery.images.filter(i => i.favorite));
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
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

  if (favorites.length === 0) {
    return (
      <ScreenContainer>
        <ScreenHeader title="Favorites" onBack={() => navigation.goBack()} />
        <View style={styles.empty}>
          <TextView text="No favorite photos yet." muted align="center" />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader title="Favorites" onBack={() => navigation.goBack()} />
      <FlashList
        data={favorites}
        numColumns={2}
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

export default GalleryFavorites;
