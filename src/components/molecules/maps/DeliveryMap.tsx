import React, {useEffect, useMemo, useRef} from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';

import {GOOGLE_MAPS_API_KEY} from '@env';
import {DEFAULT_MAP_REGION} from '@constants/deliveryMockData';
import {getMapRegionForPoints} from '@helpers/deliveryTrackingHelpers';
import {useThemeTokens} from '@theme/useThemeTokens';
import {useThemedStyles} from '@theme/createThemedStyles';

import type {GeoPoint} from '@Types/deliveryTypes';

type MapMarker = {
  id: string;
  coordinate: GeoPoint;
  title: string;
  description?: string;
  pinColor?: string;
};

type DeliveryMapProps = {
  markers: MapMarker[];
  routeFrom?: GeoPoint;
  routeTo?: GeoPoint;
  driverPosition?: GeoPoint;
  height?: number;
  fullScreen?: boolean;
  showsUserLocation?: boolean;
  followDriver?: boolean;
  live?: boolean;
};

const useGoogleMapsProvider =
  !!GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY';

const DeliveryMap = ({
  markers,
  routeFrom,
  routeTo,
  driverPosition,
  height = 280,
  fullScreen = false,
  showsUserLocation = true,
  followDriver = false,
  live = false,
}: DeliveryMapProps): React.JSX.Element => {
  const mapRef = useRef<MapView | null>(null);
  const lastAnimateAtRef = useRef(0);
  const {colors} = useThemeTokens();
  const styles = useThemedStyles(t => ({
    wrapper: {
      width: '100%' as const,
      borderRadius: t.radius.lg,
      overflow: t.layout.overflow.hidden,
    },
    fullScreen: {
      flex: t.layout.flex.fill,
      borderRadius: t.radius.none,
    },
    liveBadge: {
      position: t.layout.position.absolute,
      top: t.spacing.md,
      right: t.spacing.md,
      zIndex: t.layout.zIndex.sticky,
      backgroundColor: t.colors.liveBadge,
      borderRadius: t.radius.full,
      paddingHorizontal: t.spacing.sm,
      paddingVertical: t.spacing.xs,
    },
    liveDot: {
      width: t.spacing.sm,
      height: t.spacing.sm,
      borderRadius: t.radius.sm,
      backgroundColor: t.colors.onLiveBadge,
    },
  }));

  const routeCoordinates = useMemo(() => {
    if (!routeFrom || !routeTo) {
      return [];
    }
    if (driverPosition) {
      return [routeFrom, driverPosition, routeTo];
    }
    return [routeFrom, routeTo];
  }, [driverPosition, routeFrom, routeTo]);

  const region = useMemo(() => {
    const points = [
      ...markers.map(marker => marker.coordinate),
      ...(driverPosition ? [driverPosition] : []),
    ];
    return getMapRegionForPoints(points.length ? points : [DEFAULT_MAP_REGION]);
  }, [driverPosition, markers]);

  useEffect(() => {
    if (!followDriver || !driverPosition || !mapRef.current) {
      return;
    }
    const now = Date.now();
    if (now - lastAnimateAtRef.current < 4000) {
      return;
    }
    lastAnimateAtRef.current = now;
    mapRef.current.animateToRegion(
      {
        ...driverPosition,
        latitudeDelta: 0.025,
        longitudeDelta: 0.025,
      },
      500,
    );
  }, [driverPosition?.latitude, driverPosition?.longitude, followDriver]);

  return (
    <View style={[styles.wrapper, fullScreen ? styles.fullScreen : {height}]}>
      {live ? (
        <View style={styles.liveBadge}>
          <View style={styles.liveDot} />
        </View>
      ) : null}
      <MapView
        ref={mapRef}
        provider={useGoogleMapsProvider ? PROVIDER_GOOGLE : undefined}
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        showsUserLocation={showsUserLocation}
        showsMyLocationButton
        followsUserLocation={followDriver && Platform.OS === 'ios'}>
        {markers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            pinColor={marker.pinColor}
          />
        ))}
        {driverPosition ? (
          <Marker
            coordinate={driverPosition}
            title="Courier"
            description="Live location"
            pinColor={colors.mapRoute}
          />
        ) : null}
        {routeCoordinates.length >= 2 ? (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor={colors.mapRoute}
            strokeWidth={4}
          />
        ) : null}
      </MapView>
    </View>
  );
};

export default DeliveryMap;
