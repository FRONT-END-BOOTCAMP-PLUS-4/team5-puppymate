'use client';

import { Map, MapMarker, Polyline } from 'react-kakao-maps-sdk';
import useKakaoLoader from './lib/use-kakao-loader';
import { useCurrentLocation } from './hooks/useCurrentLocation';
import { useEffect, useState } from 'react';

export default function BasicMap() {
  useKakaoLoader();
  const { location, error } = useCurrentLocation();
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 37.5665,
    lng: 126.978,
  });
  const [path, setPath] = useState<{ lat: number; lng: number }[]>([]); // 폴리라인 경로

  useEffect(() => {
    if (location) {
      setMapCenter(location); // 위치가 변경될 때마다 지도 중심 업데이트
      setPath((prevPath) => [...prevPath, location]); // 경로에 새로운 위치 추가
    }
  }, [location]);

  if (error) {
    return <div>위치 정보를 가져올 수 없습니다: {error}</div>;
  }

  return (
    <Map
      id="map"
      center={mapCenter}
      style={{
        width: '100%',
        height: '350px',
      }}
      level={3} // 지도의 확대 레벨
    >
      {location && (
        <>
          {/* 현재 위치에 마커 표시 */}
          <MapMarker position={location} />

          {/* 이동 경로를 따라 폴리라인 그리기 */}
          <Polyline
            path={path} // 폴리라인 경로
            strokeWeight={5} // 선 두께
            strokeColor="#FF0000" // 선 색상
            strokeOpacity={0.8} // 선 투명도
            strokeStyle="solid" // 선 스타일
          />
        </>
      )}
    </Map>
  );
}