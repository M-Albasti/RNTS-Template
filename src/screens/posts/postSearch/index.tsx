import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';

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
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {PostItem} from '@Types/postTypes';

interface PostSearchProps {
  navigation: AppStackNavigationProp<'PostSearch'>;
}

const PostSearch = ({navigation}: PostSearchProps): React.JSX.Element => {
  const posts = useAppSelector(state => state.posts.posts);
  const savedIds = useAppSelector(state => state.posts.savedIds);
  const query = useAppSelector(state => state.posts.searchQuery);
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      list: {flex: tokens.layout.flex.fill},
      empty: {...tokens.layout.presets.center, flex: tokens.layout.flex.fill},
    }),
  );

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
      <ScreenHeader title="Search posts" onBack={() => navigation.goBack()} />
      <TextInputView
        placeholder="Search by author or content..."
        value={query}
        onChangeText={text => dispatch(setSearchQuery(text))}
      />
      <Spacer size="md" />
      {results.length === 0 ? (
        <View style={styles.empty}>
          <TextView text="No posts match your search." muted align="center" />
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
