import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Pressable, ScrollView, View} from 'react-native';
import {useTranslation} from 'react-i18next';

import Button from '@atoms/Button';
import Heading from '@atoms/Heading';
import ScreenContainer from '@atoms/ScreenContainer';
import ScreenHeader from '@atoms/ScreenHeader';
import Spacer from '@atoms/Spacer';
import TextInputView from '@atoms/TextInputView';
import TextView from '@atoms/TextView';

import {placesClient, type PlaceCitySuggestion} from '@api/clients/placesClient';
import {getCurrentPosition, requestLocationPermission} from '@helpers/locationHelpers';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {setPrayerLocation} from '@redux/slices/islamicSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {PrayerLocation} from '@Types/islamicTypes';

type Props = {navigation: AppStackNavigationProp<'PrayerLocationSetup'>};
type TabId = 'gps' | 'search';

/**
 * Choose prayer location via GPS or Google Places search.
 * Timezone is resolved dynamically from Google Time Zone API — no static lists.
 */
const PrayerLocationSetup = ({navigation}: Props): React.JSX.Element => {
  const {t, i18n} = useTranslation();
  const dispatch = useAppDispatch();
  const isAr = i18n.language.startsWith('ar');

  const [tab, setTab] = useState<TabId>('gps');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceCitySuggestion[]>([]);
  const [searching, setSearching] = useState(false);

  const placesEnabled = placesClient.isConfigured();

  const styles = useThemedStyles(tokens => ({
    tabs: {...tokens.layout.presets.row, gap: tokens.spacing.xs, flexWrap: 'wrap' as const},
    tab: {
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      borderRadius: tokens.radius.full,
      paddingHorizontal: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xxs,
      backgroundColor: tokens.colors.surface,
    },
    tabActive: {
      backgroundColor: tokens.colors.primary,
      borderColor: tokens.colors.primary,
    },
    tabTextActive: {color: tokens.colors.textInverse},
    card: {
      backgroundColor: tokens.colors.surface,
      borderRadius: tokens.radius.lg,
      padding: tokens.spacing.md,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      ...tokens.shadows.sm,
    },
    option: {
      paddingVertical: tokens.spacing.sm,
      borderBottomWidth: tokens.layout.borderWidth.sm,
      borderBottomColor: tokens.colors.border,
    },
  }));

  useEffect(() => {
    if (!placesEnabled || search.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(() => {
      setSearching(true);
      placesClient
        .autocompleteCities(search, isAr ? 'ar' : 'en')
        .then(setSuggestions)
        .catch(() => setSuggestions([]))
        .finally(() => setSearching(false));
    }, 350);
    return () => clearTimeout(timer);
  }, [isAr, placesEnabled, search]);

  const saveAndClose = (location: PrayerLocation) => {
    dispatch(setPrayerLocation(location));
    navigation.goBack();
  };

  const selectGpsLocation = async () => {
    setBusy(true);
    setError(null);
    try {
      const allowed = await requestLocationPermission();
      if (!allowed) {
        setError(t('islamic.prayer.locationDenied'));
        setTab('search');
        return;
      }
      const coords = await getCurrentPosition();
      const place = await placesClient.reverseGeocode(coords.latitude, coords.longitude);
      saveAndClose({
        mode: 'gps',
        city: place?.city || t('islamic.prayer.currentLocation'),
        country: place?.country || '',
        latitude: coords.latitude,
        longitude: coords.longitude,
        timezone: place?.timezone ?? null,
        timezoneId: place?.timezone ?? null,
        label: place?.label || t('islamic.prayer.currentLocation'),
      });
    } catch {
      setError(t('islamic.prayer.locationFailed'));
      setTab('search');
    } finally {
      setBusy(false);
    }
  };

  const selectPlaceSuggestion = async (suggestion: PlaceCitySuggestion) => {
    setBusy(true);
    setError(null);
    try {
      const place = await placesClient.resolvePlaceId(suggestion.placeId);
      if (!place) {
        setError(t('islamic.prayer.locationFailed'));
        return;
      }
      saveAndClose({
        mode: 'city',
        city: place.city,
        country: place.country,
        latitude: place.latitude,
        longitude: place.longitude,
        timezone: place.timezone,
        timezoneId: place.timezone,
        label: place.label,
      });
    } catch {
      setError(t('islamic.prayer.locationFailed'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenContainer bottomPadding="xxl">
      <ScreenHeader
        title={t('islamic.prayer.chooseLocation')}
        onBack={() => navigation.goBack()}
      />
      <ScrollView>
        <TextView text={t('islamic.prayer.chooseLocationSubtitle')} variant="bodySmall" muted />
        <Spacer size="md" />
        <View style={styles.tabs}>
          {(
            [
              ['gps', t('islamic.prayer.tabGps')],
              ['search', t('islamic.prayer.tabCity')],
            ] as const
          ).map(([id, label]) => (
            <Pressable
              key={id}
              style={[styles.tab, tab === id && styles.tabActive]}
              onPress={() => setTab(id)}>
              <TextView
                text={label}
                variant="caption"
                style={tab === id ? styles.tabTextActive : undefined}
              />
            </Pressable>
          ))}
        </View>
        <Spacer size="md" />

        {error ? (
          <>
            <TextView text={error} variant="bodySmall" />
            <Spacer size="sm" />
          </>
        ) : null}

        {tab === 'gps' ? (
          <View style={styles.card}>
            <Heading text={t('islamic.prayer.useGpsTitle')} level="h3" />
            <Spacer size="xs" />
            <TextView text={t('islamic.prayer.useGpsBody')} variant="bodySmall" muted />
            <Spacer size="md" />
            {busy ? (
              <ActivityIndicator />
            ) : (
              <Button
                label={t('islamic.prayer.useMyLocation')}
                onPress={() => {
                  selectGpsLocation().catch(() => undefined);
                }}
              />
            )}
            <Spacer size="sm" />
            <Button
              label={t('islamic.prayer.skipToManual')}
              variant="secondary"
              onPress={() => setTab('search')}
            />
          </View>
        ) : null}

        {tab === 'search' ? (
          <View style={styles.card}>
            <Heading text={t('islamic.prayer.pickCityTitle')} level="h3" />
            <Spacer size="xs" />
            <TextView text={t('islamic.prayer.pickCityBody')} variant="bodySmall" muted />
            <Spacer size="md" />

            {!placesEnabled ? (
              <TextView text={t('islamic.prayer.mapsKeyRequired')} variant="bodySmall" />
            ) : (
              <>
                <TextView text={t('islamic.prayer.searchCity')} variant="caption" muted />
                <Spacer size="xxs" />
                <TextInputView
                  placeholder={t('islamic.prayer.searchCityPlaceholder')}
                  value={search}
                  onChangeText={setSearch}
                />
                {searching || busy ? <ActivityIndicator /> : null}
                {suggestions.map(item => (
                  <Pressable
                    key={item.placeId}
                    style={styles.option}
                    onPress={() => {
                      selectPlaceSuggestion(item).catch(() => undefined);
                    }}>
                    <TextView text={item.description} variant="body" />
                  </Pressable>
                ))}
                {search.trim().length >= 2 && !searching && suggestions.length === 0 ? (
                  <TextView text={t('islamic.prayer.noCityResults')} variant="caption" muted />
                ) : null}
              </>
            )}
          </View>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
};

export default PrayerLocationSetup;
