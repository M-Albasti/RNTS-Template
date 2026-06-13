import React from 'react';
import {StyleSheet, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
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
import {addCallLog} from '@redux/slices/chatSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {CallLogEntry} from '@Types/chatTypes';

interface ChatCallLogProps {
  navigation: AppStackNavigationProp<'ChatCallLog'>;
}

const ChatCallLog = ({navigation}: ChatCallLogProps): React.JSX.Element => {
  const {t} = useTranslation();
  const logs = useAppSelector(state => state.chat.callLogs);
  const dispatch = useAppDispatch();
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      list: {flex: tokens.layout.flex.fill},
      row: {...tokens.layout.presets.rowBetween},
      missed: {color: tokens.colors.error},
    }),
  );

  const startCall = (type: 'audio' | 'video') => {
    dispatch(
      addCallLog({
        id: Date.now().toString(),
        name: t('chat.quickContact'),
        type,
        direction: 'outgoing',
        createdAt: new Date().toISOString(),
      }),
    );
  };

  const renderItem = ({item}: {item: CallLogEntry}) => (
    <Card>
      <View style={styles.row}>
        <View>
          <Heading text={item.name} level="h3" />
          <TextView
            text={`${item.type} · ${item.direction}`}
            variant="caption"
            muted
            style={item.direction === 'missed' ? styles.missed : undefined}
          />
        </View>
        <TextView text={new Date(item.createdAt).toLocaleTimeString()} variant="caption" muted />
      </View>
    </Card>
  );

  return (
    <ScreenContainer>
      <ScreenHeader title={t('chat.callLog')} onBack={() => navigation.goBack()} />
      <Button label={t('chat.startAudioCall')} fullWidth onPress={() => startCall('audio')} />
      <Spacer size="sm" />
      <Button
        label={t('chat.startVideoCall')}
        variant="secondary"
        fullWidth
        onPress={() => startCall('video')}
      />
      <Spacer size="md" />
      <FlashList
        data={logs}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        ItemSeparatorComponent={() => <Spacer size="sm" />}
      />
    </ScreenContainer>
  );
};

export default ChatCallLog;
