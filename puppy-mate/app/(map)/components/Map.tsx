'use client';
import { Map as KakaoMap, MapMarker, MarkerClusterer, Polyline, CustomOverlayMap } from 'react-kakao-maps-sdk';
import { useRef, useEffect } from 'react';
import useMapStore from '@/store/useMapStore';
import { getDistance } from '@/utils/map/getDistance';
import { CourseListIsPublicDto } from '@/application/usecases/course/dto/CourseListIsPublicDto';
import { Location, CourseMarker } from '@/types/Map';
import { CurrentLocationIcon } from '@/app/components/map/GPSIcon';

export function Map({
  currentLocation,
  courses,
  onClusterclick,
  mapCenterPosition,
}: {
  currentLocation: Location | null;
  courses: CourseListIsPublicDto[] | undefined;
  onClusterclick: (target: kakao.maps.MarkerClusterer, cluster: kakao.maps.Cluster) => void;
  mapCenterPosition: Location;
}) {
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const { coordinates, addCoursePoint, isSavingCourse } = useMapStore();

  // 테스트를 위한 더미 데이터
  // const dummyPath = [
  //   { lat: 37.56421035025637, lng: 127.00767976641002 },
  //   { lat: 37.56431035025637, lng: 127.00777976641002 },
  //   { lat: 37.56441035025637, lng: 127.00787976641002 },
  //   { lat: 37.56451035025637, lng: 127.00797976641002 },
  //   { lat: 37.56461035025637, lng: 127.00807976641002 },
  //   { lat: 37.56471035025637, lng: 127.00817976641002 },
  //   { lat: 37.56481035025637, lng: 127.00827976641002 },
  //   { lat: 37.56491035025637, lng: 127.00837976641002 },
  //   { lat: 37.56501035025637, lng: 127.00847976641002 },
  //   { lat: 37.56511035025637, lng: 127.00857976641002 },
  // ];
  // dummyPath.forEach((point) => {
  //   addCoursePoint(point);
  // });

  // useEffect(() => {
  //   coordinates.push(...dummyPath);
  // }, []);

  // 현재 위치 바뀔때 마다 맵 중심 위치 설정
  useEffect(() => {
    if (!mapRef.current) return;

    if (currentLocation) {
      mapRef.current.setCenter(new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng));
    }
  }, [currentLocation]);

  // mapCenterPosition 바뀔때 마다 맵 중심 위치 설정
  useEffect(() => {
    if (!mapRef.current) return;

    if (mapCenterPosition) {
      mapRef.current.setCenter(new kakao.maps.LatLng(mapCenterPosition.lat, mapCenterPosition.lng));
    }
  }, [mapCenterPosition]);

  // 현재 위치 바뀔때 마다 경로 추가
  useEffect(() => {
    if (isSavingCourse && currentLocation) {
      const lastPosition = coordinates.at(-1);
      if (!lastPosition || getDistance(lastPosition, currentLocation) > 1) {
        addCoursePoint(currentLocation); // 경로 저장
      }
    }
  }, [currentLocation, isSavingCourse]);

  return (
    <div className="h-full w-full">
      <KakaoMap
        id="map"
        className="w-full h-full"
        ref={mapRef}
        center={mapCenterPosition}
        level={3} // 지도의 확대 레벨
      >
        {currentLocation && (
          <>
            <CustomOverlayMap position={currentLocation}>
              <CurrentLocationIcon heading={currentLocation.heading || null} />
              {/* 현재 위치에 마커 표시 */}
            </CustomOverlayMap>
            {/* 이동 경로를 따라 폴리라인 그리기 */}
            {isSavingCourse && (
              <Polyline
                path={coordinates} // 폴리라인 경로
                strokeWeight={5} // 선 두께
                strokeColor="#FF0000" // 선 색상
                strokeOpacity={0.8} // 선 투명도
                strokeStyle="solid" // 선 스타일
              />
            )}
          </>
        )}
        {courses && (
          <MarkerClusterer
            averageCenter={true} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
            minLevel={5} // 클러스터 할 최소 지도 레벨
            disableClickZoom={true} // 클러스터 마커를 클릭했을 때 지도가 확대되지 않도록 설정한다
            // 마커 클러스터러에 클릭이벤트를 등록합니다
            // 마커 클러스터러를 생성할 때 disableClickZoom을 true로 설정하지 않은 경우
            // 이벤트 헨들러로 cluster 객체가 넘어오지 않을 수도 있습니다
            onClusterclick={onClusterclick}>
            {courses.map((pos) => (
              <MapMarker
                key={pos.id}
                position={{
                  lat: pos.startPoint.lat,
                  lng: pos.startPoint.lng,
                }}
                onCreate={(marker) => {
                  (marker as CourseMarker).courseId = pos.id; // ✅ 각 marker 객체에 id 직접 부여
                }}
              />
            ))}
          </MarkerClusterer>
        )}
      </KakaoMap>
    </div>
  );
}
