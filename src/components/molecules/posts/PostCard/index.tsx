import React from 'react';
import {Pressable, Share, View} from 'react-native';

import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';
import TouchableIcon from '@atoms/TouchableIcon';

import {useAppDispatch} from '@hooks/useAppDispatch';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolvePostCardStyles} from './styles/resolvePostCardStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import type {PostItem, ReactionType} from '@Types/postTypes';
import {setReaction, sharePost, votePoll} from '@redux/slices/postsSlice';

const REACTIONS: {type: ReactionType; icon: string}[] = [
  {type: 'like', icon: 'heart-outline'},
  {type: 'love', icon: 'heart'},
  {type: 'wow', icon: 'flash-outline'},
  {type: 'sad', icon: 'sad-outline'},
];

interface PostCardProps {
  post: PostItem;
  onPress: () => void;
  onLike: () => void;
  onSave?: () => void;
  saved?: boolean;
}

const PostCard = ({
  post,
  onPress,
  onLike,
  onSave,
  saved = false,
}: PostCardProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const {sizes} = useThemeTokens();
  const styles = useThemedStyles(resolvePostCardStyles);

  const onShare = async () => {
    dispatch(sharePost(post.id));
    await Share.share({message: `${post.author}: ${post.content}`});
  };

  const totalPollVotes =
    post.poll?.options.reduce((sum, o) => sum + o.votes, 0) || 0;

  return (
    <Pressable onPress={onPress}>
      <Card>
        <View style={styles.header}>
          <Heading text={post.author} level="h3" />
          <TextView text={post.mediaType.toUpperCase()} variant="caption" muted />
        </View>
        <Spacer size="sm" />
        <TextView text={post.content} variant="body" />
        {post.hashtags.length > 0 ? (
          <>
            <Spacer size="xs" />
            <View style={styles.tags}>
              {post.hashtags.map(tag => (
                <View key={tag} style={styles.tag}>
                  <TextView text={`#${tag}`} variant="caption" />
                </View>
              ))}
            </View>
          </>
        ) : null}
        {post.mediaType === 'poll' && post.poll ? (
          <>
            <Spacer size="sm" />
            {post.poll.options.map(option => {
              const pct = totalPollVotes
                ? Math.round((option.votes / totalPollVotes) * 100)
                : 0;
              const voted = post.poll?.votedOptionId === option.id;
              return (
                <Pressable
                  key={option.id}
                  style={[styles.pollOption, voted && styles.pollVoted]}
                  onPress={() => dispatch(votePoll({postId: post.id, optionId: option.id}))}>
                  <TextView text={option.text} variant="bodySmall" />
                  <TextView text={`${pct}%`} variant="caption" muted />
                </Pressable>
              );
            })}
          </>
        ) : null}
        <Spacer size="md" />
        <View style={styles.reactions}>
          {REACTIONS.map(r => (
            <TouchableIcon
              key={r.type}
              iconType="Ionicons"
              name={post.myReaction === r.type ? r.icon.replace('-outline', '') : r.icon}
              size={sizes.iconSm}
              onPress={() => dispatch(setReaction({postId: post.id, reaction: r.type}))}
            />
          ))}
        </View>
        <Spacer size="sm" />
        <View style={styles.actions}>
          <Pressable style={styles.actionRow} onPress={onLike}>
            <TextView text={`${post.likes} reactions`} variant="bodySmall" />
          </Pressable>
          <TextView text={`${post.comments.length} comments`} variant="bodySmall" muted />
          <TextView text={`${post.shares} shares`} variant="bodySmall" muted />
          {onSave ? (
            <TouchableIcon
              iconType="Ionicons"
              name={saved ? 'bookmark' : 'bookmark-outline'}
              size={sizes.iconSm}
              onPress={onSave}
            />
          ) : null}
          <TouchableIcon iconType="Ionicons" name="share-outline" size={sizes.iconSm} onPress={onShare} />
        </View>
      </Card>
    </Pressable>
  );
};

export default PostCard;
