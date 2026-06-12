import React from 'react';
import {StyleSheet, View} from 'react-native';

import FeatureHubCard from '@atoms/FeatureHubCard';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

interface ChatHubProps {
  navigation: AppStackNavigationProp<'ChatHub'>;
}

const ChatHub = ({navigation}: ChatHubProps): React.JSX.Element => {
  const threads = useAppSelector(state => state.chat.threads);
  const contacts = useAppSelector(state => state.chat.contacts);
  const unread = threads.reduce((sum, t) => sum + t.unread, 0);
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      hero: {
        ...tokens.layout.presets.columnCenter,
        backgroundColor: tokens.colors.surfaceSecondary,
        borderRadius: tokens.radius.lg,
        padding: tokens.spacing.lg,
        borderWidth: tokens.layout.borderWidth.sm,
        borderColor: tokens.colors.border,
      },
      grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
      stats: {...tokens.layout.presets.rowBetween, width: '100%'},
    }),
  );

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title="Chat" showBack={false} />
      <View style={styles.hero}>
        <Heading text="Messages" level="h2" align="center" />
        <Spacer size="xs" />
        <TextView text="Real-time conversations with teams, support and contacts." align="center" muted />
        <Spacer size="md" />
        <View style={styles.stats}>
          <TextView text={`${threads.length} threads`} variant="bodySmall" />
          <TextView text={`${unread} unread`} variant="bodySmall" />
          <TextView text={`${contacts.length} contacts`} variant="bodySmall" />
        </View>
      </View>
      <Spacer size="lg" />
      <View style={styles.grid}>
        <FeatureHubCard
          title="Inbox"
          subtitle="All conversations"
          iconType="Ionicons"
          iconName="chatbubbles-outline"
          onPress={() => navigation.navigate('ChatList')}
        />
        <FeatureHubCard
          title="New chat"
          subtitle="Start a conversation"
          iconType="Ionicons"
          iconName="add-circle-outline"
          onPress={() => navigation.navigate('NewChat')}
        />
        <FeatureHubCard
          title="Search"
          subtitle="Find messages"
          iconType="Ionicons"
          iconName="search-outline"
          onPress={() => navigation.navigate('ChatSearch')}
        />
        <FeatureHubCard
          title="Calls"
          subtitle="Audio & video log"
          iconType="Ionicons"
          iconName="call-outline"
          onPress={() => navigation.navigate('ChatCallLog')}
        />
      </View>
    </ScreenContainer>
  );
};

export default ChatHub;
