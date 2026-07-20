import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import ApiErrorView from '@atoms/ApiErrorView';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import TextView from '@atoms/TextView';
import ListWithButtons from '@organisms/videos/videosList/ListWithButtons';

import {useMediaVideosQuery} from '@api/query/hooks/useMediaQueries';
import {useThemedStyles} from '@theme/createThemedStyles';
import {AppStackNavigationProp} from '@Types/appNavigation';

interface VideosListTemplateProps {
  navigation: AppStackNavigationProp<'VideosList'>;
}

/** MeTube-inspired video library shell. */
const VideosListTemplate = ({
  navigation,
}: VideosListTemplateProps): React.JSX.Element => {
  const {t} = useTranslation();
  const {data, isLoading, isError, refetch} = useMediaVideosQuery();
  const styles = useThemedStyles(tokens => ({
    body: {flex: tokens.layout.flex.fill},
    libraryHeader: {
      marginBottom: tokens.spacing.md,
      gap: tokens.spacing.xxs,
    },
    center: {
      flex: tokens.layout.flex.fill,
      ...tokens.layout.presets.center,
      padding: tokens.spacing.xl,
    },
  }));

  return (
    <ScreenContainer style={styles.body}>
      <ScreenHeader
        title={t('media.videos')}
        showDrawer
        navigation={navigation}
      />
      <View style={styles.libraryHeader}>
        <Heading text={t('media.videoLibrary')} level="h3" />
        <TextView text={t('media.videoLibrarySubtitle')} variant="bodySmall" muted />
      </View>
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : isError || !data?.length ? (
        <View style={styles.center}>
          <ApiErrorView
            message={t('media.loadFailed')}
            onRetry={() => {
              void refetch();
            }}
          />
        </View>
      ) : (
        <ListWithButtons navigation={navigation} videosData={data} />
      )}
    </ScreenContainer>
  );
};

export default VideosListTemplate;
