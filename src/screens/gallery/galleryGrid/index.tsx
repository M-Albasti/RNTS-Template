import React from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';

import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {GalleryImage} from '@Types/galleryTypes';

interface GalleryGridProps {
  navigation: AppStackNavigationProp<'GalleryGrid'>;
}

const GalleryGrid = ({navigation}: GalleryGridProps): React.JSX.Element => {
  const images = useAppSelector(state => state.gallery.images.filter(i => !i.hidden));
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      list: {flex: tokens.layout.flex.fill},
      tile: {
        flex: tokens.layout.flex.fill,
        margin: tokens.spacing.xs,
        borderRadius: tokens.radius.md,
        overflow: tokens.layout.overflow.hidden,
        aspectRatio: 1,
        borderWidth: tokens.layout.borderWidth.sm,
        borderColor: tokens.colors.border,
      },
      image: {width: '100%', height: '100%'},
      overlay: {
        position: tokens.layout.position.absolute,
        left: 0,
        right: 0,
        bottom: 0,
        padding: tokens.spacing.xs,
        backgroundColor: tokens.colors.overlay,
      },
      overlayText: {color: tokens.colors.textInverse},
    }),
  );

  const renderItem = ({item}: {item: GalleryImage}) => (
    <Pressable
      style={styles.tile}
      onPress={() => navigation.navigate('ImageViewer', {imageId: item.id})}>
      <Image source={{uri: item.uri}} style={styles.image} />
      <View style={styles.overlay}>
        <TextView text={item.title} variant="caption" style={styles.overlayText} />
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer>
      <ScreenHeader title="All photos" onBack={() => navigation.goBack()} />
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
