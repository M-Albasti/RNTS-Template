import React from 'react';
import {Image, ImageStyle} from 'react-native';

import {Share} from 'react-native';
import {useTranslation} from 'react-i18next';

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
import {resolveImageViewerStyles} from './styles/resolveImageViewerStyles';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

interface ImageViewerProps {
  navigation: AppStackNavigationProp<'ImageViewer'>;
  route: AppRouteProp<'ImageViewer'>;
}

const ImageViewer = ({navigation, route}: ImageViewerProps): React.JSX.Element => {
  const {t} = useTranslation();
  const {imageId} = route.params;
  const image = useAppSelector(state => state.gallery.images.find(img => img.id === imageId));
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(resolveImageViewerStyles)

  if (!image) {
    return (
      <ScreenContainer centered>
        <TextView text={t('gallery.imageNotFound')} />
        <Spacer size="md" />
        <Button label={t('common.goBack')} onPress={() => navigation.goBack()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <ScreenHeader title={image.title} onBack={() => navigation.goBack()} />
      <Image source={{uri: image.uri}} style={styles.image as ImageStyle} resizeMode="cover" />
      <Spacer size="md" />
      <Heading text={image.title} level="h2" align="center" />
      <Spacer size="md" />
      <Button
        label={image.favorite ? t('gallery.removeFavorite') : t('gallery.addFavorite')}
        variant={image.favorite ? 'secondary' : 'outline'}
        fullWidth
        onPress={() => dispatch(toggleFavorite(image.id))}
      />
      <Spacer size="sm" />
      <Button
        label={image.hidden ? t('gallery.unhideVault') : t('gallery.moveVault')}
        variant="outline"
        fullWidth
        onPress={() => dispatch(toggleHidden(image.id))}
      />
      <Spacer size="sm" />
      <Button
        label={t('gallery.shareImage')}
        variant="ghost"
        fullWidth
        onPress={() => Share.share({message: image.uri, title: image.title})}
      />
      <Spacer size="sm" />
      <Button
        label={t('gallery.startSlideshow')}
        variant="secondary"
        fullWidth
        onPress={() => navigation.navigate('GallerySlideshow', {imageId: image.id})}
      />
    </ScreenContainer>
  );
};

export default ImageViewer;
