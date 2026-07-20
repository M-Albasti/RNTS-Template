import React, {useMemo} from 'react';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import PostCard from '@molecules/posts/PostCard';
import EmptyView from '@atoms/EmptyView';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';

import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {toggleLike, toggleSave} from '@redux/slices/postsSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveSavedPostsStyles} from './styles/resolveSavedPostsStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {PostItem} from '@Types/postTypes';

interface SavedPostsProps {
  navigation: AppStackNavigationProp<'SavedPosts'>;
}

const SavedPosts = ({navigation}: SavedPostsProps): React.JSX.Element => {
  const {t} = useTranslation();
  const postsRaw = useAppSelector(state => state.posts.posts);
  const savedIds = useAppSelector(state => state.posts.savedIds);
  const posts = useMemo(
    () => postsRaw.filter(p => savedIds.includes(p.id)),
    [postsRaw, savedIds],
  );
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(resolveSavedPostsStyles);

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
        <ScreenHeader title={t('posts.savedPosts')} navigation={navigation} />
        <EmptyView
          title={t('posts.noSavedPosts')}
          message={t('posts.savedSubtitle')}
          iconName="bookmark-outline"
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScreenHeader title={t('posts.savedPosts')} navigation={navigation} />
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
