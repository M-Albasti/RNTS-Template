//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useTranslation} from 'react-i18next';

//* components import
import Button from '@atoms/Button';

//* theme import
import {useThemedStyles} from '@theme/createThemedStyles';

interface ButtonsProps {
  onDismiss: () => void;
  onRetakeVideo: () => void;
  onUpload: () => void;
  uploading?: boolean;
}

const Buttons = ({
  onDismiss,
  onRetakeVideo,
  onUpload,
  uploading = false,
}: ButtonsProps): React.JSX.Element => {
  const {t} = useTranslation();
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      container: {
        flexDirection: tokens.layout.flexDirection.row,
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: tokens.spacing.sm,
        paddingHorizontal: tokens.spacing.md,
        paddingVertical: tokens.spacing.md,
        backgroundColor: tokens.colors.overlay,
      },
      action: {
        flex: tokens.layout.flex.fill,
      },
    }),
  );

  return (
    <View style={styles.container}>
      <Button
        label={t('common.dismiss')}
        variant="ghost"
        size="sm"
        flat
        style={styles.action}
        onPress={onDismiss}
      />
      <Button
        label={t('common.retake')}
        variant="outline"
        size="sm"
        style={styles.action}
        onPress={onRetakeVideo}
      />
      <Button
        label={uploading ? t('common.uploading') : t('common.upload')}
        size="sm"
        flat
        style={styles.action}
        loading={uploading}
        disabled={uploading}
        onPress={onUpload}
      />
    </View>
  );
};

export default Buttons;
