import React from 'react';
import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Heading from '@atoms/Heading';
import IconView from '@atoms/Icon';
import TextView from '@atoms/TextView';

import type {IslamicSearchSuggestion} from '@helpers/islamicSearchHelpers';
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';

import {resolveIslamicSearchSuggestionsStyles} from './styles/resolveIslamicSearchSuggestionsStyles';

type Props = {
  recent: IslamicSearchSuggestion[];
  suggestions: IslamicSearchSuggestion[];
  onSelect: (suggestion: IslamicSearchSuggestion) => void;
  onClearHistory?: () => void;
  onRemoveRecent?: (query: string) => void;
};

const kindIcon = (kind: IslamicSearchSuggestion['kind']): string => {
  switch (kind) {
    case 'recent':
      return 'time-outline';
    case 'surah':
      return 'book-outline';
    case 'adhkar':
      return 'heart-outline';
    case 'hadith':
      return 'library-outline';
    default:
      return 'search-outline';
  }
};

const IslamicSearchSuggestions = ({
  recent,
  suggestions,
  onSelect,
  onClearHistory,
  onRemoveRecent,
}: Props): React.JSX.Element | null => {
  const {t} = useTranslation();
  const {colors} = useThemeTokens();
  const styles = useThemedStyles(resolveIslamicSearchSuggestionsStyles);

  if (recent.length === 0 && suggestions.length === 0) {
    return null;
  }

  return (
    <View>
      {recent.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Heading text={t('islamic.search.recentSearches')} level="h3" />
            {onClearHistory ? (
              <Pressable style={styles.clearBtn} onPress={onClearHistory} hitSlop={8}>
                <TextView text={t('islamic.search.clearHistory')} variant="caption" muted />
              </Pressable>
            ) : null}
          </View>
          <View style={styles.chipWrap}>
            {recent.map(item => (
              <Pressable
                key={item.id}
                style={({pressed}) => [
                  styles.chip,
                  styles.chipRecent,
                  pressed && styles.chipPressed,
                ]}
                onPress={() => onSelect(item)}>
                <IconView
                  iconType="Ionicons"
                  name={kindIcon(item.kind)}
                  size={16}
                  color={colors.primary}
                />
                <TextView text={item.label} variant="caption" numberOfLines={1} />
                {onRemoveRecent ? (
                  <Pressable
                    style={styles.removeBtn}
                    hitSlop={8}
                    onPress={() => onRemoveRecent(item.query)}>
                    <IconView
                      iconType="Ionicons"
                      name="close"
                      size={12}
                      color={colors.textMuted}
                    />
                  </Pressable>
                ) : null}
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      {suggestions.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Heading text={t('islamic.search.suggestions')} level="h3" />
          </View>
          <View style={styles.chipWrap}>
            {suggestions.map(item => (
              <Pressable
                key={item.id}
                style={({pressed}) => [styles.chip, pressed && styles.chipPressed]}
                onPress={() => onSelect(item)}>
                <IconView
                  iconType="Ionicons"
                  name={kindIcon(item.kind)}
                  size={16}
                  color={colors.primary}
                />
                <TextView text={item.label} variant="caption" numberOfLines={1} />
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
};

export default IslamicSearchSuggestions;
