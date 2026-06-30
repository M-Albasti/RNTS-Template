import React from 'react';
import {ActivityIndicator, Pressable, ScrollView, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {
  useWordPuzzleBookQuery,
  useWordPuzzleStageSummariesQuery,
} from '@api/query/hooks/useWordPuzzleQueries';
import {useAppSelector} from '@hooks/useAppSelector';
import {isStageCompleted, isStageUnlocked} from '@redux/slices/wordPuzzleSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

type Props = {
  navigation: AppStackNavigationProp<'WordPuzzleStageMap'>;
  route: AppRouteProp<'WordPuzzleStageMap'>;
};

const WordPuzzleStageMap = ({navigation, route}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const progress = useAppSelector(state => state.wordPuzzle);
  const {bookId} = route.params;
  const {data: book, isLoading: bookLoading} = useWordPuzzleBookQuery(bookId);
  const {
    data: stages,
    isLoading: stagesLoading,
    isError,
    refetch,
  } = useWordPuzzleStageSummariesQuery(bookId);

  const styles = useThemedStyles(tokens => ({
    map: {
      backgroundColor: '#fff8e7',
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.lg,
      minHeight: 520,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
    },
    pathRow: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      gap: tokens.spacing.sm,
      justifyContent: 'center' as const,
    },
    node: {
      width: 52,
      height: 52,
      borderRadius: tokens.radius.full,
      borderWidth: tokens.layout.borderWidth.md,
      borderColor: tokens.colors.border,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      backgroundColor: tokens.colors.surface,
    },
    nodeActive: {borderColor: tokens.colors.primary, backgroundColor: tokens.colors.primaryMuted},
    nodeDone: {borderColor: '#27ae60', backgroundColor: '#d5f5e3'},
    nodeLocked: {opacity: 0.45},
    center: {...tokens.layout.presets.center, padding: tokens.spacing.xl},
  }));

  if (bookLoading || stagesLoading) {
    return (
      <ScreenContainer>
        <ScreenHeader title={t('wordPuzzle.title')} onBack={() => navigation.goBack()} />
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      </ScreenContainer>
    );
  }

  if (isError || !book || !stages) {
    return (
      <ScreenContainer>
        <ScreenHeader title={t('wordPuzzle.title')} onBack={() => navigation.goBack()} />
        <Card>
          <TextView text={t('wordPuzzle.errors.loadFailed')} muted />
          <Spacer size="sm" />
          <Pressable onPress={() => refetch()}>
            <TextView text={t('wordPuzzle.retry')} />
          </Pressable>
        </Card>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer bottomPadding="xxl">
      <ScreenHeader title={book.title} onBack={() => navigation.goBack()} />
      <TextView text={t('wordPuzzle.mapHint')} variant="bodySmall" muted />
      <Spacer size="md" />
      <ScrollView>
        <View style={styles.map}>
          <Heading text={book.title} level="h3" align="center" />
          <Spacer size="md" />
          <View style={styles.pathRow}>
            {stages.map(stage => {
              const done = isStageCompleted(progress, book.id, stage.id);
              const unlocked = isStageUnlocked(progress, book.id, stage.number);
              return (
                <Pressable
                  key={stage.id}
                  disabled={!unlocked}
                  style={[
                    styles.node,
                    done && styles.nodeDone,
                    unlocked && !done && styles.nodeActive,
                    !unlocked && styles.nodeLocked,
                  ]}
                  onPress={() =>
                    navigation.navigate('WordPuzzlePlay', {
                      bookId: book.id,
                      stageId: stage.id,
                    })
                  }>
                  <TextView text={String(stage.number)} variant="bodySmall" />
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};

export default WordPuzzleStageMap;
