import React, {useMemo} from 'react';
import {Pressable, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextView from '@atoms/TextView';

import {
  designSystemRegistry,
  type DesignSystemRegistryItem,
} from '../registry';
import {navigateDesignSystemShowcase} from '../shared/showcaseHelpers';
import {useThemedStyles} from '@theme/createThemedStyles';
import {resolveHubStyles} from './styles/resolveHubStyles';
import type {
  DesignSystemRouteName,
  DesignSystemStackParamList,
} from '@Types/designSystemNavigation';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

type HubProps = {
  navigation: NativeStackNavigationProp<
    DesignSystemStackParamList,
    'DesignSystemHub'
  >;
};

type Category = 'theme' | 'atoms' | 'molecules' | 'organisms' | 'templates';

const CATEGORY_ORDER: Category[] = [
  'theme',
  'atoms',
  'molecules',
  'organisms',
  'templates',
];

const DesignSystemHub = ({navigation}: HubProps): React.JSX.Element => {
  const {t} = useTranslation();
  const styles = useThemedStyles(resolveHubStyles);

  const grouped = useMemo(() => {
    const map = new Map<Category, DesignSystemRegistryItem[]>();
    for (const cat of CATEGORY_ORDER) {
      map.set(
        cat,
        designSystemRegistry.filter(item => item.category === cat),
      );
    }
    return map;
  }, []);

  const openShowcase = (route: DesignSystemRouteName) => {
    navigateDesignSystemShowcase(navigation, route);
  };

  return (
    <ScreenContainer scroll bottomPadding="xxl">
      <ScreenHeader
        title={t('designSystem.hubTitle', {defaultValue: 'Design System'})}
        showBack={false}
      />
      <TextView
        text={t('designSystem.hubSubtitle', {
          defaultValue:
            'Browse every component with all variants and states. Tap an item to open its showcase.',
        })}
        variant="bodySmall"
        muted
      />
      <Spacer size="lg" />

      {CATEGORY_ORDER.map(category => {
        const items = grouped.get(category) ?? [];
        if (items.length === 0) return null;

        return (
          <View key={category}>
            <Heading
              text={t(`designSystem.categories.${category}`, {
                defaultValue: category.charAt(0).toUpperCase() + category.slice(1),
              })}
              level="h2"
            />
            <Spacer size="md" />
            <View style={styles.category}>
              {items.map(item => (
                <Pressable
                  key={item.route}
                  style={({pressed}) => [
                    styles.item,
                    pressed && styles.itemPressed,
                  ]}
                  onPress={() => openShowcase(item.route)}>
                  <TextView text={item.title} variant="body" />
                  <TextView text={item.route} variant="caption" muted />
                </Pressable>
              ))}
            </View>
            <Spacer size="xl" />
          </View>
        );
      })}
    </ScreenContainer>
  );
};

export default DesignSystemHub;
