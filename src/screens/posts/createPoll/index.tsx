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
import type {AppStackNavigationProp} from '@Types/appNavigation';

interface CreatePollProps {
  navigation: AppStackNavigationProp<'CreatePoll'>;
}

const CreatePoll = ({navigation}: CreatePollProps): React.JSX.Element => {
  const {t} = useTranslation();
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      optionRow: {...tokens.layout.presets.row, gap: tokens.spacing.sm},
      optionInput: {flex: tokens.layout.flex.fill},
    }),
  );

  const addOption = () => {
    if (options.length < 4) setOptions([...options, '']);
  };

  const publish = () => {
    const valid = options.filter(o => o.trim());
    if (!question.trim() || valid.length < 2) return;
    dispatch(
      addPost({
        id: Date.now().toString(),
        author: user?.email?.split('@')[0] || 'You',
        avatar: 'https://i.pravatar.cc/100?u=99',
        content: question.trim(),
        mediaType: 'poll',
        likes: 0,
        likedByMe: false,
        myReaction: null,
        shares: 0,
        comments: [],
        hashtags: extractHashtags(question),
        poll: {
          options: valid.map((text, i) => ({
            id: `o${Date.now()}${i}`,
            text: text.trim(),
            votes: 0,
          })),
        },
        createdAt: new Date().toISOString(),
      }),
    );
    navigation.goBack();
  };

  return (
    <ScreenContainer scroll>
      <ScreenHeader title={t('posts.createPollTitle')} onBack={() => navigation.goBack()} />
      <Card>
        <Heading text={t('posts.askQuestion')} level="h3" />
        <Spacer size="md" />
        <TextInputView
          placeholder={t('posts.pollQuestionPlaceholder')}
          value={question}
          onChangeText={setQuestion}
        />
        <Spacer size="md" />
        <TextView text={t('posts.options')} variant="bodySmall" muted />
        <Spacer size="sm" />
        {options.map((opt, index) => (
          <View key={index} style={styles.optionRow}>
            <View style={styles.optionInput}>
              <TextInputView
                placeholder={t('posts.optionN', {n: index + 1})}
                value={opt}
                onChangeText={text => {
                  const next = [...options];
                  next[index] = text;
                  setOptions(next);
                }}
              />
            </View>
          </View>
        ))}
        <Spacer size="sm" />
        <Button label={t('posts.addOption')} variant="ghost" onPress={addOption} />
        <Spacer size="md" />
        <Button label={t('posts.publishPoll')} fullWidth onPress={publish} />
      </Card>
    </ScreenContainer>
  );
};

export default CreatePoll;
