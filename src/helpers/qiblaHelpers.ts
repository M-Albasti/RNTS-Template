/** Kaaba coordinates (Masjid al-Haram, Makkah). */
export const KAABA_LATITUDE = 21.4225;
export const KAABA_LONGITUDE = 39.8262;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
const toDegrees = (radians: number) => (radians * 180) / Math.PI;

/**
 * Forward azimuth (degrees 0–360) from the user to the Kaaba.
 * 0 = North, 90 = East.
 */
export const getQiblaBearingDegrees = (
  latitude: number,
  longitude: number,
): number => {
  const φ1 = toRadians(latitude);
  const φ2 = toRadians(KAABA_LATITUDE);
  const Δλ = toRadians(KAABA_LONGITUDE - longitude);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  return (toDegrees(θ) + 360) % 360;
};

/** Shortest signed turn from device heading to qibla bearing (−180…180). */
export const getQiblaNeedleRotation = (
  qiblaBearing: number,
  deviceHeading: number,
): number => {
  let delta = qiblaBearing - deviceHeading;
  while (delta > 180) {
    delta -= 360;
  }
  while (delta < -180) {
    delta += 360;
  }
  return delta;
};

export const formatBearingLabel = (degrees: number): string =>
  `${Math.round(((degrees % 360) + 360) % 360)}°`;
