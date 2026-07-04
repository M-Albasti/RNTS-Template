import React from 'react';
import {Image, Pressable, StyleSheet, View, ImageStyle} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {createThread} from '@redux/slices/chatSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveNewChatStyles} from './styles/resolveNewChatStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {ChatContact} from '@Types/chatTypes';

interface NewChatProps {
  navigation: AppStackNavigationProp<'NewChat'>;
}

const NewChat = ({navigation}: NewChatProps): React.JSX.Element => {
  const {t} = useTranslation();
  const contacts = useAppSelector(state => state.chat.contacts);
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(resolveNewChatStyles)

  const startChat = (contact: ChatContact) => {
    const threadId = Date.now().toString();
    dispatch(
      createThread({
        id: threadId,
        name: contact.name,
        avatar: contact.avatar,
        lastMessage: t('chat.chatStarted'),
        unread: 0,
        online: contact.online,
        muted: false,
        pinned: false,
        messages: [
          {
            id: `${threadId}-m0`,
            text: t('chat.greetingConnect', {name: contact.name}),
            senderId: 'me',
            createdAt: new Date().toISOString(),
            read: true,
          },
        ],
      }),
    );
    navigation.replace('ChatRoom', {threadId});
  };

  const renderItem = ({item}: {item: ChatContact}) => (
    <Pressable onPress={() => startChat(item)}>
      <Card>
        <View style={styles.row}>
          <Image source={{uri: item.avatar}} style={styles.avatar as ImageStyle} />
          <View style={styles.meta}>
            <Heading text={item.name} level="h3" />
            <TextView
              text={item.online ? t('common.online') : t('common.offline')}
              variant="caption"
              muted
            />
          </View>
          <View style={[styles.dot, !item.online && styles.offline]} />
        </View>
      </Card>
    </Pressable>
  );

  return (
    <ScreenContainer>
      <ScreenHeader title={t('chat.newChat')} onBack={() => navigation.goBack()} />
      <FlashList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <Spacer size="sm" />}
      />
    </ScreenContainer>
  );
};

export default NewChat;
