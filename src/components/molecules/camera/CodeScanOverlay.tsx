import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';

type CodeScanOverlayProps = {
  title: string;
  value: string;
  typeLabel: string;
  onCopy: () => void;
  onDismiss: () => void;
  onScanAgain: () => void;
};

const CodeScanOverlay = ({
  title,
  value,
  typeLabel,
  onCopy,
  onDismiss,
  onScanAgain,
}: CodeScanOverlayProps): React.JSX.Element => {
  const {t} = useTranslation();
  const styles = useThemedStyles(tokens => ({
    backdrop: {
      ...tokens.layout.presets.absoluteFill,
      ...tokens.layout.presets.center,
      backgroundColor: tokens.colors.overlay,
      padding: tokens.spacing.lg,
    },
    card: {
      width: '100%' as const,
      gap: tokens.spacing.sm,
    },
    actions: {
      ...tokens.layout.presets.row,
      gap: tokens.spacing.sm,
      marginTop: tokens.spacing.sm,
    },
    action: {flex: tokens.layout.flex.fill},
  }));

  return (
    <View style={styles.backdrop}>
      <Card style={styles.card}>
        <TextView text={title} variant="h3" />
        <TextView text={typeLabel} variant="caption" muted />
        <TextView text={value} variant="body" />
        <View style={styles.actions}>
          <Button
            label={t('camera.copy')}
            variant="secondary"
            style={styles.action}
            onPress={onCopy}
          />
          <Button
            label={t('camera.scanAgain')}
            variant="ghost"
            style={styles.action}
            onPress={onScanAgain}
          />
        </View>
        <Button label={t('common.dismiss')} variant="primary" fullWidth onPress={onDismiss} />
      </Card>
    </View>
  );
};

export default CodeScanOverlay;
