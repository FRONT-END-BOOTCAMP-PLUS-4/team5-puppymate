'use client';

import { useEffect, useState } from 'react';
import { Location } from '@/types/Map';

export const useCurrentLocation = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }
    // 현재 위치 가져오기
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const newLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          heading: pos.coords.heading,
        };
        setLocation(newLocation);
      },
      (err) => {
        setError(err.message);
      },
      {
        enableHighAccuracy: true, // 높은 정확도 요청
        maximumAge: 0, // 캐시된 위치 사용 안 함
        timeout: 100000, // 위치 요청 타임아웃
      }
    );

    // 컴포넌트 언마운트 시 watchPosition 정리
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { location, error };
};
