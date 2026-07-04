import React from 'react';
import {View} from 'react-native';

import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import TextView from '@atoms/TextView';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {useShowcaseStack} from '../shared/showcaseHelpers';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveThemeShowcaseStyles3} from './styles/resolveThemeShowcaseStyles3';
import {resolveThemeShowcaseStyles2} from './styles/resolveThemeShowcaseStyles2';
import {resolveThemeShowcaseStyles} from './styles/resolveThemeShowcaseStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import {spacing} from '@theme/tokens/spacing';

const ColorSwatches = (): React.JSX.Element => {
  const {colors} = useThemeTokens();
  const stackStyles = useShowcaseStack();
  const styles = useThemedStyles(resolveThemeShowcaseStyles);

  return (
    <View style={stackStyles.row}>
      {(Object.entries(colors) as [string, string][]).map(([name, hex]) => (
        <View key={name} style={styles.swatchItem}>
          <View style={[styles.swatch, {backgroundColor: hex}]} />
          <TextView text={name} variant="caption" align="center" />
        </View>
      ))}
    </View>
  );
};

const SpacingScale = (): React.JSX.Element => {
  const {colors} = useThemeTokens();
  const stackStyles = useShowcaseStack();
  const styles = useThemedStyles(resolveThemeShowcaseStyles2);

  return (
    <View style={stackStyles.stack}>
      {(Object.keys(spacing) as (keyof typeof spacing)[]).map(key => (
        <View key={key} style={styles.row}>
          <TextView text={key} variant="caption" style={styles.label} />
          <View style={[styles.bar, {width: spacing[key], backgroundColor: colors.primary}]} />
          <TextView text={`${spacing[key]}px`} variant="caption" muted />
        </View>
      ))}
    </View>
  );
};

const LayoutSamples = (): React.JSX.Element => {
  const {colors, layout} = useThemeTokens();
  const stackStyles = useShowcaseStack();
  const styles = useThemedStyles(resolveThemeShowcaseStyles3);
  const presets = [
    'row',
    'rowBetween',
    'rowCenter',
    'column',
    'columnCenter',
    'wrapRow',
    'clipOverlayTopLeft',
  ] as const;

  return (
    <View style={stackStyles.stack}>
      <View style={styles.flexRow}>
        <TextView text="flex.fill" variant="caption" />
        <View style={styles.flexBar} />
      </View>
      <View style={styles.flexRow}>
        <TextView text="flexGrow.fill" variant="caption" />
        <View style={styles.growBar} />
      </View>
      <Card elevated={false} style={styles.presetCard}>
        <TextView text="layout.position & layout.overflow" variant="caption" muted />
        <TextView
          text={`position: ${layout.position.absolute} · overflow: ${layout.overflow.hidden}`}
          variant="caption"
        />
        <View style={styles.clipHost}>
          <View style={styles.clipFill} />
          <View
            style={{
              ...layout.presets.absoluteFill,
              backgroundColor: colors.ratingStarEmpty,
              opacity: 0.35,
            }}
          />
        </View>
        <TextView text="clipOverlayTopLeft — used by Rating partial fill" variant="caption" muted />
      </Card>
      {presets.map(name => (
        <Card key={name} elevated={false} style={styles.presetCardInner}>
          <TextView text={`presets.${name}`} variant="caption" muted />
          <View style={{...layout.presets[name], ...styles.presetDemo}}>
            <View style={[styles.presetBox, {backgroundColor: colors.primary}]} />
            <View style={[styles.presetBox, {backgroundColor: colors.accent2}]} />
            <View style={[styles.presetBox, {backgroundColor: colors.warning}]} />
          </View>
        </Card>
      ))}
    </View>
  );
};

const TypographySamples = (): React.JSX.Element => {
  const {typography} = useThemeTokens();
  const stackStyles = useShowcaseStack();
  const keys = ['display', 'h1', 'h2', 'h3', 'body', 'bodySmall', 'caption', 'button'] as const;

  return (
    <View style={stackStyles.stack}>
      {keys.map(key => (
        <TextView
          key={key}
          text={`${key} — The quick brown fox`}
          style={typography[key]}
        />
      ))}
    </View>
  );
};

const ShadowSamples = (): React.JSX.Element => {
  const {shadows, spacing: sp, radius} = useThemeTokens();
  const stackStyles = useShowcaseStack();
  const levels = ['none', 'sm', 'md', 'lg'] as const;

  return (
    <View style={stackStyles.row}>
      {levels.map(level => (
        <Card key={level} elevated={false} style={{...shadows[level], padding: sp.md, borderRadius: radius.md}}>
          <Heading text={level} level="h3" />
        </Card>
      ))}
    </View>
  );
};

export default createShowcaseScreen({
  title: 'Theme',
  subtitle: 'Design tokens from useThemeTokens().',
  sections: [
    {title: 'Colors', content: <ColorSwatches />},
    {title: 'Spacing', content: <SpacingScale />},
    {title: 'Layout', content: <LayoutSamples />},
    {title: 'Typography', content: <TypographySamples />},
    {title: 'Shadows', content: <ShadowSamples />},
  ],
});
