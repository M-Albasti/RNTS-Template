import React, {memo, useMemo} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Svg, {Circle, Path} from 'react-native-svg';

import {
  buildMushafPageSegments,
  getPageSurahNames,
  QURAN_BASMALA,
  toArabicIndicDigits,
  type MushafPageAyah,
} from '@helpers/mushafPageHelpers';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';

import {resolveMushafPageSheetStyles} from './styles/resolveMushafPageSheetStyles';

type Props = {
  pageNumber: number;
  ayahs: MushafPageAyah[];
  /** Surah currently being recited (for highlight matching). */
  audioSurahNumber: number;
  activeAyahNumber: number;
  showAyahHighlight: boolean;
  /** Tap an ayah to seek / jump the continuous reciter to that verse. */
  onAyahPress?: (ayah: MushafPageAyah) => void;
};

/** Small corner flourish for the ornamental mushaf frame. */
const CornerOrnament = ({
  color,
  size,
  rotate = 0,
}: {
  color: string;
  size: number;
  rotate?: number;
}): React.JSX.Element => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{transform: [{rotate: `${rotate}deg`}]}}>
    <Path
      d="M3 3h8c0 4.5-3.5 8-8 8V3zm0 0c5 1 9 5 10 10"
      stroke={color}
      strokeWidth={1.6}
      fill="none"
      strokeLinecap="round"
    />
    <Circle cx={7} cy={7} r={1.4} fill={color} />
  </Svg>
);

/**
 * Madinah-inspired mushaf page: ornate frame, surah banners, basmala,
 * and a soft blue highlight on the ayah currently being recited.
 * Memoized so ayah-clock ticks do not rebuild the whole page tree unless
 * the active ayah / page content actually changed.
 */
const MushafPageSheet = memo(({
  pageNumber,
  ayahs,
  audioSurahNumber,
  activeAyahNumber,
  showAyahHighlight,
  onAyahPress,
}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const {colors, spacing} = useThemeTokens();
  const styles = useThemedStyles(resolveMushafPageSheetStyles);

  const segments = useMemo(() => buildMushafPageSegments(ayahs), [ayahs]);
  const surahNames = useMemo(() => getPageSurahNames(ayahs), [ayahs]);
  const juzNumber = ayahs[0]?.juz ?? 1;
  const cornerSize = spacing.lg;
  const activeKey =
    showAyahHighlight && activeAyahNumber > 0
      ? `${audioSurahNumber}:${activeAyahNumber}`
      : '';

  return (
    <View style={styles.outerFrame}>
      <View style={styles.midFrame}>
        <View style={styles.innerFrame}>
          <View style={[styles.corner, styles.cornerTopStart]} pointerEvents="none">
            <CornerOrnament color={colors.mushafOrnament} size={cornerSize} />
          </View>
          <View style={[styles.corner, styles.cornerTopEnd]} pointerEvents="none">
            <CornerOrnament color={colors.mushafOrnament} size={cornerSize} rotate={90} />
          </View>
          <View style={[styles.corner, styles.cornerBottomStart]} pointerEvents="none">
            <CornerOrnament color={colors.mushafOrnament} size={cornerSize} rotate={270} />
          </View>
          <View style={[styles.corner, styles.cornerBottomEnd]} pointerEvents="none">
            <CornerOrnament color={colors.mushafOrnament} size={cornerSize} rotate={180} />
          </View>

          <View style={styles.header}>
            <Text style={styles.headerText} numberOfLines={2}>
              {surahNames}
            </Text>
            <Text style={styles.headerJuz}>{t('islamic.quran.juz', {n: juzNumber})}</Text>
          </View>

          <ScrollView contentContainerStyle={styles.body}>
            {segments.map(segment => (
              <View key={segment.surahNumber} style={styles.segment}>
                {segment.showSurahBanner ? (
                  <View style={styles.surahBanner}>
                    <Text style={styles.surahBannerText}>{segment.surahName}</Text>
                  </View>
                ) : null}
                {segment.showBasmala ? (
                  <Text style={styles.basmala}>{QURAN_BASMALA}</Text>
                ) : null}
                <Text style={styles.ayahFlow}>
                  {segment.ayahs.map((ayah, index) => {
                    const ayahKey = `${ayah.surahNumber}:${ayah.numberInSurah}`;
                    const isActive = activeKey === ayahKey;
                    return (
                      <Text
                        key={ayahKey}
                        style={isActive ? styles.ayahActive : undefined}
                        onPress={
                          onAyahPress
                            ? () => onAyahPress(ayah)
                            : undefined
                        }
                        suppressHighlighting>
                        {ayah.displayText}{' '}
                        <Text style={styles.ayahMarker}>
                          ﴿{toArabicIndicDigits(ayah.numberInSurah)}﴾
                        </Text>
                        {index < segment.ayahs.length - 1 ? ' ' : ''}
                      </Text>
                    );
                  })}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.pageBadge}>
              <Text style={styles.pageBadgeText}>{toArabicIndicDigits(pageNumber)}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});

MushafPageSheet.displayName = 'MushafPageSheet';

export default MushafPageSheet;
