import React, {useMemo} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Card from '@atoms/Card';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextInputView from '@atoms/TextInputView';
import TextView from '@atoms/TextView';

import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {setGallerySearchQuery} from '@redux/slices/gallerySlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveGallerySearchStyles} from './styles/resolveGallerySearchStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

interface GallerySearchProps {
  navigation: AppStackNavigationProp<'GallerySearch'>;
}

const GallerySearch = ({navigation}: GallerySearchProps): React.JSX.Element => {
  const {t} = useTranslation();
  const query = useAppSelector(state => state.gallery.searchQuery);
  const images = useAppSelector(state => state.gallery.images.filter(i => !i.hidden));
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(resolveGallerySearchStyles);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return images;
    return images.filter(
      i => i.title.toLowerCase().includes(q) || i.caption?.toLowerCase().includes(q),
    );
  }, [images, query]);

  return (
    <ScreenContainer>
      <ScreenHeader title={t('gallery.searchPhotos')} onBack={() => navigation.goBack()} />
      <TextInputView
        placeholder={t('gallery.searchPlaceholder')}
        value={query}
        onChangeText={text => dispatch(setGallerySearchQuery(text))}
      />
      <Spacer size="md" />
      {results.length === 0 ? (
        <View style={styles.empty}>
          <TextView text={t('gallery.noPhotosFound')} muted align="center" />
        </View>
      ) : (
        <FlashList
          data={results}
          style={styles.list}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <Spacer size="sm" />}
          renderItem={({item}) => (
            <Pressable onPress={() => navigation.navigate('ImageViewer', {imageId: item.id})}>
              <Card>
                <TextView text={item.title} variant="body" />
                {item.caption ? (
                  <TextView text={item.caption} variant="caption" muted />
                ) : null}
              </Card>
            </Pressable>
          )}
        />
      )}
    </ScreenContainer>
  );
};

export default GallerySearch;
