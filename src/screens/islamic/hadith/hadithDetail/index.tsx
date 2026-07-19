import React, {useEffect} from 'react';
import {Pressable, ScrollView, Share, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Heading from '@atoms/Heading';
import IconView from '@atoms/Icon';
import ScreenContainer from '@atoms/ScreenContainer';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';
import TouchableIcon from '@atoms/TouchableIcon';

import {useHadithDetailQuery} from '@api/query/hooks/useIslamicQueries';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {setLastHadith, toggleBookmarkHadith} from '@redux/slices/islamicSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import type {AppRouteProp, AppStackNavigationProp} from '@Types/appNavigation';

import {IslamicErrorState, IslamicLoadingState} from '@screens/islamic/islamicHub';

type Props = {
  navigation: AppStackNavigationProp<'HadithDetail'>;
  route: AppRouteProp<'HadithDetail'>;
};

/**
 * Immersive teal hadith reader — dark reading surface, chrome meta bar, action dock.
 */
const HadithDetail = ({navigation, route}: Props): React.JSX.Element => {
  const {t, i18n} = useTranslation();
  const dispatch = useAppDispatch();
  const {sizes, colors} = useThemeTokens();
  const language = i18n.language.startsWith('ar') ? 'ar' : 'en';
  const {hadithId, title} = route.params;
  const {data, isLoading, isError} = useHadithDetailQuery(hadithId, language);
  const bookmarked = useAppSelector(state =>
    (state.islamic.bookmarkedHadiths ?? []).includes(hadithId),
  );

  const styles = useThemedStyles(tokens => ({
    root: {
      flex: tokens.layout.flex.fill,
      backgroundColor: tokens.colors.hadithReaderBg,
    },
    header: {
      backgroundColor: tokens.colors.hadithChrome,
      paddingHorizontal: tokens.spacing.md,
      paddingTop: tokens.spacing.sm,
      paddingBottom: tokens.spacing.md,
    },
    headerRow: {
      ...tokens.layout.presets.rowBetween,
      alignItems: 'center' as const,
    },
    headerTitle: {
      flex: tokens.layout.flex.fill,
      color: tokens.colors.hadithOnChrome,
      textAlign: 'center' as const,
    },
    meta: {
      backgroundColor: tokens.colors.hadithChromeMuted,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.sm,
      alignItems: 'center' as const,
    },
    metaText: {
      color: tokens.colors.hadithOnChrome,
      textAlign: 'center' as const,
    },
    body: {
      flex: tokens.layout.flex.fill,
      padding: tokens.spacing.lg,
    },
    arabic: {
      color: tokens.colors.hadithReaderInk,
      fontSize: tokens.typography.h2.fontSize,
      lineHeight: (tokens.typography.h2.lineHeight ?? 32) * 1.45,
      textAlign: 'right' as const,
      writingDirection: 'rtl' as const,
    },
    english: {
      color: tokens.colors.hadithReaderInk,
      opacity: 0.88,
      lineHeight: (tokens.typography.body.lineHeight ?? 22) * 1.35,
    },
    sectionLabel: {
      color: tokens.colors.hadithAccent,
      marginBottom: tokens.spacing.xs,
    },
    tafsirBox: {
      marginTop: tokens.spacing.md,
      padding: tokens.spacing.md,
      borderRadius: tokens.radius.lg,
      backgroundColor: tokens.colors.hadithChromeMuted,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.hadithChrome,
    },
    tafsirText: {color: tokens.colors.hadithOnChrome},
    gradeBox: {
      marginTop: tokens.spacing.sm,
      padding: tokens.spacing.sm,
      borderRadius: tokens.radius.md,
      backgroundColor: tokens.colors.hadithChrome,
    },
    refBar: {
      backgroundColor: tokens.colors.hadithChrome,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.md,
      ...tokens.layout.presets.rowBetween,
      gap: tokens.spacing.md,
      alignItems: 'flex-start' as const,
    },
    refCol: {flex: tokens.layout.flex.fill, gap: tokens.spacing.xxs},
    refText: {color: tokens.colors.hadithOnChrome},
    refEnd: {alignItems: 'flex-end' as const, gap: tokens.spacing.xxs},
    dock: {
      backgroundColor: tokens.colors.hadithChromeMuted,
      borderTopWidth: tokens.layout.borderWidth.sm,
      borderTopColor: tokens.colors.hadithChrome,
      paddingVertical: tokens.spacing.sm,
      paddingHorizontal: tokens.spacing.lg,
      ...tokens.layout.presets.rowBetween,
      alignItems: 'center' as const,
    },
    dockBtn: {alignItems: 'center' as const, gap: tokens.spacing.xxs, minWidth: 72},
    dockLabel: {color: tokens.colors.hadithOnChrome},
  }));

  useEffect(() => {
    if (!data) {
      return;
    }
    dispatch(
      setLastHadith({
        hadithId: data.id,
        editionSlug: data.editionSlug,
        editionName: data.editionName || title,
        hadithIndex: data.hadithIndex,
      }),
    );
  }, [data, dispatch, title]);

  const shareHadith = async () => {
    if (!data) {
      return;
    }
    const parts = [
      `${data.editionName}${data.bookName ? ` · ${data.bookName}` : ''}`,
      `#${data.hadithIndex}`,
      data.arabicText,
      data.englishText,
      data.tafsir ? `${t('islamic.hadith.tafsir')}: ${data.tafsir}` : '',
    ].filter(Boolean);
    try {
      await Share.share({message: parts.join('\n\n')});
    } catch {
      // user dismissed share sheet
    }
  };

  const gradeLabel =
    data?.grades?.[0]?.grade ||
    (data?.editionSlug?.includes('sahih') ? t('islamic.hadith.gradedSahih') : '');

  return (
    <ScreenContainer safe bottomPadding="none" style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableIcon
            iconType="Ionicons"
            name="chevron-back"
            size={sizes.iconSm}
            color={colors.hadithOnChrome}
            onPress={() => navigation.goBack()}
          />
          <TextView
            text={data?.bookName || title}
            variant="bodySmall"
            style={styles.headerTitle}
            numberOfLines={1}
          />
          <TouchableIcon
            iconType="Ionicons"
            name={bookmarked ? 'star' : 'star-outline'}
            size={sizes.iconSm}
            color={colors.hadithOnChrome}
            onPress={() => dispatch(toggleBookmarkHadith(hadithId))}
          />
        </View>
      </View>

      {isLoading ? (
        <IslamicLoadingState />
      ) : isError || !data ? (
        <IslamicErrorState message={t('islamic.errors.loadFailed')} />
      ) : (
        <>
          <View style={styles.meta}>
            <TextView
              text={data.bookName || data.editionName}
              variant="caption"
              style={styles.metaText}
            />
            <TextView
              text={t('islamic.hadith.hadithOf', {
                current: data.bookHadithIndex || data.hadithIndex,
                total: data.hadithIndex,
              })}
              variant="bodySmall"
              style={styles.metaText}
            />
          </View>

          <ScrollView style={styles.body} contentContainerStyle={{flexGrow: 1}}>
            {data.arabicText ? (
              <>
                <TextView
                  text={t('islamic.hadith.arabic')}
                  variant="caption"
                  style={styles.sectionLabel}
                />
                <TextView text={data.arabicText} style={styles.arabic} />
                <Spacer size="lg" />
              </>
            ) : null}
            {data.englishText ? (
              <>
                <TextView
                  text={t('islamic.hadith.english')}
                  variant="caption"
                  style={styles.sectionLabel}
                />
                <TextView text={data.englishText} style={styles.english} />
                <Spacer size="lg" />
              </>
            ) : null}
            {!data.arabicText && !data.englishText && data.text ? (
              <TextView text={data.text} style={styles.english} />
            ) : null}
            {data.tafsir ? (
              <View style={styles.tafsirBox}>
                <TextView
                  text={t('islamic.hadith.tafsir')}
                  variant="caption"
                  style={styles.sectionLabel}
                />
                <TextView text={data.tafsir} variant="bodySmall" style={styles.tafsirText} />
              </View>
            ) : null}
            {data.grades.length > 0 ? (
              <View style={styles.gradeBox}>
                <TextView
                  text={t('islamic.hadith.grades')}
                  variant="caption"
                  style={styles.sectionLabel}
                />
                {data.grades.map(grade => (
                  <TextView
                    key={`${grade.name}-${grade.grade}`}
                    text={`${grade.name}: ${grade.grade}`}
                    variant="caption"
                    style={styles.tafsirText}
                  />
                ))}
              </View>
            ) : null}
            <Spacer size="xl" />
          </ScrollView>

          <View style={styles.refBar}>
            <View style={styles.refCol}>
              <Heading text={data.editionName} level="h3" style={styles.refText} />
              <TextView
                text={t('islamic.hadith.inBookReference')}
                variant="caption"
                style={styles.refText}
              />
              {gradeLabel ? (
                <TextView
                  text={t('islamic.hadith.gradedLabel', {grade: gradeLabel})}
                  variant="caption"
                  style={styles.refText}
                />
              ) : null}
            </View>
            <View style={styles.refEnd}>
              <TextView
                text={String(data.hadithIndex)}
                variant="bodySmall"
                style={styles.refText}
              />
              {data.bookIndex != null ? (
                <TextView
                  text={t('islamic.hadith.bookHadithRef', {
                    book: data.bookIndex + 1,
                    n: data.bookHadithIndex || data.hadithIndex,
                  })}
                  variant="caption"
                  style={styles.refText}
                />
              ) : null}
            </View>
          </View>

          <View style={styles.dock}>
            <Pressable style={styles.dockBtn} onPress={() => void shareHadith()}>
              <IconView
                iconType="Ionicons"
                name="share-social-outline"
                size={sizes.iconMd}
                color={colors.hadithOnChrome}
              />
              <TextView
                text={t('islamic.hadith.share')}
                variant="caption"
                style={styles.dockLabel}
              />
            </Pressable>
            <Pressable
              style={styles.dockBtn}
              onPress={() => dispatch(toggleBookmarkHadith(hadithId))}>
              <IconView
                iconType="Ionicons"
                name={bookmarked ? 'heart' : 'heart-outline'}
                size={sizes.iconMd}
                color={colors.hadithOnChrome}
              />
              <TextView
                text={t('islamic.hadith.favorite')}
                variant="caption"
                style={styles.dockLabel}
              />
            </Pressable>
          </View>
        </>
      )}
    </ScreenContainer>
  );
};

export default HadithDetail;
