import React, {useCallback, useMemo, useState} from 'react';
import {Pressable, View} from 'react-native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {useTranslation} from 'react-i18next';

import FeatureHubCard from '@atoms/FeatureHubCard';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextInputView from '@atoms/TextInputView';
import TextView from '@atoms/TextView';

import {
  SERVICE_CATEGORIES,
  filterServicesCatalog,
  type ServiceCategoryId,
} from '@config/servicesCatalog';
import {FLOATING_TAB_CONTENT_INSET} from '@navigation/TabNavigator/styles/resolveFloatingTabBarStyles';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp, DrawerParamList} from '@Types/appNavigation';

type Props = {navigation: AppStackNavigationProp<'ServicesHub'>};

const ServicesHub = ({navigation}: Props): React.JSX.Element => {
  const {t} = useTranslation();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ServiceCategoryId | 'all'>('all');

  const drawerNav = navigation.getParent<DrawerNavigationProp<DrawerParamList>>();

  const openService = useCallback(
    (route: keyof DrawerParamList) => {
      drawerNav?.navigate(route);
    },
    [drawerNav],
  );

  const filtered = useMemo(
    () => filterServicesCatalog(query, category),
    [category, query],
  );

  const grouped = useMemo(() => {
    if (category !== 'all') {
      return [{id: category, items: filtered}];
    }
    return SERVICE_CATEGORIES.map(section => ({
      id: section,
      items: filtered.filter(item => item.category === section),
    })).filter(section => section.items.length > 0);
  }, [category, filtered]);

  const styles = useThemedStyles(tokens => ({
    hero: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.xl,
      padding: tokens.spacing.lg,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      gap: tokens.spacing.xs,
    },
    tabs: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.xs, marginBottom: tokens.spacing.md},
    tab: {
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.md,
      paddingVertical: tokens.spacing.xs,
      backgroundColor: tokens.colors.surface,
    },
    tabActive: {backgroundColor: tokens.colors.primary, borderColor: tokens.colors.primary},
    tabActiveText: {color: tokens.colors.textInverse},
    grid: {...tokens.layout.presets.wrapRow, gap: tokens.spacing.sm},
    sectionTitle: {marginBottom: tokens.spacing.sm},
  }));

  return (
    <ScreenContainer
      scroll
      bottomPadding="xxl"
      contentStyle={{paddingBottom: FLOATING_TAB_CONTENT_INSET}}>
      <ScreenHeader
        title={t('services.title')}
        showBack={false}
        showDrawer
        navigation={navigation}
        rightActions={[
          {
            key: 'home',
            iconName: 'home-outline',
            onPress: () => navigation.navigate('Home'),
            accessibilityLabel: t('tabs.home'),
          },
        ]}
      />
      <View style={styles.hero}>
        <TextView text={t('services.subtitle')} variant="bodySmall" muted />
        <Heading text={t('services.hubTitle')} level="h2" />
      </View>
      <Spacer size="lg" />
      <TextInputView
        value={query}
        onChangeText={setQuery}
        placeholder={t('services.searchPlaceholder')}
      />
      <Spacer size="md" />
      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, category === 'all' && styles.tabActive]}
          onPress={() => setCategory('all')}>
          <TextView
            text={t('services.categories.all')}
            variant="caption"
            style={category === 'all' ? styles.tabActiveText : undefined}
          />
        </Pressable>
        {SERVICE_CATEGORIES.map(item => (
          <Pressable
            key={item}
            style={[styles.tab, category === item && styles.tabActive]}
            onPress={() => setCategory(item)}>
            <TextView
              text={t(`services.categories.${item}`)}
              variant="caption"
              style={category === item ? styles.tabActiveText : undefined}
            />
          </Pressable>
        ))}
      </View>
      {filtered.length === 0 ? (
        <TextView text={t('services.noResults')} variant="body" muted />
      ) : (
        grouped.map(section => (
          <View key={section.id}>
            <Heading
              text={t(`services.categories.${section.id}`)}
              level="h3"
              style={styles.sectionTitle}
            />
            <View style={styles.grid}>
              {section.items.map(item => (
                <FeatureHubCard
                  key={item.id}
                  title={t(item.titleKey)}
                  subtitle={t(item.subtitleKey)}
                  iconType={item.iconType}
                  iconName={item.iconName}
                  accentColor={item.accent}
                  onPress={() => openService(item.route)}
                />
              ))}
            </View>
            <Spacer size="lg" />
          </View>
        ))
      )}
    </ScreenContainer>
  );
};

export default ServicesHub;
