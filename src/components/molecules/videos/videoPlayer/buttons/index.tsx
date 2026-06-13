//* packages import
import React from 'react';
import {StyleSheet, View} from 'react-native';

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
  const styles = useThemedStyles(tokens =>
    StyleSheet.create({
      container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: tokens.spacing.sm,
        paddingHorizontal: tokens.spacing.md,
        paddingVertical: tokens.spacing.md,
        backgroundColor: tokens.colors.overlay,
      },
      action: {
        flex: 1,
      },
    }),
  );

  return (
    <View style={styles.container}>
      <Button
        label="Dismiss"
        variant="ghost"
        size="sm"
        flat
        style={styles.action}
        onPress={onDismiss}
      />
      <Button
        label="Retake"
        variant="outline"
        size="sm"
        style={styles.action}
        onPress={onRetakeVideo}
      />
      <Button
        label={uploading ? 'Uploading…' : 'Upload'}
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
