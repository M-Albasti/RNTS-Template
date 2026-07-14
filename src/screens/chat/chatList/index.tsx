import React from 'react';
import {Image, Pressable, View, ImageStyle} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useTranslation} from 'react-i18next';

import TouchableIcon from '@atoms/TouchableIcon';
import Button from '@atoms/Button';
import Card from '@atoms/Card';
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
  const threads = useAppSelector(state =>
    [...state.chat.threads].sort((a, b) => Number(b.pinned) - Number(a.pinned)),
  );
  const styles = useThemedStyles(resolveChatListStyles)

  const renderItem = ({item}: {item: ChatThread}) => (
    <Card>
      <Pressable onPress={() => navigation.navigate('ChatRoom', {threadId: item.id})}>
        <View style={styles.row}>
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
