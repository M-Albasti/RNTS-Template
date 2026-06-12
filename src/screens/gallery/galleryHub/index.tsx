import React from 'react';
import {StyleSheet, View} from 'react-native';

import FeatureHubCard from '@atoms/FeatureHubCard';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

interface GalleryHubProps {
  navigation: AppStackNavigationProp<'GalleryHub'>;
}

const GalleryHub = ({navigation}: GalleryHubProps): React.JSX.Element => {
  const images = useAppSelector(state => state.gallery.images);
  const albums = useAppSelector(state => state.gallery.albums);
  const favorites = images.filter(i => i.favorite).length;
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      hero: {
        ...tokens.layout.presets.columnCenter,
        backgroundColor: tokens.colors.surfaceSecondary,
        borderRadius: tokens.radius.lg,
        padding: tokens.spacing.lg,
        borderWidth: tokens.layout.borderWidth.sm,
        borderColor: tokens.colors.border,
      },
      grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
      stats: {...tokens.layout.presets.rowBetween, width: '100%'},
    }),
  );

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title="Gallery" showBack={false} />
      <View style={styles.hero}>
        <Heading text="Your photos" level="h2" align="center" />
        <Spacer size="xs" />
        <TextView text="Browse albums, favorites and full-resolution images." align="center" muted />
        <Spacer size="md" />
        <View style={styles.stats}>
          <TextView text={`${images.length} photos`} variant="bodySmall" />
          <TextView text={`${albums.length} albums`} variant="bodySmall" />
          <TextView text={`${favorites} favorites`} variant="bodySmall" />
        </View>
      </View>
      <Spacer size="lg" />
      <View style={styles.grid}>
        <FeatureHubCard
          title="All photos"
          subtitle="Full library grid"
          iconType="Ionicons"
          iconName="grid-outline"
          onPress={() => navigation.navigate('GalleryGrid')}
        />
        <FeatureHubCard
          title="Albums"
          subtitle="Organized collections"
          iconType="Ionicons"
          iconName="albums-outline"
          onPress={() => navigation.navigate('GalleryAlbums', undefined)}
        />
        <FeatureHubCard
          title="Favorites"
          subtitle="Starred images"
          iconType="Ionicons"
          iconName="heart-outline"
          onPress={() => navigation.navigate('GalleryFavorites')}
        />
        <FeatureHubCard
          title="Search"
          subtitle="Find by title"
          iconType="Ionicons"
          iconName="search-outline"
          onPress={() => navigation.navigate('GallerySearch')}
        />
        <FeatureHubCard
          title="Slideshow"
          subtitle="Auto-play gallery"
          iconType="Ionicons"
          iconName="play-outline"
          onPress={() => navigation.navigate('GallerySlideshow', {imageId: images[0]?.id || '1'})}
        />
        <FeatureHubCard
          title="Private vault"
          subtitle="Hidden photos"
          iconType="Ionicons"
          iconName="lock-closed-outline"
          onPress={() => navigation.navigate('GalleryHidden')}
        />
      </View>
    </ScreenContainer>
  );
};

export default GalleryHub;
