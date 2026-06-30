import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import PostCard from '@molecules/posts/PostCard';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextInputView from '@atoms/TextInputView';
import TextView from '@atoms/TextView';

import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {setSearchQuery, toggleLike, toggleSave} from '@redux/slices/postsSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolvePostSearchStyles} from './styles/resolvePostSearchStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {PostItem} from '@Types/postTypes';

interface PostSearchProps {
  navigation: AppStackNavigationProp<'PostSearch'>;
}

const PostSearch = ({navigation}: PostSearchProps): React.JSX.Element => {
  const {t} = useTranslation();
  const posts = useAppSelector(state => state.posts.posts);
  const savedIds = useAppSelector(state => state.posts.savedIds);
  const query = useAppSelector(state => state.posts.searchQuery);
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(resolvePostSearchStyles);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      p =>
        p.content.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.mediaType.includes(q),
    );
  }, [posts, query]);

  const renderItem = ({item}: {item: PostItem}) => (
    <PostCard
      post={item}
      saved={savedIds.includes(item.id)}
      onPress={() => navigation.navigate('PostDetail', {postId: item.id})}
      onLike={() => dispatch(toggleLike(item.id))}
      onSave={() => dispatch(toggleSave(item.id))}
    />
  );

  return (
    <ScreenContainer>
      <ScreenHeader title={t('posts.searchPosts')} onBack={() => navigation.goBack()} />
      <TextInputView
        placeholder={t('posts.searchPlaceholder')}
        value={query}
        onChangeText={text => dispatch(setSearchQuery(text))}
      />
      <Spacer size="md" />
      {results.length === 0 ? (
        <View style={styles.empty}>
          <TextView text={t('posts.noSearchResults')} muted align="center" />
        </View>
      ) : (
        <FlashList
          data={results}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
          ItemSeparatorComponent={() => <Spacer size="md" />}
        />
      )}
    </ScreenContainer>
  );
};

export default PostSearch;
