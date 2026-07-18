import React, {useEffect, useMemo, useState} from 'react';
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
import {
  getCitiesForCountry,
  PRAYER_COUNTRIES,
  PRAYER_TIMEZONES,
} from '@constants/prayerLocations';
import {getCurrentPosition, requestLocationPermission} from '@helpers/locationHelpers';
import {useAppDispatch} from '@hooks/useAppDispatch';
import {setPrayerLocation} from '@redux/slices/islamicSlice';
import {useThemedStyles} from '@theme/createThemedStyles';
import type {AppStackNavigationProp} from '@Types/appNavigation';
import type {PrayerLocation} from '@Types/islamicTypes';

type Props = {navigation: AppStackNavigationProp<'PrayerLocationSetup'>};
type TabId = 'gps' | 'city' | 'timezone';

const formatZoneNow = (timezone: string, locale: string): string => {
  try {
    return new Intl.DateTimeFormat(locale, {
      timeZone: timezone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'shortOffset',
    }).format(new Date());
  } catch {
    return timezone;
  }
};

/**
 * Choose prayer-location via GPS, country/city (or Places search), or GMT timezone.
 */
const PrayerLocationSetup = ({navigation}: Props): React.JSX.Element => {
  const {t, i18n} = useTranslation();
  const dispatch = useAppDispatch();
  const isAr = i18n.language.startsWith('ar');
  const locale = isAr ? 'ar' : 'en-GB';

  const [tab, setTab] = useState<TabId>('gps');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [country, setCountry] = useState(PRAYER_COUNTRIES[0].country);
  const [city, setCity] = useState(PRAYER_COUNTRIES[0].cities[0].city);
  const [showCountries, setShowCountries] = useState(false);
  const [showCities, setShowCities] = useState(false);

  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceCitySuggestion[]>([]);
  const [searching, setSearching] = useState(false);

  const cities = useMemo(() => getCitiesForCountry(country), [country]);
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
    optionActive: {backgroundColor: tokens.colors.primaryMuted},
    dropdown: {
      marginTop: tokens.spacing.xs,
      maxHeight: tokens.sizes.touchTarget * 6,
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      borderRadius: tokens.radius.md,
      backgroundColor: tokens.colors.background,
    },
    field: {
      borderWidth: tokens.layout.borderWidth.sm,
      borderColor: tokens.colors.border,
      borderRadius: tokens.radius.md,
      padding: tokens.spacing.sm,
      backgroundColor: tokens.colors.background,
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
        setTab('city');
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
        timezone: null,
        timezoneId: null,
        label: place?.label || t('islamic.prayer.currentLocation'),
      });
    } catch {
      setError(t('islamic.prayer.locationFailed'));
      setTab('city');
    } finally {
      setBusy(false);
    }
  };

  const selectCityLocation = () => {
    if (!city || !country) {
      return;
    }
    saveAndClose({
      mode: 'city',
      city,
      country,
      latitude: null,
      longitude: null,
      timezone: null,
      timezoneId: null,
      label: `${city}, ${country}`,
    });
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
        mode: 'gps',
        city: place.city,
        country: place.country,
        latitude: place.latitude,
        longitude: place.longitude,
        timezone: null,
        timezoneId: null,
        label: place.label,
      });
    } catch {
      setError(t('islamic.prayer.locationFailed'));
    } finally {
      setBusy(false);
    }
  };

  const selectTimezoneLocation = (timezoneId: string) => {
    const zone = PRAYER_TIMEZONES.find(item => item.id === timezoneId);
    if (!zone) {
      return;
    }
    saveAndClose({
      mode: 'timezone',
      city: zone.city,
      country: zone.country,
      latitude: zone.latitude,
      longitude: zone.longitude,
      timezone: zone.timezone,
      timezoneId: zone.id,
      label: isAr ? zone.labelAr : zone.labelEn,
    });
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
              ['city', t('islamic.prayer.tabCity')],
              ['timezone', t('islamic.prayer.tabTimezone')],
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
              onPress={() => setTab('city')}
            />
          </View>
        ) : null}

        {tab === 'city' ? (
          <View style={styles.card}>
            <Heading text={t('islamic.prayer.pickCityTitle')} level="h3" />
            <Spacer size="xs" />
            <TextView text={t('islamic.prayer.pickCityBody')} variant="bodySmall" muted />
            <Spacer size="md" />

            {placesEnabled ? (
              <>
                <TextView text={t('islamic.prayer.searchCity')} variant="caption" muted />
                <Spacer size="xxs" />
                <TextInputView
                  placeholder={t('islamic.prayer.searchCityPlaceholder')}
                  value={search}
                  onChangeText={setSearch}
                />
                {searching ? <ActivityIndicator /> : null}
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
                <Spacer size="md" />
                <TextView text={t('islamic.prayer.orPickDropdown')} variant="caption" muted />
                <Spacer size="sm" />
              </>
            ) : null}

            <TextView text={t('islamic.prayer.country')} variant="caption" muted />
            <Spacer size="xxs" />
            <Pressable
              style={styles.field}
              onPress={() => {
                setShowCountries(current => !current);
                setShowCities(false);
              }}>
              <TextView text={country} variant="body" />
            </Pressable>
            {showCountries ? (
              <ScrollView style={styles.dropdown} nestedScrollEnabled>
                {PRAYER_COUNTRIES.map(item => (
                  <Pressable
                    key={item.country}
                    style={[styles.option, item.country === country && styles.optionActive]}
                    onPress={() => {
                      setCountry(item.country);
                      setCity(item.cities[0]?.city ?? '');
                      setShowCountries(false);
                    }}>
                    <TextView text={item.country} variant="body" />
                  </Pressable>
                ))}
              </ScrollView>
            ) : null}

            <Spacer size="md" />
            <TextView text={t('islamic.prayer.city')} variant="caption" muted />
            <Spacer size="xxs" />
            <Pressable
              style={styles.field}
              onPress={() => {
                setShowCities(current => !current);
                setShowCountries(false);
              }}>
              <TextView text={city} variant="body" />
            </Pressable>
            {showCities ? (
              <ScrollView style={styles.dropdown} nestedScrollEnabled>
                {cities.map(item => (
                  <Pressable
                    key={item.city}
                    style={[styles.option, item.city === city && styles.optionActive]}
                    onPress={() => {
                      setCity(item.city);
                      setShowCities(false);
                    }}>
                    <TextView text={item.label} variant="body" />
                  </Pressable>
                ))}
              </ScrollView>
            ) : null}

            <Spacer size="md" />
            <Button label={t('islamic.prayer.saveLocation')} onPress={selectCityLocation} />
          </View>
        ) : null}

        {tab === 'timezone' ? (
          <View style={styles.card}>
            <Heading text={t('islamic.prayer.pickTimezoneTitle')} level="h3" />
            <Spacer size="xs" />
            <TextView text={t('islamic.prayer.pickTimezoneBody')} variant="bodySmall" muted />
            <Spacer size="md" />
            {PRAYER_TIMEZONES.map(zone => (
              <Pressable
                key={zone.id}
                style={styles.option}
                onPress={() => selectTimezoneLocation(zone.id)}>
                <Heading text={isAr ? zone.labelAr : zone.labelEn} level="h3" />
                <Spacer size="xxs" />
                <TextView text={zone.gmtLabel} variant="caption" />
                <TextView
                  text={formatZoneNow(zone.timezone, locale)}
                  variant="bodySmall"
                  muted
                />
              </Pressable>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
};

export default PrayerLocationSetup;
