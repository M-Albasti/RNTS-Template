import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {clearThread, toggleMute, togglePin} from '@redux/slices/chatSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

interface ChatInfoProps {
  navigation: AppStackNavigationProp<'ChatInfo'>;
  route: AppRouteProp<'ChatInfo'>;
}

const ChatInfo = ({navigation, route}: ChatInfoProps): React.JSX.Element => {
  const {threadId} = route.params;
  const thread = useAppSelector(state =>
    state.chat.threads.find(t => t.id === threadId),
  );
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      avatar: {
        width: 88,
        height: 88,
        borderRadius: tokens.radius.full,
        ...tokens.layout.presets.selfCenter,
      },
      row: {...tokens.layout.presets.rowBetween},
    }),
  );

  if (!thread) {
    return (
      <ScreenContainer centered>
        <TextView text="Thread not found" />
        <Spacer size="md" />
        <Button label="Go back" onPress={() => navigation.goBack()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <ScreenHeader title="Chat info" onBack={() => navigation.goBack()} />
      <Card>
        <Image source={{uri: thread.avatar}} style={styles.avatar} />
        <Spacer size="md" />
        <Heading text={thread.name} level="h2" align="center" />
        <TextView
          text={thread.online ? 'Online now' : 'Offline'}
          align="center"
          muted
        />
      </Card>
      <Spacer size="lg" />
      <Card>
        <View style={styles.row}>
          <TextView text="Muted" variant="body" />
          <TextView text={thread.muted ? 'Yes' : 'No'} variant="bodySmall" muted />
        </View>
        <Spacer size="md" />
        <Button
          label={thread.pinned ? 'Unpin chat' : 'Pin chat'}
          variant="outline"
          fullWidth
          onPress={() => dispatch(togglePin(threadId))}
        />
        <Spacer size="sm" />
        <Button
          label={thread.muted ? 'Unmute notifications' : 'Mute notifications'}
          variant="secondary"
          fullWidth
          onPress={() => dispatch(toggleMute(threadId))}
        />
        <Spacer size="sm" />
        <Button
          label="Clear chat history"
          variant="outline"
          fullWidth
          onPress={() => dispatch(clearThread(threadId))}
        />
        <Spacer size="sm" />
        <Button
          label="Open conversation"
          fullWidth
          onPress={() => navigation.navigate('ChatRoom', {threadId})}
        />
      </Card>
    </ScreenContainer>
  );
};

export default ChatInfo;
