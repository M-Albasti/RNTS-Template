import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import FeatureHubCard from '@atoms/FeatureHubCard';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveChatHubStyles} from './styles/resolveChatHubStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

interface ChatHubProps {
  navigation: AppStackNavigationProp<'ChatHub'>;
}

const ChatHub = ({navigation}: ChatHubProps): React.JSX.Element => {
  const {t} = useTranslation();
  const threads = useAppSelector(state => state.chat.threads);
  const contacts = useAppSelector(state => state.chat.contacts);
  const unread = threads.reduce((sum, thread) => sum + thread.unread, 0);
  const styles = useThemedStyles(resolveChatHubStyles);

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader
        title={t('chat.title')}
        showBack={false}
        showDrawer
        navigation={navigation}
        rightActions={[
          {
            key: 'search',
            iconName: 'search-outline',
            onPress: () => navigation.navigate('ChatSearch'),
            accessibilityLabel: t('chat.searchMessages'),
          },
          {
            key: 'new',
            iconName: 'create-outline',
            onPress: () => navigation.navigate('NewChat'),
            accessibilityLabel: t('chat.newChat'),
          },
        ]}
      />
      <View style={styles.hero}>
        <Heading text={t('chat.messages')} level="h2" />
        <TextView text={t('chat.hubSubtitle')} muted />
        <View style={styles.stats}>
          <View style={styles.statChip}>
            <TextView text={`${threads.length}`} variant="h3" align="center" />
            <TextView text={t('chat.inbox')} variant="caption" muted align="center" />
          </View>
          <View style={styles.statChip}>
            <TextView text={`${unread}`} variant="h3" align="center" />
            <TextView text={t('profile.unreadChats')} variant="caption" muted align="center" />
          </View>
          <View style={styles.statChip}>
            <TextView text={`${contacts.length}`} variant="h3" align="center" />
            <TextView text={t('chat.contacts')} variant="caption" muted align="center" />
          </View>
        </View>
      </View>
      <Spacer size="lg" />
      <View style={styles.grid}>
        <FeatureHubCard
          title={t('chat.inbox')}
          subtitle={t('chat.inboxSubtitle')}
          iconType="Ionicons"
          iconName="chatbubbles-outline"
          onPress={() => navigation.navigate('ChatList')}
        />
        <FeatureHubCard
          title={t('chat.newChat')}
          subtitle={t('chat.newChatSubtitle')}
          iconType="Ionicons"
          iconName="add-circle-outline"
          onPress={() => navigation.navigate('NewChat')}
        />
        <FeatureHubCard
          title={t('common.search')}
          subtitle={t('chat.searchSubtitle')}
          iconType="Ionicons"
          iconName="search-outline"
          onPress={() => navigation.navigate('ChatSearch')}
        />
        <FeatureHubCard
          title={t('chat.calls')}
          subtitle={t('chat.callsSubtitle')}
          iconType="Ionicons"
          iconName="call-outline"
          onPress={() => navigation.navigate('ChatCallLog')}
        />
      </View>
    </ScreenContainer>
  );
};

export default ChatHub;
