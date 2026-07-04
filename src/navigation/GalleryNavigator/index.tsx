import React, {Suspense} from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import GalleryHub from '@screens/gallery/galleryHub';
import GalleryGrid from '@screens/gallery/galleryGrid';
import GalleryAlbums from '@screens/gallery/galleryAlbums';
import GalleryFavorites from '@screens/gallery/galleryFavorites';
import GallerySearch from '@screens/gallery/gallerySearch';
import GallerySlideshow from '@screens/gallery/gallerySlideshow';
import GalleryHidden from '@screens/gallery/galleryHidden';
import ImageViewer from '@screens/gallery/imageViewer';

import TextView from '@atoms/TextView';
import ErrorBoundary from '@atoms/ErrorBoundary';

import {RootStackParamList} from '@Types/appNavigation';

import {styles} from './styles';

const GalleryStack = createNativeStackNavigator<RootStackParamList>();

const GalleryNavigator = (): React.JSX.Element => {
  return (
    <GalleryStack.Navigator
      initialRouteName="GalleryHub"
      layout={({children}) => (
        <ErrorBoundary>
          <Suspense fallback={<TextView text={'Loading...'} style={styles.fallbackText} containerStyle={styles.fallback} />}>
            <View style={styles.container}>{children}</View>
          </Suspense>
        </ErrorBoundary>
      )}
      screenOptions={{headerShown: false}}>
      <GalleryStack.Screen name="GalleryHub" component={GalleryHub} />
      <GalleryStack.Screen name="GalleryGrid" component={GalleryGrid} />
      <GalleryStack.Screen name="GalleryAlbums" component={GalleryAlbums} />
      <GalleryStack.Screen name="GalleryFavorites" component={GalleryFavorites} />
      <GalleryStack.Screen name="GallerySearch" component={GallerySearch} />
      <GalleryStack.Screen name="GallerySlideshow" component={GallerySlideshow} />
      <GalleryStack.Screen name="GalleryHidden" component={GalleryHidden} />
      <GalleryStack.Screen name="ImageViewer" component={ImageViewer} />
    </GalleryStack.Navigator>
  );
};

export default GalleryNavigator;
