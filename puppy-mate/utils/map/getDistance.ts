// utils/getDistance.ts
import { LatLng } from '@/store/useMapStore';
export function getDistance(prePostion: LatLng, currentPostion: LatLng): number {
  const R = 6371000; // Earth radius in meters
  const toRad = (deg: number) => deg * (Math.PI / 180);
  const dLat = toRad(prePostion.lat - currentPostion.lat);
  const dLon = toRad(prePostion.lng - currentPostion.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(prePostion.lat)) * Math.cos(toRad(currentPostion.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // meters
}
