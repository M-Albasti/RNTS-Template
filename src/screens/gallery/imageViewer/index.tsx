import React from 'react';
import {Image, StyleSheet} from 'react-native';

import {Share} from 'react-native';

import Button from '@atoms/Button';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {toggleFavorite, toggleHidden} from '@redux/slices/gallerySlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

interface ImageViewerProps {
  navigation: AppStackNavigationProp<'ImageViewer'>;
  route: AppRouteProp<'ImageViewer'>;
}

const ImageViewer = ({navigation, route}: ImageViewerProps): React.JSX.Element => {
  const {imageId} = route.params;
  const image = useAppSelector(state => state.gallery.images.find(img => img.id === imageId));
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      image: {
        width: '100%',
        height: 360,
        borderRadius: tokens.radius.lg,
        borderWidth: tokens.layout.borderWidth.sm,
        borderColor: tokens.colors.border,
      },
      actions: {gap: tokens.spacing.sm},
    }),
  );

  if (!image) {
    return (
      <ScreenContainer centered>
        <TextView text="Image not found" />
        <Spacer size="md" />
        <Button label="Go back" onPress={() => navigation.goBack()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <ScreenHeader title={image.title} onBack={() => navigation.goBack()} />
      <Image source={{uri: image.uri}} style={styles.image} resizeMode="cover" />
      <Spacer size="md" />
      <Heading text={image.title} level="h2" align="center" />
      <Spacer size="md" />
      <Button
        label={image.favorite ? 'Remove from favorites' : 'Add to favorites'}
        variant={image.favorite ? 'secondary' : 'outline'}
        fullWidth
        onPress={() => dispatch(toggleFavorite(image.id))}
      />
      <Spacer size="sm" />
      <Button
        label={image.hidden ? 'Unhide from vault' : 'Move to private vault'}
        variant="outline"
        fullWidth
        onPress={() => dispatch(toggleHidden(image.id))}
      />
      <Spacer size="sm" />
      <Button
        label="Share image"
        variant="ghost"
        fullWidth
        onPress={() => Share.share({message: image.uri, title: image.title})}
      />
      <Spacer size="sm" />
      <Button
        label="Start slideshow"
        variant="secondary"
        fullWidth
        onPress={() => navigation.navigate('GallerySlideshow', {imageId: image.id})}
      />
    </ScreenContainer>
  );
};

export default ImageViewer;
