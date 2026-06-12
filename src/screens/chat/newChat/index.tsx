import React from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';

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
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {ChatContact} from '@Types/chatTypes';

interface NewChatProps {
  navigation: AppStackNavigationProp<'NewChat'>;
}

const NewChat = ({navigation}: NewChatProps): React.JSX.Element => {
  const contacts = useAppSelector(state => state.chat.contacts);
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      row: {...tokens.layout.presets.row, gap: tokens.spacing.sm},
      avatar: {width: 44, height: 44, borderRadius: tokens.radius.full},
      meta: {flex: tokens.layout.flex.fill},
      dot: {
        width: 10,
        height: 10,
        borderRadius: tokens.radius.full,
        backgroundColor: tokens.colors.success,
      },
      offline: {backgroundColor: tokens.colors.textMuted},
    }),
  );

  const startChat = (contact: ChatContact) => {
    const threadId = Date.now().toString();
    dispatch(
      createThread({
        id: threadId,
        name: contact.name,
        avatar: contact.avatar,
        lastMessage: 'Chat started',
        unread: 0,
        online: contact.online,
        muted: false,
        pinned: false,
        messages: [
          {
            id: `${threadId}-m0`,
            text: `Hi ${contact.name}, let's connect!`,
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
          <Image source={{uri: item.avatar}} style={styles.avatar} />
          <View style={styles.meta}>
            <Heading text={item.name} level="h3" />
            <TextView text={item.online ? 'Online' : 'Offline'} variant="caption" muted />
          </View>
          <View style={[styles.dot, !item.online && styles.offline]} />
        </View>
      </Card>
    </Pressable>
  );

  return (
    <ScreenContainer>
      <ScreenHeader title="New chat" onBack={() => navigation.goBack()} />
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
