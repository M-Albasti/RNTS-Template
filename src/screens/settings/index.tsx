//* packages import
import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

//* components import
import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Divider from '@atoms/Divider';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

//* hooks import
import {useAppColorScheme} from '@hooks/useAppColorScheme';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';

//* redux import
import {setThemeMode} from '@redux/slices/appSettingsSlice';

//* translation import
import {changeLanguage} from '@translation/i18n';

//* theme import
import {useThemedStyles} from '@theme/createThemedStyles';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';
import {ThemeMode} from '@Types/themeMode';

interface SettingsProps {
  navigation: AppStackNavigationProp<'Settings'>;
}

const THEME_OPTIONS: {mode: ThemeMode; label: string}[] = [
  {mode: 'light', label: 'Light'},
  {mode: 'dark', label: 'Dark'},
  {mode: 'system', label: 'System'},
];

const Settings = (_props: SettingsProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector(state => state.appSettings.lang);
  const themeMode = useAppSelector(state => state.appSettings.themeMode);
  const activeScheme = useAppColorScheme();
  const {t} = useTranslation();
  const styles = useThemedStyles(tokens => ({
    row: {
      ...tokens.layout.presets.rowBetween,
    },
    modeRow: {
      ...tokens.layout.presets.wrapRow,
      gap: tokens.spacing.sm,
    },
    modeButton: {
      flex: tokens.layout.flex.fill,
      minWidth: '30%' as const,
    },
  }));

  const appearanceHint =
    themeMode === 'system'
      ? `Using your device setting (${activeScheme}).`
      : `Using ${themeMode} mode.`;

  return (
    <ScreenContainer scroll>
      <Heading text="Settings" level="h1" />
      <Spacer size="lg" />

      <Card>
        <Heading text="Appearance" level="h3" />
        <Spacer size="sm" />
        <TextView text={appearanceHint} variant="bodySmall" muted />
        <Spacer size="md" />
        <View style={styles.modeRow}>
          {THEME_OPTIONS.map(option => (
            <Button
              key={option.mode}
              label={option.label}
              variant={themeMode === option.mode ? 'primary' : 'outline'}
              flat={themeMode !== option.mode}
              style={styles.modeButton}
              onPress={() => dispatch(setThemeMode(option.mode))}
            />
          ))}
        </View>
      </Card>

      <Spacer size="lg" />

      <Card>
        <View style={styles.row}>
          <TextView text="Language" variant="body" />
          <TextView
            text={lang === 'ar' ? 'العربية' : 'English'}
            variant="bodySmall"
            muted
          />
        </View>
        <Spacer size="md" />
        <Divider spacing="sm" />
        <Spacer size="md" />
        <Button
          label={t('change language', {defaultValue: 'Switch language'})}
          variant="secondary"
          fullWidth
          onPress={() => changeLanguage(dispatch)}
        />
      </Card>
    </ScreenContainer>
  );
};

export default Settings;
