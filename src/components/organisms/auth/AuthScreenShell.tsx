import React from 'react';
import {View} from 'react-native';

import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import TextView from '@atoms/TextView';

import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveAuthScreenShellStyles} from './styles/resolveAuthScreenShellStyles';

type AuthScreenShellProps = {
  title: string;
  subtitle?: string;
  /** Kept for call-site compat; Focusify layout does not show a brand tile. */
  iconName?: string;
  iconType?: 'Ionicons' | 'MaterialCommunityIcons' | 'Feather';
  children: React.ReactNode;
  footer?: React.ReactNode;
};

/**
 * Focusify auth chrome: large greeting + subtitle, then form content.
 */
const AuthScreenShell = ({
  title,
  subtitle,
  children,
  footer,
}: AuthScreenShellProps): React.JSX.Element => {
  const styles = useThemedStyles(resolveAuthScreenShellStyles);

  return (
    <ScreenContainer
      scroll
      bottomPadding="none"
      style={styles.root}
      scrollProps={{keyboardShouldPersistTaps: 'handled'}}>
      <View style={styles.header}>
        <Heading text={title} level="display" style={styles.title} />
        {subtitle ? (
          <TextView text={subtitle} variant="body" style={styles.subtitle} />
        ) : null}
      </View>

      <View style={styles.body}>
        <View style={styles.form}>{children}</View>
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </View>
    </ScreenContainer>
  );
};

export default AuthScreenShell;
