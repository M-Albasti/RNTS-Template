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
import {resolveSettingsStyles} from './styles/resolveSettingsStyles';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';
import {ThemeMode} from '@Types/themeMode';

interface SettingsProps {
  navigation: AppStackNavigationProp<'Settings'>;
}

const THEME_OPTIONS: {mode: ThemeMode; labelKey: string}[] = [
  {mode: 'light', labelKey: 'settings.light'},
  {mode: 'dark', labelKey: 'settings.dark'},
  {mode: 'system', labelKey: 'settings.system'},
];

const Settings = (_props: SettingsProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector(state => state.appSettings.lang);
  const themeMode = useAppSelector(state => state.appSettings.themeMode);
  const activeScheme = useAppColorScheme();
  const {t} = useTranslation();
  const styles = useThemedStyles(resolveSettingsStyles);

  const appearanceHint =
    themeMode === 'system'
      ? t('settings.appearanceSystem', {scheme: activeScheme})
      : t('settings.appearanceFixed', {mode: themeMode});

  return (
    <ScreenContainer scroll>
      <Heading text={t('settings.title')} level="h1" />
      <Spacer size="lg" />

      <Card>
        <Heading text={t('settings.appearance')} level="h3" />
        <Spacer size="sm" />
        <TextView text={appearanceHint} variant="bodySmall" muted />
        <Spacer size="md" />
        <View style={styles.modeRow}>
          {THEME_OPTIONS.map(option => (
            <Button
              key={option.mode}
              label={t(option.labelKey)}
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
          <TextView text={t('settings.language')} variant="body" />
          <TextView
            text={lang === 'ar' ? t('common.arabic') : t('common.english')}
            variant="bodySmall"
            muted
          />
        </View>
        <Spacer size="md" />
        <Divider spacing="sm" />
        <Spacer size="md" />
        <Button
          label={t('settings.switchLanguage')}
          variant="secondary"
          fullWidth
          onPress={() => changeLanguage(dispatch)}
        />
      </Card>
    </ScreenContainer>
  );
};

export default Settings;
