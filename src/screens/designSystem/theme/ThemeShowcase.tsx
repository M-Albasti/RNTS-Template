import React from 'react';
import {View} from 'react-native';

import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import TextView from '@atoms/TextView';

import {createShowcaseScreen} from '../shared/createShowcaseScreen';
import {useShowcaseStack} from '../shared/showcaseHelpers';
import {layout} from '@theme/tokens';
import {spacing} from '@theme/tokens/spacing';
import {useThemeTokens} from '@theme/useThemeTokens';

const ColorSwatches = (): React.JSX.Element => {
  const {colors} = useThemeTokens();
  const styles = useShowcaseStack();

  return (
    <View style={styles.row}>
      {(Object.entries(colors) as [string, string][]).map(([name, hex]) => (
        <View key={name} style={{alignItems: 'center', gap: 4, width: 72}}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 8,
              backgroundColor: hex,
              borderWidth: 1,
              borderColor: '#E2E8F0',
            }}
          />
          <TextView text={name} variant="caption" align="center" />
        </View>
      ))}
    </View>
  );
};

const SpacingScale = (): React.JSX.Element => {
  const styles = useShowcaseStack();

  return (
    <View style={styles.stack}>
      {(Object.keys(spacing) as (keyof typeof spacing)[]).map(key => (
        <View
          key={key}
          style={{
            flexDirection: layout.flexDirection.row,
            alignItems: 'center',
            gap: 8,
          }}>
          <TextView text={key} variant="caption" style={{width: 48}} />
          <View style={{height: 12, width: spacing[key], backgroundColor: '#38BDF8'}} />
          <TextView text={`${spacing[key]}px`} variant="caption" muted />
        </View>
      ))}
    </View>
  );
};

const LayoutSamples = (): React.JSX.Element => {
  const {colors, spacing: sp} = useThemeTokens();
  const styles = useShowcaseStack();
  const presets = [
    'row',
    'rowBetween',
    'rowCenter',
    'column',
    'columnCenter',
    'wrapRow',
  ] as const;

  return (
    <View style={styles.stack}>
      <View style={{...layout.presets.row, gap: sp.sm}}>
        <TextView text="flex.fill" variant="caption" />
        <View
          style={{
            flex: layout.flex.fill,
            height: 24,
            backgroundColor: colors.primaryMuted,
            borderRadius: 4,
          }}
        />
      </View>
      <View style={{...layout.presets.row, gap: sp.sm}}>
        <TextView text="flexGrow.fill" variant="caption" />
        <View
          style={{
            ...layout.presets.grow,
            height: 24,
            backgroundColor: colors.primaryMuted,
            borderRadius: 4,
          }}
        />
      </View>
      {presets.map(name => (
        <Card key={name} elevated={false} style={{padding: sp.sm}}>
          <TextView text={`presets.${name}`} variant="caption" muted />
          <View
            style={{
              ...layout.presets[name],
              gap: sp.xs,
              marginTop: sp.xs,
            }}>
            <View style={{width: 24, height: 24, backgroundColor: colors.primary, borderRadius: 4}} />
            <View style={{width: 24, height: 24, backgroundColor: colors.accent2, borderRadius: 4}} />
            <View style={{width: 24, height: 24, backgroundColor: colors.warning, borderRadius: 4}} />
          </View>
        </Card>
      ))}
    </View>
  );
};

const TypographySamples = (): React.JSX.Element => {
  const {typography} = useThemeTokens();
  const styles = useShowcaseStack();
  const keys = ['display', 'h1', 'h2', 'h3', 'body', 'bodySmall', 'caption', 'button'] as const;

  return (
    <View style={styles.stack}>
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
  const styles = useShowcaseStack();
  const levels = ['none', 'sm', 'md', 'lg'] as const;

  return (
    <View style={styles.row}>
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
