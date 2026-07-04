import {useEffect, useState} from 'react';

import {getCurrentPositionSafe} from '@helpers/locationHelpers';

import type {GeoPoint} from '@Types/deliveryTypes';

export const useUserLocation = () => {
  const [location, setLocation] = useState<GeoPoint | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const point = await getCurrentPositionSafe();
      if (mounted) {
        setLocation(point);
        setLoading(false);
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  return {location, loading};
};
