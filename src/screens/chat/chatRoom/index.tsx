import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';

import Button from '@atoms/Button';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextInputView from '@atoms/TextInputView';
import TextView from '@atoms/TextView';

import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {markRead, sendMessage, deleteMessage} from '@redux/slices/chatSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';
import type {ChatMessage} from '@Types/chatTypes';

interface ChatRoomProps {
  navigation: AppStackNavigationProp<'ChatRoom'>;
  route: AppRouteProp<'ChatRoom'>;
}

const ChatRoom = ({navigation, route}: ChatRoomProps): React.JSX.Element => {
  const {threadId} = route.params;
  const thread = useAppSelector(state => state.chat.threads.find(t => t.id === threadId));
  const dispatch = useAppDispatch();
  const [text, setText] = useState('');
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      list: {flex: tokens.layout.flex.fill},
      bubbleMe: {
        alignSelf: tokens.layout.alignSelf.end,
        backgroundColor: tokens.colors.primaryMuted,
        padding: tokens.spacing.sm,
        borderRadius: tokens.radius.md,
        maxWidth: '80%',
        borderWidth: tokens.layout.borderWidth.sm,
        borderColor: tokens.colors.border,
      },
      bubbleOther: {
        alignSelf: tokens.layout.alignSelf.start,
        backgroundColor: tokens.colors.surfaceSecondary,
        padding: tokens.spacing.sm,
        borderRadius: tokens.radius.md,
        maxWidth: '80%',
        borderWidth: tokens.layout.borderWidth.sm,
        borderColor: tokens.colors.border,
      },
      inputRow: {
        ...tokens.layout.presets.row,
        alignItems: tokens.layout.alignItems.end,
        gap: tokens.spacing.sm,
      },
      input: {flex: tokens.layout.flex.fill},
      headerActions: {...tokens.layout.presets.rowEnd, gap: tokens.spacing.sm},
    }),
  );

  const messages = useMemo(() => thread?.messages ?? [], [thread?.messages]);

  useEffect(() => {
    if (threadId) dispatch(markRead(threadId));
  }, [dispatch, threadId]);

  if (!thread) {
    return (
      <ScreenContainer centered>
        <TextView text="Chat not found" />
        <Spacer size="md" />
        <Button label="Go back" onPress={() => navigation.goBack()} />
      </ScreenContainer>
    );
  }

  const send = () => {
    if (!text.trim()) return;
    dispatch(
      sendMessage({
        threadId,
        message: {
          id: Date.now().toString(),
          text: text.trim(),
          senderId: 'me',
          createdAt: new Date().toISOString(),
          read: false,
        },
      }),
    );
    setText('');
  };

  const renderItem = ({item}: {item: ChatMessage}) => (
    <View style={item.senderId === 'me' ? styles.bubbleMe : styles.bubbleOther}>
      <TextView text={item.text} variant="bodySmall" />
      {item.senderId === 'me' ? (
        <TextView
          text={item.read ? 'Read' : 'Delivered'}
          variant="caption"
          muted
          align="right"
        />
      ) : null}
      {item.senderId === 'me' ? (
        <Button
          label="Delete"
          variant="ghost"
          size="sm"
          onPress={() => dispatch(deleteMessage({threadId, messageId: item.id}))}
        />
      ) : null}
    </View>
  );

  return (
    <ScreenContainer bottomPadding="lg">
      <ScreenHeader title={thread.name} onBack={() => navigation.goBack()} />
      <View style={styles.headerActions}>
        <Button
          label="Info"
          variant="ghost"
          size="sm"
          onPress={() => navigation.navigate('ChatInfo', {threadId})}
        />
      </View>
      <FlashList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        ItemSeparatorComponent={() => <Spacer size="sm" />}
      />
      <Spacer size="md" />
      <View style={styles.inputRow}>
        <View style={styles.input}>
          <TextInputView placeholder="Type a message..." value={text} onChangeText={setText} />
        </View>
        <Button label="Send" onPress={send} />
      </View>
    </ScreenContainer>
  );
};

export default ChatRoom;
