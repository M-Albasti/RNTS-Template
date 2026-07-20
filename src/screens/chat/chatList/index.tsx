import React, {useMemo} from 'react';
import {Image, Pressable, View, ImageStyle} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import TouchableIcon from '@atoms/TouchableIcon';
import Button from '@atoms/Button';
import EmptyView from '@atoms/EmptyView';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveChatListStyles} from './styles/resolveChatListStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {ChatThread} from '@Types/chatTypes';

interface ChatListProps {
  navigation: AppStackNavigationProp<'ChatList'>;
}

const ChatList = ({navigation}: ChatListProps): React.JSX.Element => {
  const {t} = useTranslation();
  const {sizes} = useThemeTokens();
  const threadsRaw = useAppSelector(state => state.chat.threads);
  const threads = useMemo(
    () => [...threadsRaw].sort((a, b) => Number(b.pinned) - Number(a.pinned)),
    [threadsRaw],
  );
  const styles = useThemedStyles(resolveChatListStyles);

  const renderItem = ({item}: {item: ChatThread}) => (
    <Pressable
      style={styles.thread}
      onPress={() => navigation.navigate('ChatRoom', {threadId: item.id})}>
      <Image source={{uri: item.avatar}} style={styles.avatar as ImageStyle} />
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
            numberOfLines={1}
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
          size={sizes.iconSm}
          onPress={() => navigation.navigate('ChatInfo', {threadId: item.id})}
        />
      )}
    </Pressable>
  );

  return (
    <ScreenContainer>
      <ScreenHeader title={t('chat.messages')} navigation={navigation} />
      <View style={styles.composerBar}>
        <Button label={t('chat.newChat')} fullWidth onPress={() => navigation.navigate('NewChat')} />
      </View>
      <FlashList
        data={threads}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
        ItemSeparatorComponent={() => <Spacer size="sm" />}
        ListEmptyComponent={
          <EmptyView
            compact
            title={t('chat.emptyTitle')}
            message={t('chat.emptyMessage')}
            iconName="chatbubbles-outline"
            actionLabel={t('chat.newChat')}
            onAction={() => navigation.navigate('NewChat')}
          />
        }
      />
    </ScreenContainer>
  );
};

export default ChatList;
