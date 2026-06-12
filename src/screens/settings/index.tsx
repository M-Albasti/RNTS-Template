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
import {useAppDispatch} from '@hooks/useAppDispatch';
import {useAppSelector} from '@hooks/useAppSelector';

//* translation import
import {changeLanguage} from '@translation/i18n';

//* theme import
import {useThemedStyles} from '@theme/createThemedStyles';

//* types import
import {AppStackNavigationProp} from '@Types/appNavigation';

interface SettingsProps {
  navigation: AppStackNavigationProp<'Settings'>;
}

const Settings = (_props: SettingsProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector(state => state.appSettings.lang);
  const {t} = useTranslation();
  const styles = useThemedStyles(tokens => ({
    row: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
    },
  }));

  return (
    <ScreenContainer scroll>
      <Heading text="Settings" level="h1" />
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

      <Spacer size="lg" />

      <Card elevated={false}>
        <TextView
          text="Appearance follows your device light/dark setting."
          variant="bodySmall"
          muted
        />
      </Card>
    </ScreenContainer>
  );
};

export default Settings;
