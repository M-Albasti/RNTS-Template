import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

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
import {resolveChatRoomStyles} from './styles/resolveChatRoomStyles';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';
import type {ChatMessage} from '@Types/chatTypes';

interface ChatRoomProps {
  navigation: AppStackNavigationProp<'ChatRoom'>;
  route: AppRouteProp<'ChatRoom'>;
}

const ChatRoom = ({navigation, route}: ChatRoomProps): React.JSX.Element => {
  const {t} = useTranslation();
  const {threadId} = route.params;
  const thread = useAppSelector(state => state.chat.threads.find(t => t.id === threadId));
  const dispatch = useAppDispatch();
  const [text, setText] = useState('');
  const styles = useThemedStyles(resolveChatRoomStyles);

  const messages = useMemo(() => thread?.messages ?? [], [thread?.messages]);

  useEffect(() => {
    if (threadId) dispatch(markRead(threadId));
  }, [dispatch, threadId]);

  if (!thread) {
    return (
      <ScreenContainer centered>
        <TextView text={t('chat.chatNotFound')} />
        <Spacer size="md" />
        <Button label={t('common.goBack')} onPress={() => navigation.goBack()} />
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
          text={item.read ? t('common.read') : t('common.delivered')}
          variant="caption"
          muted
          align="right"
        />
      ) : null}
      {item.senderId === 'me' ? (
        <Button
          label={t('common.delete')}
          variant="ghost"
          size="sm"
          onPress={() => dispatch(deleteMessage({threadId, messageId: item.id}))}
        />
      ) : null}
    </View>
  );

  return (
    <ScreenContainer bottomPadding="lg">
      <ScreenHeader title={thread.name} navigation={navigation} />
      <View style={styles.headerActions}>
        <Button
          label={t('common.info')}
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
          <TextInputView
            placeholder={t('chat.typeMessage')}
            value={text}
            onChangeText={setText}
          />
        </View>
        <Button label={t('common.send')} onPress={send} />
      </View>
    </ScreenContainer>
  );
};

export default ChatRoom;
