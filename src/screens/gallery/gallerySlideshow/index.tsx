import React, {useEffect, useMemo, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

interface GallerySlideshowProps {
  navigation: AppStackNavigationProp<'GallerySlideshow'>;
  route: AppRouteProp<'GallerySlideshow'>;
}

const GallerySlideshow = ({navigation, route}: GallerySlideshowProps): React.JSX.Element => {
  const {t} = useTranslation();
  const {imageId} = route.params;
  const images = useAppSelector(state => state.gallery.images.filter(i => !i.hidden));
  const startIndex = Math.max(0, images.findIndex(i => i.id === imageId));
  const [index, setIndex] = useState(startIndex);
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      image: {
        width: '100%',
        height: 400,
        borderRadius: tokens.radius.lg,
      },
      controls: {...tokens.layout.presets.rowBetween},
    }),
  );

  const current = images[index];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (!current) {
    return (
      <ScreenContainer centered>
        <TextView text={t('gallery.noSlideshowPhotos')} />
        <Button label={t('common.goBack')} onPress={() => navigation.goBack()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader title={t('gallery.slideshow')} onBack={() => navigation.goBack()} />
      <Image source={{uri: current.uri}} style={styles.image} resizeMode="cover" />
      <Spacer size="md" />
      <Heading text={current.title} level="h2" align="center" />
      <TextView
        text={t('gallery.slideCounter', {current: index + 1, total: images.length})}
        align="center"
        muted
      />
      <Spacer size="md" />
      <View style={styles.controls}>
        <Button
          label={t('gallery.previous')}
          variant="outline"
          onPress={() => setIndex((index - 1 + images.length) % images.length)}
        />
        <Button
          label={t('gallery.next')}
          onPress={() => setIndex((index + 1) % images.length)}
        />
      </View>
    </ScreenContainer>
  );
};

export default GallerySlideshow;
