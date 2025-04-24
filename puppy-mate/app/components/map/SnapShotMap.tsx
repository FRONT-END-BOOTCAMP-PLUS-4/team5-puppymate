'use client';
import { Map, Polyline, MapProps } from 'react-kakao-maps-sdk';
import { getCenterAndLevel } from '@/utils/map/getCenterAndLevel';

export default function SnapShotMap({
  coordinates = [{ lat: 37.566535, lng: 126.977125 }],
  size = 300,
  
}: {
  coordinates: { lat: number; lng: number }[];
  size: number;
}) {
  const { center, level } = getCenterAndLevel(coordinates);

  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className='overflow-auto mx-auto'
    >
      <Map
        className='w-full h-full bg-gray-100 rounded'
        center={center}
        level={level}
        draggable={false}
        zoomable={false}
        disableDoubleClick={true}
        disableDoubleClickZoom={true}
      >
        <Polyline
          path={coordinates} // 폴리라인 경로
          strokeWeight={5} // 선 두께
          strokeColor='#FF0000' // 선 색상
          strokeOpacity={0.8} // 선 투명도
          strokeStyle='solid' // 선 스타일
        />
      </Map>
    </div>
  );
}
