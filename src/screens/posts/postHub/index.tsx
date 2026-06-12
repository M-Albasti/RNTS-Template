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

interface PostHubProps {
  navigation: AppStackNavigationProp<'PostHub'>;
}

const PostHub = ({navigation}: PostHubProps): React.JSX.Element => {
  const posts = useAppSelector(state => state.posts.posts);
  const savedIds = useAppSelector(state => state.posts.savedIds);
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      hero: {
        ...tokens.layout.presets.columnCenter,
        backgroundColor: tokens.colors.primaryMuted,
        borderRadius: tokens.radius.lg,
        padding: tokens.spacing.lg,
        borderWidth: tokens.layout.borderWidth.sm,
        borderColor: tokens.colors.border,
      },
      grid: {
        ...tokens.layout.presets.wrapRow,
        gap: tokens.spacing.sm,
      },
      stats: {
        ...tokens.layout.presets.rowBetween,
        width: '100%',
      },
    }),
  );

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title="Social" showBack={false} />
      <View style={styles.hero}>
        <Heading text="Community feed" level="h2" align="center" />
        <Spacer size="xs" />
        <TextView
          text="Share text, images, audio and video. Like, comment and save posts."
          align="center"
          muted
        />
        <Spacer size="md" />
        <View style={styles.stats}>
          <TextView text={`${posts.length} posts`} variant="bodySmall" />
          <TextView text={`${savedIds.length} saved`} variant="bodySmall" />
        </View>
      </View>
      <Spacer size="lg" />
      <Heading text="Explore" level="h3" />
      <Spacer size="md" />
      <View style={styles.grid}>
        <FeatureHubCard
          title="Feed"
          subtitle="Browse all posts"
          iconType="Ionicons"
          iconName="newspaper-outline"
          onPress={() => navigation.navigate('Feed')}
        />
        <FeatureHubCard
          title="Create"
          subtitle="Publish a new post"
          iconType="Ionicons"
          iconName="create-outline"
          onPress={() => navigation.navigate('CreatePost')}
        />
        <FeatureHubCard
          title="Saved"
          subtitle="Your bookmarked posts"
          iconType="Ionicons"
          iconName="bookmark-outline"
          onPress={() => navigation.navigate('SavedPosts')}
        />
        <FeatureHubCard
          title="Search"
          subtitle="Find posts & authors"
          iconType="Ionicons"
          iconName="search-outline"
          onPress={() => navigation.navigate('PostSearch')}
        />
        <FeatureHubCard
          title="Polls"
          subtitle="Create interactive polls"
          iconType="Ionicons"
          iconName="bar-chart-outline"
          onPress={() => navigation.navigate('CreatePoll')}
        />
      </View>
    </ScreenContainer>
  );
};

export default PostHub;
