import React from 'react';
import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {ARABIC_BOOKS, ENGLISH_BOOKS} from '@constants/wordPuzzle/wordPuzzleCatalog';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {setActiveBook} from '@redux/slices/wordPuzzleSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';
import type {WordPuzzleBook} from '@Types/wordPuzzleTypes';

type Props = {
  navigation: AppStackNavigationProp<'WordPuzzleLibrary'>;
  route: AppRouteProp<'WordPuzzleLibrary'>;
};

const WordPuzzleLibrary = ({navigation, route}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {language} = route.params;
  const books: WordPuzzleBook[] = language === 'ar' ? ARABIC_BOOKS : ENGLISH_BOOKS;

  const styles = useThemedStyles(tokens => ({
    list: {gap: tokens.spacing.md},
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
  }));

  const openBook = (book: WordPuzzleBook) => {
    dispatch(setActiveBook(book.id));
    navigation.navigate('WordPuzzleStageMap', {bookId: book.id});
  };

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader
        title={language === 'ar' ? t('wordPuzzle.arabicWorld') : t('wordPuzzle.englishWorld')}
        onBack={() => navigation.goBack()}
      />
      <TextView
        text={t('wordPuzzle.libraryHint')}
        variant="body"
        muted
        style={{textAlign: language === 'ar' ? 'right' : 'left'}}
      />
      <Spacer size="md" />
      <View style={styles.list}>
        {books.map(book => (
          <Pressable
            key={book.id}
            style={({pressed}) => [styles.row, pressed && styles.rowPressed]}
            onPress={() => openBook(book)}>
            <View style={styles.badge}>
              <TextView text={`${t('wordPuzzle.bookmark')} ${book.bookmarkNumber}`} variant="caption" />
            </View>
            <Heading text={t(book.titleKey)} level="h3" />
            <Spacer size="xs" />
            <TextView text={t(book.landKey)} variant="bodySmall" muted />
            <Spacer size="xs" />
            <TextView
              text={t('wordPuzzle.stageCount', {count: book.stages.length})}
              variant="caption"
              muted
            />
          </Pressable>
        ))}
      </View>
      <Spacer size="md" />
      <Card>
        <TextView text={t('wordPuzzle.separateLanguagesNote')} variant="bodySmall" muted />
      </Card>
    </ScreenContainer>
  );
};

export default WordPuzzleLibrary;
