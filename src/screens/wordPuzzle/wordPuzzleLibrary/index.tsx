import React from 'react';
import {ActivityIndicator, Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useWordPuzzleBooksQuery} from '@api/query/hooks/useWordPuzzleQueries';
import {ARABIC_LAND_GROUPS, ENGLISH_LAND_GROUPS} from '@constants/wordPuzzle/wordPuzzleConfig';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {setActiveBook} from '@redux/slices/wordPuzzleSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';
import type {WordPuzzleBookSummary} from '@Types/wordPuzzleTypes';

type Props = {
  navigation: AppStackNavigationProp<'WordPuzzleLibrary'>;
  route: AppRouteProp<'WordPuzzleLibrary'>;
};

const WordPuzzleLibrary = ({navigation, route}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {language} = route.params;
  const {data: books, isLoading, isError, refetch, isFetching} = useWordPuzzleBooksQuery(language);

  const styles = useThemedStyles(tokens => ({
    list: {gap: tokens.spacing.md},
    landTitle: {marginTop: tokens.spacing.md, marginBottom: tokens.spacing.sm},
    row: {
      padding: tokens.spacing.md,
      borderRadius: tokens.radius.lg,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      backgroundColor: tokens.colors.surface,
    },
    rowPressed: {backgroundColor: tokens.colors.surfaceSecondary},
    badge: {
      alignSelf: 'flex-start' as const,
      backgroundColor: tokens.colors.primaryMuted,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xxs,
      marginBottom: tokens.spacing.xs,
    },
    center: {...tokens.layout.presets.center, padding: tokens.spacing.xl},
  }));

  const openBook = (book: WordPuzzleBookSummary) => {
    dispatch(setActiveBook(book.id));
    navigation.navigate('WordPuzzleStageMap', {bookId: book.id});
  };

  const landGroups = language === 'ar' ? ARABIC_LAND_GROUPS : ENGLISH_LAND_GROUPS;

  const booksByLand = landGroups.map(group => {
    const landBooks =
      books?.filter(book => {
        if (language === 'ar' && 'categoryIds' in group) {
          const categoryId = book.sourceMeta?.categoryId;
          return categoryId != null && (group.categoryIds as readonly number[]).includes(categoryId);
        }
        if ('categories' in group) {
          const category = book.sourceMeta?.category;
          return Boolean(category && group.categories.includes(category as (typeof group.categories)[number]));
        }
        return false;
      }) ?? [];
    return {group, landBooks};
  });

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader
        title={language === 'ar' ? t('wordPuzzle.arabicWorld') : t('wordPuzzle.englishWorld')}
        onBack={() => navigation.goBack()}
      />
      <TextView
        text={t('wordPuzzle.libraryHintApi')}
        variant="body"
        muted
        style={{textAlign: language === 'ar' ? 'right' : 'left'}}
      />
      <Spacer size="md" />
      {isLoading || isFetching ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Spacer size="sm" />
          <TextView text={t('wordPuzzle.loadingBooks')} variant="caption" muted />
        </View>
      ) : isError ? (
        <Card>
          <TextView text={t('wordPuzzle.errors.loadFailed')} variant="body" muted />
          <Spacer size="sm" />
          <Pressable onPress={() => refetch()}>
            <TextView text={t('wordPuzzle.retry')} variant="bodySmall" />
          </Pressable>
        </Card>
      ) : (
        booksByLand.map(({group, landBooks}) => (
          <View key={`land-${group.landIndex}`}>
            <Heading
              text={t('wordPuzzle.landTitle', {number: group.landIndex})}
              level="h3"
              style={styles.landTitle}
            />
            <View style={styles.list}>
              {landBooks.map(book => (
                <Pressable
                  key={book.id}
                  style={({pressed}) => [styles.row, pressed && styles.rowPressed]}
                  onPress={() => openBook(book)}>
                  <View style={styles.badge}>
                    <TextView
                      text={`${t('wordPuzzle.bookmark')} ${book.bookmarkNumber}`}
                      variant="caption"
                    />
                  </View>
                  <Heading text={book.title} level="h3" />
                  <Spacer size="xs" />
                  {book.description ? (
                    <TextView text={book.description} variant="bodySmall" muted numberOfLines={2} />
                  ) : null}
                  <Spacer size="xs" />
                  <TextView
                    text={t('wordPuzzle.stageCount', {count: book.stageCount})}
                    variant="caption"
                    muted
                  />
                </Pressable>
              ))}
            </View>
          </View>
        ))
      )}
      <Spacer size="md" />
      <Card>
        <TextView text={t('wordPuzzle.separateLanguagesNote')} variant="bodySmall" muted />
        <Spacer size="xs" />
        <TextView
          text={
            language === 'ar'
              ? t('wordPuzzle.apiSourceArabic')
              : t('wordPuzzle.apiSourceEnglish')
          }
          variant="caption"
          muted
        />
      </Card>
    </ScreenContainer>
  );
};

export default WordPuzzleLibrary;
