import React from 'react';
import {Image, Pressable, StyleSheet, View} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import TouchableIcon from '@atoms/TouchableIcon';
import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {ChatThread} from '@Types/chatTypes';

interface ChatListProps {
  navigation: AppStackNavigationProp<'ChatList'>;
}

const ChatList = ({navigation}: ChatListProps): React.JSX.Element => {
  const {t} = useTranslation();
  const threads = useAppSelector(state =>
    [...state.chat.threads].sort((a, b) => Number(b.pinned) - Number(a.pinned)),
  );
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      list: {flex: tokens.layout.flex.fill},
      row: {...tokens.layout.presets.row, gap: tokens.spacing.sm},
      avatar: {width: 48, height: 48, borderRadius: tokens.radius.full},
      meta: {flex: tokens.layout.flex.fill},
      badge: {
        minWidth: 24,
        height: 24,
        borderRadius: tokens.radius.full,
        backgroundColor: tokens.colors.primary,
        ...tokens.layout.presets.center,
        paddingHorizontal: tokens.spacing.xs,
      },
      badgeText: {
        color: tokens.colors.textInverse,
        fontSize: 12,
        fontWeight: '700',
        ...tokens.layout.presets.textCenter,
      },
      mutedIcon: {opacity: 0.5},
    }),
  );

  const renderItem = ({item}: {item: ChatThread}) => (
    <Card>
      <Pressable onPress={() => navigation.navigate('ChatRoom', {threadId: item.id})}>
        <View style={styles.row}>
          <Image source={{uri: item.avatar}} style={styles.avatar} />
          <View style={styles.meta}>
            <Heading text={item.name} level="h3" />
            <TextView
              text={
                item.muted
                  ? `${item.lastMessage}${t('common.mutedSuffix')}`
                  : item.lastMessage
              }
              variant="bodySmall"
              muted
            />
          </View>
          {item.unread > 0 ? (
            <View style={styles.badge}>
              <TextView text={`${item.unread}`} style={styles.badgeText} />
            </View>
          ) : (
            <TouchableIcon
              iconType="Ionicons"
              name="information-circle-outline"
              size={22}
              onPress={() => navigation.navigate('ChatInfo', {threadId: item.id})}
            />
          )}
        </View>
      </Pressable>
    </Card>
  );

  return (
    <ScreenContainer>
      <ScreenHeader title={t('chat.messages')} onBack={() => navigation.goBack()} />
      <Button label={t('chat.newChat')} fullWidth onPress={() => navigation.navigate('NewChat')} />
      <Spacer size="md" />
      <FlashList
        data={threads}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        ItemSeparatorComponent={() => <Spacer size="sm" />}
      />
    </ScreenContainer>
  );
};

export default ChatList;
