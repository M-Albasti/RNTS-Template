import React, {useMemo, useRef, useState} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import IconView from '@atoms/Icon';
import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import type {AppStackNavigationProp} from '@Types/appNavigation';

interface OnBoardingProps {
  navigation: AppStackNavigationProp<'OnBoarding'>;
}

const SLIDE_ICONS = ['planet-outline', 'flash-outline', 'rocket-outline'] as const;

/**
 * Modern onboarding: soft orb illustration, Arabic-safe titles, pill CTA.
 * Extra lineHeight + paddingTop prevents Cairo top-clip on Android.
 */
const OnBoarding = ({navigation}: OnBoardingProps): React.JSX.Element => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const {colors, sizes} = useThemeTokens();
  const {width, height} = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const listRef = useRef<ScrollView>(null);

  const slides = useMemo(
    () => [
      {
        title: t('onboarding.slide1Title'),
        subtitle: t('onboarding.slide1Subtitle'),
        icon: SLIDE_ICONS[0],
        accent: colors.primary,
      },
      {
        title: t('onboarding.slide2Title'),
        subtitle: t('onboarding.slide2Subtitle'),
        icon: SLIDE_ICONS[1],
        accent: colors.accent2,
      },
      {
        title: t('onboarding.slide3Title'),
        subtitle: t('onboarding.slide3Subtitle'),
        icon: SLIDE_ICONS[2],
        accent: colors.success,
      },
    ],
    [colors.accent2, colors.primary, colors.success, t],
  );

  const styles = useThemedStyles(tokens => ({
    root: {
      flex: tokens.layout.flex.fill,
      backgroundColor: tokens.colors.background,
      paddingTop: insets.top,
      paddingBottom: Math.max(insets.bottom, tokens.spacing.lg),
    },
    skip: {
      alignSelf: 'flex-end' as const,
      paddingHorizontal: tokens.spacing.lg,
      paddingVertical: tokens.spacing.md,
    },
    page: {
      width,
      minHeight: Math.max(height * 0.55, 420),
      paddingHorizontal: tokens.spacing.xl,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      gap: tokens.spacing.lg,
    },
    orbOuter: {
      width: 220,
      height: 220,
      borderRadius: 110,
      ...tokens.layout.presets.center,
      marginBottom: tokens.spacing.md,
    },
    orbMid: {
      width: 168,
      height: 168,
      borderRadius: 84,
      ...tokens.layout.presets.center,
    },
    orbInner: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: tokens.colors.surface,
      ...tokens.layout.presets.center,
      ...tokens.shadows.sm,
    },
    title: {
      fontSize: 30,
      lineHeight: 52,
      fontFamily: tokens.typography.h1.fontFamily,
      fontWeight: Platform.OS === 'ios' ? ('700' as const) : ('normal' as const),
      color: tokens.colors.textPrimary,
      textAlign: 'center' as const,
      paddingTop: 16,
      paddingBottom: 4,
      paddingHorizontal: tokens.spacing.sm,
      includeFontPadding: false,
    },
    subtitle: {
      fontSize: 16,
      lineHeight: 28,
      fontFamily: tokens.typography.body.fontFamily,
      color: tokens.colors.textMuted,
      textAlign: 'center' as const,
      paddingHorizontal: tokens.spacing.md,
      paddingTop: 6,
      includeFontPadding: false,
    },
    footer: {
      paddingHorizontal: tokens.spacing.lg,
      gap: tokens.spacing.lg,
      paddingTop: tokens.spacing.md,
    },
    dots: {
      ...tokens.layout.presets.row,
      justifyContent: 'center' as const,
      gap: tokens.spacing.xs,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: tokens.radius.full,
      backgroundColor: tokens.colors.border,
    },
    dotActive: {
      width: 28,
      backgroundColor: tokens.colors.primary,
    },
  }));

  const goNext = () => {
    if (index >= slides.length - 1) {
      navigation.replace('LoginOptions');
      return;
    }
    const next = index + 1;
    listRef.current?.scrollTo({x: next * width, animated: true});
    setIndex(next);
  };

  const onMomentumEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(event.nativeEvent.contentOffset.x / width);
    setIndex(Math.min(Math.max(next, 0), slides.length - 1));
  };

  return (
    <View style={styles.root}>
      <Pressable style={styles.skip} onPress={() => navigation.replace('LoginOptions')}>
        <TextView text={t('onboarding.skip')} variant="bodySmall" muted />
      </Pressable>

      <ScrollView
        ref={listRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumEnd}
        bounces={false}
        style={{flex: 1}}>
        {slides.map(slide => (
          <View key={slide.title} style={styles.page}>
            <View style={[styles.orbOuter, {backgroundColor: `${slide.accent}18`}]}>
              <View style={[styles.orbMid, {backgroundColor: `${slide.accent}28`}]}>
                <View style={styles.orbInner}>
                  <IconView
                    iconType="Ionicons"
                    name={slide.icon}
                    size={sizes.iconLg}
                    color={slide.accent}
                  />
                </View>
              </View>
            </View>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.subtitle}>{slide.subtitle}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((slide, dotIndex) => (
            <View
              key={slide.title}
              style={[styles.dot, dotIndex === index && styles.dotActive]}
            />
          ))}
        </View>
        <Button
          label={
            index === slides.length - 1
              ? t('onboarding.getStarted')
              : t('onboarding.next')
          }
          fullWidth
          size="lg"
          onPress={goNext}
        />
      </View>
    </View>
  );
};

export default OnBoarding;
