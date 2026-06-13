import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

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
  const {t} = useTranslation();
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
        <TextView text={t('chat.threadNotFound')} />
        <Spacer size="md" />
        <Button label={t('common.goBack')} onPress={() => navigation.goBack()} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll>
      <ScreenHeader title={t('chat.chatInfo')} onBack={() => navigation.goBack()} />
      <Card>
        <Image source={{uri: thread.avatar}} style={styles.avatar} />
        <Spacer size="md" />
        <Heading text={thread.name} level="h2" align="center" />
        <TextView
          text={thread.online ? t('common.onlineNow') : t('common.offline')}
          align="center"
          muted
        />
      </Card>
      <Spacer size="lg" />
      <Card>
        <View style={styles.row}>
          <TextView text={t('common.muted')} variant="body" />
          <TextView text={thread.muted ? t('common.yes') : t('common.no')} variant="bodySmall" muted />
        </View>
        <Spacer size="md" />
        <Button
          label={thread.pinned ? t('chat.unpinChat') : t('chat.pinChat')}
          variant="outline"
          fullWidth
          onPress={() => dispatch(togglePin(threadId))}
        />
        <Spacer size="sm" />
        <Button
          label={thread.muted ? t('chat.unmuteNotifications') : t('chat.muteNotifications')}
          variant="secondary"
          fullWidth
          onPress={() => dispatch(toggleMute(threadId))}
        />
        <Spacer size="sm" />
        <Button
          label={t('chat.clearHistory')}
          variant="outline"
          fullWidth
          onPress={() => dispatch(clearThread(threadId))}
        />
        <Spacer size="sm" />
        <Button
          label={t('chat.openConversation')}
          fullWidth
          onPress={() => navigation.navigate('ChatRoom', {threadId})}
        />
      </Card>
    </ScreenContainer>
  );
};

export default ChatInfo;
