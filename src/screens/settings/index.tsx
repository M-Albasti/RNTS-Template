//* packages import
import React, {useEffect, useMemo, useState} from 'react';
import {Alert, Pressable, Switch, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {isEmpty} from 'lodash';

//* components import
import BottomSheet from '@atoms/BottomSheet';
import Button from '@atoms/Button';
import IconView from '@atoms/Icon';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

//* hooks import
import {useAppColorScheme} from '@hooks/useAppColorScheme';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';

//* redux import
import {
  hydratePreferences,
  selectAppPreferences,
  setThemeMode,
  togglePreference,
  type AppPreferences,
} from '@redux/slices/appSettingsSlice';

//* services / i18n
import {logoutService} from '@services/authServices/logoutService';
import {setAppLanguage} from '@translation/i18n';

//* theme import
import {useThemedStyles} from '@theme/createThemedStyles';
import {useThemeTokens} from '@theme/useThemeTokens';
import {resolveSettingsStyles} from './styles/resolveSettingsStyles';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';
import {Languages} from '@Types/languages';
import {ThemeMode} from '@Types/themeMode';

interface SettingsProps {
  navigation: AppStackNavigationProp<'Settings'>;
}

type SheetKind = 'language' | 'theme' | null;

type ToggleItem = {
  key: keyof AppPreferences;
  titleKey: string;
  subtitleKey: string;
};

const NOTIFICATION_TOGGLES: ToggleItem[] = [
  {
    key: 'pushNotifications',
    titleKey: 'settings.pushNotifications',
    subtitleKey: 'settings.pushNotificationsHint',
  },
  {
    key: 'emailNotifications',
    titleKey: 'settings.emailNotifications',
    subtitleKey: 'settings.emailNotificationsHint',
  },
  {
    key: 'marketingEmails',
    titleKey: 'settings.marketingEmails',
    subtitleKey: 'settings.marketingEmailsHint',
  },
];

const PRIVACY_TOGGLES: ToggleItem[] = [
  {
    key: 'biometricLock',
    titleKey: 'settings.biometricLock',
    subtitleKey: 'settings.biometricLockHint',
  },
  {
    key: 'locationServices',
    titleKey: 'settings.locationServices',
    subtitleKey: 'settings.locationServicesHint',
  },
  {
    key: 'analyticsSharing',
    titleKey: 'settings.analyticsSharing',
    subtitleKey: 'settings.analyticsSharingHint',
  },
];

const MEDIA_TOGGLES: ToggleItem[] = [
  {
    key: 'soundEffects',
    titleKey: 'settings.soundEffects',
    subtitleKey: 'settings.soundEffectsHint',
  },
  {
    key: 'haptics',
    titleKey: 'settings.haptics',
    subtitleKey: 'settings.hapticsHint',
  },
  {
    key: 'autoPlayVideos',
    titleKey: 'settings.autoPlayVideos',
    subtitleKey: 'settings.autoPlayVideosHint',
  },
  {
    key: 'dataSaver',
    titleKey: 'settings.dataSaver',
    subtitleKey: 'settings.dataSaverHint',
  },
];

const THEME_OPTIONS: {mode: ThemeMode; labelKey: string}[] = [
  {mode: 'light', labelKey: 'settings.light'},
  {mode: 'dark', labelKey: 'settings.dark'},
  {mode: 'system', labelKey: 'settings.system'},
];

const LANGUAGE_OPTIONS: {code: Languages; labelKey: string}[] = [
  {code: 'en', labelKey: 'common.english'},
  {code: 'ar', labelKey: 'common.arabic'},
];

const Settings = ({navigation}: SettingsProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const lang = useAppSelector(state => state.appSettings.lang);
  const themeMode = useAppSelector(state => state.appSettings.themeMode);
  const preferences = useAppSelector(selectAppPreferences);
  const activeScheme = useAppColorScheme();
  const {t} = useTranslation();
  const {colors, sizes} = useThemeTokens();
  const styles = useThemedStyles(resolveSettingsStyles);
  const [sheet, setSheet] = useState<SheetKind>(null);
  const [draftLang, setDraftLang] = useState<Languages>(lang);
  const [draftTheme, setDraftTheme] = useState<ThemeMode>(themeMode);

  useEffect(() => {
    dispatch(hydratePreferences());
  }, [dispatch]);

  useEffect(() => {
    if (sheet === 'language') {
      setDraftLang(lang);
    }
    if (sheet === 'theme') {
      setDraftTheme(themeMode);
    }
  }, [lang, sheet, themeMode]);

  const appearanceHint = useMemo(() => {
    if (themeMode === 'system') {
      return t('settings.appearanceSystem', {scheme: activeScheme});
    }
    return t('settings.appearanceFixed', {mode: themeMode});
  }, [activeScheme, t, themeMode]);

  const languageLabel = lang === 'ar' ? t('common.arabic') : t('common.english');

  const closeSheet = () => setSheet(null);

  const confirmLanguage = () => {
    if (draftLang !== lang) {
      void setAppLanguage(dispatch, draftLang);
    }
    closeSheet();
  };

  const confirmTheme = () => {
    if (draftTheme !== themeMode) {
      dispatch(setThemeMode(draftTheme));
    }
    closeSheet();
  };

  const sheetFooter = (onConfirm: () => void) => (
    <View style={styles.sheetActions}>
      <Button
        label={t('common.cancel')}
        variant="outline"
        flat
        fullWidth
        style={styles.sheetActionButton}
        onPress={closeSheet}
      />
      <Button
        label={t('common.confirm')}
        variant="primary"
        flat
        fullWidth
        style={styles.sheetActionButton}
        onPress={onConfirm}
      />
    </View>
  );

  const renderToggleSection = (title: string, items: ToggleItem[]) => (
    <View style={styles.section}>
      <TextView text={title} variant="bodySmall" muted style={styles.sectionTitle} />
      {items.map(item => (
        <View key={item.key} style={styles.row}>
          <View style={styles.rowCopy}>
            <TextView text={t(item.titleKey)} variant="body" />
            <TextView text={t(item.subtitleKey)} variant="caption" muted />
          </View>
          <Switch
            value={preferences[item.key]}
            onValueChange={() => {
              dispatch(togglePreference(item.key));
            }}
            trackColor={{
              false: colors.border,
              true: colors.primaryMuted,
            }}
            thumbColor={
              preferences[item.key] ? colors.primary : colors.textMuted
            }
          />
        </View>
      ))}
    </View>
  );

  const onLogout = () => {
    if (isEmpty(user)) {
      return;
    }
    Alert.alert(t('drawer.logout'), t('drawer.logoutConfirm'), [
      {text: t('common.cancel', {defaultValue: 'Cancel'}), style: 'cancel'},
      {
        text: t('drawer.logout'),
        style: 'destructive',
        onPress: () => {
          void logoutService(user.loginType, dispatch);
        },
      },
    ]);
  };

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('settings.title')} navigation={navigation} />

      <View style={styles.section}>
        <TextView
          text={t('settings.general')}
          variant="bodySmall"
          muted
          style={styles.sectionTitle}
        />
        <Pressable
          style={({pressed}) => [styles.row, pressed && styles.rowPressed]}
          onPress={() => setSheet('language')}>
          <View style={styles.rowIcon}>
            <IconView
              iconType="Ionicons"
              name="language-outline"
              size={sizes.iconSm}
              color={colors.primary}
            />
          </View>
          <View style={styles.rowCopy}>
            <TextView text={t('settings.language')} variant="body" />
            <TextView text={languageLabel} variant="caption" muted />
          </View>
          <IconView
            iconType="Ionicons"
            name="chevron-forward"
            size={18}
            color={colors.textMuted}
          />
        </Pressable>
        <Pressable
          style={({pressed}) => [styles.row, pressed && styles.rowPressed]}
          onPress={() => setSheet('theme')}>
          <View style={styles.rowIcon}>
            <IconView
              iconType="Ionicons"
              name="moon-outline"
              size={sizes.iconSm}
              color={colors.primary}
            />
          </View>
          <View style={styles.rowCopy}>
            <TextView text={t('settings.appearance')} variant="body" />
            <TextView text={appearanceHint} variant="caption" muted />
          </View>
          <IconView
            iconType="Ionicons"
            name="chevron-forward"
            size={18}
            color={colors.textMuted}
          />
        </Pressable>
      </View>

      <Spacer size="md" />
      {renderToggleSection(t('settings.notifications'), NOTIFICATION_TOGGLES)}
      <Spacer size="md" />
      {renderToggleSection(t('settings.privacy'), PRIVACY_TOGGLES)}
      <Spacer size="md" />
      {renderToggleSection(t('settings.media'), MEDIA_TOGGLES)}

      <Spacer size="md" />
      <View style={styles.section}>
        <TextView
          text={t('settings.account')}
          variant="bodySmall"
          muted
          style={styles.sectionTitle}
        />
        <Pressable
          style={({pressed}) => [styles.dangerRow, pressed && styles.rowPressed]}
          onPress={onLogout}>
          <View style={[styles.rowIcon, {backgroundColor: colors.errorMuted}]}>
            <IconView
              iconType="Ionicons"
              name="log-out-outline"
              size={sizes.iconSm}
              color={colors.error}
            />
          </View>
          <TextView
            text={t('drawer.logout')}
            variant="body"
            style={{color: colors.error}}
          />
        </Pressable>
      </View>

      <BottomSheet
        visible={sheet === 'language'}
        onClose={closeSheet}
        title={t('settings.language')}
        subtitle={t('settings.languageSheetHint')}
        footer={sheetFooter(confirmLanguage)}>
        {LANGUAGE_OPTIONS.map(option => {
          const active = draftLang === option.code;
          return (
            <Pressable
              key={option.code}
              style={[styles.sheetOption, active && styles.sheetOptionActive]}
              onPress={() => setDraftLang(option.code)}>
              <TextView text={t(option.labelKey)} variant="body" />
              {active ? (
                <IconView
                  iconType="Ionicons"
                  name="checkmark-circle"
                  size={22}
                  color={colors.primary}
                />
              ) : null}
            </Pressable>
          );
        })}
      </BottomSheet>

      <BottomSheet
        visible={sheet === 'theme'}
        onClose={closeSheet}
        title={t('settings.appearance')}
        subtitle={t('settings.themeSheetHint')}
        footer={sheetFooter(confirmTheme)}>
        {THEME_OPTIONS.map(option => {
          const active = draftTheme === option.mode;
          return (
            <Pressable
              key={option.mode}
              style={[styles.sheetOption, active && styles.sheetOptionActive]}
              onPress={() => setDraftTheme(option.mode)}>
              <TextView text={t(option.labelKey)} variant="body" />
              {active ? (
                <IconView
                  iconType="Ionicons"
                  name="checkmark-circle"
                  size={22}
                  color={colors.primary}
                />
              ) : null}
            </Pressable>
          );
        })}
      </BottomSheet>
    </ScreenContainer>
  );
};

export default Settings;
