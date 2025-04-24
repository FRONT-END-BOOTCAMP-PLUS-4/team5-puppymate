export const getCenterAndLevel = (coords: { lat: number; lng: number }[]) => {
  let minLat = coords[0].lat,
    maxLat = coords[0].lat;
  let minLng = coords[0].lng,
    maxLng = coords[0].lng;

  coords.forEach(({ lat, lng }) => {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  });

  const centerLat = (minLat + maxLat) / 2;
  const centerLng = (minLng + maxLng) / 2;

  const latDiff = maxLat - minLat;
  const lngDiff = maxLng - minLng;
  const maxDiff = Math.max(latDiff, lngDiff);

  let level = 3; // 기본 레벨
  if (maxDiff > 0.001) level = 4; // 약 100m
  if (maxDiff > 0.002) level = 5; // 약 200m
  if (maxDiff > 0.005) level = 6; // 약 500m
  if (maxDiff > 0.01) level = 7; // 약 1km
  if (maxDiff > 0.02) level = 8; // 약 2km
  if (maxDiff > 0.05) level = 9; // 약 5km
  if (maxDiff > 0.1) level = 10; // 약 10km
  if (maxDiff > 0.2) level = 11; // 약 20km

  return {
    center: { lat: centerLat, lng: centerLng },
    level,
  };
};
