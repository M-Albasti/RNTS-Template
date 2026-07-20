import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import ApiErrorView from '@atoms/ApiErrorView';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import TextView from '@atoms/TextView';
import ListWithButtons from '@organisms/audios/audiosList/ListWithButtons';

import {useMediaAudiosQuery} from '@api/query/hooks/useMediaQueries';
import {useThemedStyles} from '@theme/createThemedStyles';
import {AppStackNavigationProp} from '@Types/appNavigation';

interface AudiosListTemplateProps {
  navigation: AppStackNavigationProp<'AudiosList'>;
}

/** Mume-inspired audio library shell. */
const AudiosListTemplate = ({
  navigation,
}: AudiosListTemplateProps): React.JSX.Element => {
  const {t} = useTranslation();
  const {data, isLoading, isError, refetch} = useMediaAudiosQuery();
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
        title={t('media.audios')}
        showDrawer
        navigation={navigation}
      />
      <View style={styles.libraryHeader}>
        <Heading text={t('media.audioLibrary')} level="h3" />
        <TextView text={t('media.audioLibrarySubtitle')} variant="bodySmall" muted />
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
        <ListWithButtons navigation={navigation} audiosData={data} />
      )}
    </ScreenContainer>
  );
};

export default AudiosListTemplate;
