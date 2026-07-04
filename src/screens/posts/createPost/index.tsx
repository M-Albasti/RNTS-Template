import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
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
import {addPost, extractHashtags} from '@redux/slices/postsSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveCreatePostStyles} from './styles/resolveCreatePostStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {PostMediaType} from '@Types/postTypes';

const MEDIA_TYPES: PostMediaType[] = ['text', 'image', 'audio', 'video'];

interface CreatePostProps {
  navigation: AppStackNavigationProp<'CreatePost'>;
}

const CreatePost = ({navigation}: CreatePostProps): React.JSX.Element => {
  const {t} = useTranslation();
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();
  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState<PostMediaType>('text');
  const styles = useThemedStyles(resolveCreatePostStyles);

  const publish = () => {
    if (!content.trim()) return;
    dispatch(
      addPost({
        id: Date.now().toString(),
        author: user?.email?.split('@')[0] || 'You',
        avatar: 'https://i.pravatar.cc/100?u=99',
        content: content.trim(),
        mediaType,
        mediaUrl:
          mediaType === 'image'
            ? 'https://picsum.photos/seed/newpost/800/500'
            : mediaType === 'audio'
              ? 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
              : mediaType === 'video'
                ? 'https://picsum.photos/seed/newvideo/800/500'
                : undefined,
        likes: 0,
        likedByMe: false,
        myReaction: null,
        shares: 0,
        comments: [],
        hashtags: extractHashtags(content),
        createdAt: new Date().toISOString(),
      }),
    );
    navigation.goBack();
  };

  return (
    <ScreenContainer scroll>
      <ScreenHeader title={t('posts.newPost')} onBack={() => navigation.goBack()} />
      <Card>
        <Heading text={t('posts.shareSomething')} level="h3" />
        <Spacer size="md" />
        <TextView text={t('posts.postType')} variant="bodySmall" muted />
        <Spacer size="sm" />
        <View style={styles.types}>
          {MEDIA_TYPES.map(type => (
            <View
              key={type}
              style={[styles.typeChip, mediaType === type && styles.typeChipActive]}>
              <Button
                label={t(`posts.mediaTypes.${type}`)}
                variant="ghost"
                size="sm"
                onPress={() => setMediaType(type)}
              />
            </View>
          ))}
        </View>
        <Spacer size="md" />
        <TextInputView
          placeholder={t('posts.whatsOnMind')}
          multiline
          numberOfLines={5}
          value={content}
          onChangeText={setContent}
        />
        <Spacer size="md" />
        <Button label={t('common.publish')} fullWidth onPress={publish} />
      </Card>
    </ScreenContainer>
  );
};

export default CreatePost;
