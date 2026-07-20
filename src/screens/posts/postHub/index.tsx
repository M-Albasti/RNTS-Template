import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import FeatureHubCard from '@atoms/FeatureHubCard';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppSelector} from '@hooks/useAppSelector';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolvePostHubStyles} from './styles/resolvePostHubStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

interface PostHubProps {
  navigation: AppStackNavigationProp<'PostHub'>;
}

const PostHub = ({navigation}: PostHubProps): React.JSX.Element => {
  const {t} = useTranslation();
  const posts = useAppSelector(state => state.posts.posts);
  const savedIds = useAppSelector(state => state.posts.savedIds);
  const styles = useThemedStyles(resolvePostHubStyles);

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('posts.hubTitle')} showBack={false} showDrawer navigation={navigation} />
      <View style={styles.hero}>
        <Heading text={t('posts.communityFeed')} level="h2" align="center" />
        <Spacer size="xs" />
        <TextView
          text={t('posts.communitySubtitle')}
          align="center"
          muted
        />
        <Spacer size="md" />
        <View style={styles.stats}>
          <TextView text={t('home.postsCount', {count: posts.length})} variant="bodySmall" />
          <TextView text={`${savedIds.length} ${t('posts.saved')}`} variant="bodySmall" />
        </View>
      </View>
      <Spacer size="lg" />
      <Heading text={t('posts.explore')} level="h3" />
      <Spacer size="md" />
      <View style={styles.grid}>
        <FeatureHubCard
          title={t('posts.feed')}
          subtitle={t('posts.feedSubtitle')}
          iconType="Ionicons"
          iconName="newspaper-outline"
          onPress={() => navigation.navigate('Feed')}
        />
        <FeatureHubCard
          title={t('posts.create')}
          subtitle={t('posts.createSubtitle')}
          iconType="Ionicons"
          iconName="create-outline"
          onPress={() => navigation.navigate('CreatePost')}
        />
        <FeatureHubCard
          title={t('posts.saved')}
          subtitle={t('posts.savedSubtitle')}
          iconType="Ionicons"
          iconName="bookmark-outline"
          onPress={() => navigation.navigate('SavedPosts')}
        />
        <FeatureHubCard
          title={t('common.search')}
          subtitle={t('posts.searchSubtitle')}
          iconType="Ionicons"
          iconName="search-outline"
          onPress={() => navigation.navigate('PostSearch')}
        />
        <FeatureHubCard
          title={t('posts.polls')}
          subtitle={t('posts.pollsSubtitle')}
          iconType="Ionicons"
          iconName="bar-chart-outline"
          onPress={() => navigation.navigate('CreatePoll')}
        />
      </View>
    </ScreenContainer>
  );
};

export default PostHub;
