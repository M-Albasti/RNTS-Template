import React from 'react';
import {StyleSheet, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import PostCard from '@molecules/posts/PostCard';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {toggleLike, toggleSave} from '@redux/slices/postsSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {PostItem} from '@Types/postTypes';

interface SavedPostsProps {
  navigation: AppStackNavigationProp<'SavedPosts'>;
}

const SavedPosts = ({navigation}: SavedPostsProps): React.JSX.Element => {
  const {t} = useTranslation();
  const posts = useAppSelector(state =>
    state.posts.posts.filter(p => state.posts.savedIds.includes(p.id)),
  );
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      list: {flex: tokens.layout.flex.fill},
      empty: {...tokens.layout.presets.center, flex: tokens.layout.flex.fill},
    }),
  );

  const renderItem = ({item}: {item: PostItem}) => (
    <PostCard
      post={item}
      onPress={() => navigation.navigate('PostDetail', {postId: item.id})}
      onLike={() => dispatch(toggleLike(item.id))}
      onSave={() => dispatch(toggleSave(item.id))}
      saved
    />
  );

  if (posts.length === 0) {
    return (
      <ScreenContainer>
        <ScreenHeader title={t('posts.savedPosts')} onBack={() => navigation.goBack()} />
        <View style={styles.empty}>
          <TextView text={t('posts.noSavedPosts')} muted align="center" />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader title={t('posts.savedPosts')} onBack={() => navigation.goBack()} />
      <FlashList
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        ItemSeparatorComponent={() => <Spacer size="md" />}
      />
    </ScreenContainer>
  );
};

export default SavedPosts;
