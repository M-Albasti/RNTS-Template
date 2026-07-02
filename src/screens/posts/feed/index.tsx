import React, {useEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {FlashList} from '@shopify/flash-list';

import Button from '@atoms/Button';
import PostCard from '@molecules/posts/PostCard';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useFeedQuery} from '@api/query/hooks/useFeedQuery';
import {queryKeys} from '@api/query/queryKeys';
import {queryClient} from '@api/query/queryClient';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {hydratePosts, setFeedSort, toggleLike, toggleSave} from '@redux/slices/postsSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveFeedStyles} from './styles/resolveFeedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {FeedSort, PostItem} from '@Types/postTypes';

interface FeedProps {
  navigation: AppStackNavigationProp<'Feed'>;
}

const Feed = ({navigation}: FeedProps): React.JSX.Element => {
  const {t} = useTranslation();
  const posts = useAppSelector(state => state.posts.posts);
  const savedIds = useAppSelector(state => state.posts.savedIds);
  const feedSort = useAppSelector(state => state.posts.feedSort);
  const dispatch = useAppDispatch();
  const feedQuery = useFeedQuery(feedSort);
  const styles = useThemedStyles(resolveFeedStyles);

  useEffect(() => {
    if (feedQuery.data) {
      dispatch(hydratePosts(feedQuery.data));
    }
  }, [dispatch, feedQuery.data]);

  const sortedPosts = useMemo(() => {
    const copy = [...posts];
    if (feedSort === 'popular') {
      return copy.sort((a, b) => b.likes + b.shares - (a.likes + a.shares));
    }
    return copy.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [posts, feedSort]);

  const renderItem = ({item}: {item: PostItem}) => (
    <PostCard
      post={item}
      saved={savedIds.includes(item.id)}
      onPress={() => navigation.navigate('PostDetail', {postId: item.id})}
      onLike={() => dispatch(toggleLike(item.id))}
      onSave={() => dispatch(toggleSave(item.id))}
    />
  );

  const setSort = (sort: FeedSort) => {
    dispatch(setFeedSort(sort));
    queryClient.invalidateQueries({queryKey: queryKeys.feed(sort)});
  };

  return (
    <ScreenContainer>
      <ScreenHeader title={t('feed.title')} onBack={() => navigation.goBack()} />
      {feedQuery.isFetching ? (
        <>
          <TextView text={t('feed.syncing')} variant="bodySmall" muted />
          <Spacer size="sm" />
        </>
      ) : null}
      <View style={styles.sortRow}>
        <Button
          label={t('feed.recent')}
          size="sm"
          variant={feedSort === 'recent' ? 'primary' : 'outline'}
          onPress={() => setSort('recent')}
        />
        <Button
          label={t('feed.popular')}
          size="sm"
          variant={feedSort === 'popular' ? 'primary' : 'outline'}
          onPress={() => setSort('popular')}
        />
      </View>
      <Spacer size="sm" />
      <Button label={t('feed.createPost')} fullWidth onPress={() => navigation.navigate('CreatePost')} />
      <Spacer size="xs" />
      <Button label={t('feed.createPoll')} variant="secondary" fullWidth onPress={() => navigation.navigate('CreatePoll')} />
      <Spacer size="md" />
      <FlashList
        data={sortedPosts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        ItemSeparatorComponent={() => <Spacer size="md" />}
        contentContainerStyle={styles.footer}
      />
    </ScreenContainer>
  );
};

export default Feed;
