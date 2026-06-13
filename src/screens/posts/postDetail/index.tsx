import React, {useMemo, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextInputView from '@atoms/TextInputView';
import TextView from '@atoms/TextView';

import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {addComment, toggleLike, toggleSave} from '@redux/slices/postsSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

interface PostDetailProps {
  navigation: AppStackNavigationProp<'PostDetail'>;
  route: AppRouteProp<'PostDetail'>;
}

const PostDetail = ({navigation, route}: PostDetailProps): React.JSX.Element => {
  const {t} = useTranslation();
  const {postId} = route.params;
  const post = useAppSelector(state => state.posts.posts.find(p => p.id === postId));
  const saved = useAppSelector(state => state.posts.savedIds.includes(postId));
  const dispatch = useAppDispatch();
  const [commentText, setCommentText] = useState('');
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      avatar: {width: 48, height: 48, borderRadius: tokens.radius.full},
      header: {...tokens.layout.presets.row, gap: tokens.spacing.sm},
      media: {width: '100%', height: 200, borderRadius: tokens.radius.md},
      comment: {gap: tokens.spacing.xs},
      actions: {gap: tokens.spacing.sm},
    }),
  );

  const comments = useMemo(() => post?.comments ?? [], [post?.comments]);

  if (!post) {
    return (
      <ScreenContainer centered>
        <TextView text={t('posts.postNotFound')} />
        <Spacer size="md" />
        <Button label={t('common.goBack')} onPress={() => navigation.goBack()} />
      </ScreenContainer>
    );
  }

  const submitComment = () => {
    if (!commentText.trim()) return;
    dispatch(
      addComment({
        postId: post.id,
        comment: {
          id: Date.now().toString(),
          author: 'You',
          text: commentText.trim(),
          createdAt: new Date().toISOString(),
        },
      }),
    );
    setCommentText('');
  };

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('posts.postTitle')} onBack={() => navigation.goBack()} />
      <Card>
        <View style={styles.header}>
          <Image source={{uri: post.avatar}} style={styles.avatar} />
          <Heading text={post.author} level="h3" />
        </View>
        <Spacer size="sm" />
        <TextView text={post.content} />
        {post.mediaType === 'image' && post.mediaUrl ? (
          <>
            <Spacer size="sm" />
            <Image source={{uri: post.mediaUrl}} style={styles.media} />
          </>
        ) : null}
        <Spacer size="md" />
        <View style={styles.actions}>
          <Button
            label={
              post.likedByMe
                ? t('posts.liked', {count: post.likes})
                : t('posts.like', {count: post.likes})
            }
            variant={post.likedByMe ? 'primary' : 'outline'}
            onPress={() => dispatch(toggleLike(post.id))}
          />
          <Button
            label={saved ? t('posts.savedLabel') : t('posts.savePost')}
            variant={saved ? 'secondary' : 'outline'}
            onPress={() => dispatch(toggleSave(post.id))}
          />
        </View>
      </Card>
      <Spacer size="lg" />
      <Heading text={t('posts.comments')} level="h3" />
      <Spacer size="sm" />
      {comments.map(comment => (
        <View key={comment.id}>
          <Card>
            <View style={styles.comment}>
              <Heading text={comment.author} level="h3" />
              <TextView text={comment.text} variant="bodySmall" />
            </View>
          </Card>
          <Spacer size="sm" />
        </View>
      ))}
      <Spacer size="md" />
      <TextInputView
        placeholder={t('posts.writeComment')}
        value={commentText}
        onChangeText={setCommentText}
      />
      <Spacer size="sm" />
      <Button label={t('posts.postComment')} fullWidth onPress={submitComment} />
    </ScreenContainer>
  );
};

export default PostDetail;
