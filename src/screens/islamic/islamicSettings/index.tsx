import React from 'react';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Card from '@atoms/Card';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';
import {updateNotificationSettings} from '@redux/slices/islamicSlice';
import {
  buildIslamicNotificationPayload,
  displayIslamicNotification,
  refreshIslamicNotificationSchedule,
} from '@services/islamicServices/islamicNotificationService';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';

type Props = {navigation: AppStackNavigationProp<'IslamicSettings'>};

const SettingToggle = ({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) => (
  <Card>
    <Heading text={label} level="h3" />
    <Spacer size="xs" />
    <TextView text={description} variant="bodySmall" muted />
    <Spacer size="sm" />
    <Button
      label={enabled ? 'On' : 'Off'}
      variant={enabled ? 'primary' : 'secondary'}
      onPress={onToggle}
    />
  </Card>
);

const IslamicSettings = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const settings = useAppSelector(state => state.islamic.notificationSettings);

  const styles = useThemedStyles(tokens => ({
    stack: {gap: tokens.spacing.md},
  }));

  const patchSettings = async (patch: Partial<typeof settings>) => {
    dispatch(updateNotificationSettings(patch));
    await refreshIslamicNotificationSchedule({...settings, ...patch});
  };

  const previewNotification = async () => {
    const payload = await buildIslamicNotificationPayload(settings);
    await displayIslamicNotification(payload);
  };

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader title={t('islamic.settings.title')} onBack={() => navigation.goBack()} />
      <View style={styles.stack}>
        <SettingToggle
          label={t('islamic.settings.notifications')}
          description={t('islamic.settings.notificationsDescription')}
          enabled={settings.enabled}
          onToggle={() => patchSettings({enabled: !settings.enabled})}
        />
        <SettingToggle
          label={t('islamic.settings.hourly')}
          description={t('islamic.settings.hourlyDescription')}
          enabled={settings.hourlyReminders}
          onToggle={() => patchSettings({hourlyReminders: !settings.hourlyReminders})}
        />
        <SettingToggle
          label={t('islamic.settings.includeAdhkar')}
          description={t('islamic.settings.includeAdhkarDescription')}
          enabled={settings.includeAdhkar}
          onToggle={() => patchSettings({includeAdhkar: !settings.includeAdhkar})}
        />
        <SettingToggle
          label={t('islamic.settings.includeQuran')}
          description={t('islamic.settings.includeQuranDescription')}
          enabled={settings.includeQuran}
          onToggle={() => patchSettings({includeQuran: !settings.includeQuran})}
        />
        <SettingToggle
          label={t('islamic.settings.includeHadith')}
          description={t('islamic.settings.includeHadithDescription')}
          enabled={settings.includeHadith}
          onToggle={() => patchSettings({includeHadith: !settings.includeHadith})}
        />
        <Button
          label={t('islamic.settings.previewNotification')}
          variant="ghost"
          fullWidth
          onPress={previewNotification}
        />
      </View>
    </ScreenContainer>
  );
};

export default IslamicSettings;
