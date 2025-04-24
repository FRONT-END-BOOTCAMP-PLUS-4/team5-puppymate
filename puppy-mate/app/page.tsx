'use client';
import { useState, useEffect, useRef } from 'react';

import useKakaoLoader from '@/lib/use-kakao-loader';
import { Map } from '@/app/(map)/components/Map';
import { useCourseQuery } from '@/queries/Course';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import SaveCourseModal from '@/app/components/map/SaveCourseModal';
import useMapStore from '@/store/useMapStore';
import { CourseMarker, Location } from '@/types/Map';

// icons, buttons
import { BottomGPSButton } from '@/app/components/map/GPSIcon';
import { WalkStateToggle } from '@/app/(map)/components/WalkStateToggle';
import { Skeleton } from '@/components/ui/skeleton';

export default function MapPage() {
  const { coursesQuery } = useCourseQuery();
  const { location, error } = useCurrentLocation();
  const [mapCenterPosition, setMapCenterPosition] = useState<Location>({ lat: 37.566535, lng: 126.977125 });
  const initialLocationSetRef = useRef(false);

  const { isLoading, data: courses, isError, error: coursesError } = coursesQuery;
  useKakaoLoader();

  // 초기 위치 설정
  useEffect(() => {
    if (location && !initialLocationSetRef.current) {
      setMapCenterPosition({ lat: location.lat, lng: location.lng });
      initialLocationSetRef.current = true;
    }
  }, [location]);

  // 토긃버튼 클릭 상태 관리
  const { isSavingCourse, startRecordingCourse } = useMapStore();
  const handleToggleBtnClick = async () => {
    if (isSavingCourse) {
      setIsCreateCourseModalOpen(true);
    } else {
      startRecordingCourse(); // 시작
    }
  };

  // 코스 저장 모달 상태 관리
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  const onModalOpenChange = (open: boolean) => {
    setIsCreateCourseModalOpen(open);
  };

  // 클러스터 클릭 이벤트 핸들러
  const onClusterclick = (target: kakao.maps.MarkerClusterer, cluster: kakao.maps.Cluster) => {
    console.log(cluster);
    const markers = cluster.getMarkers();
    console.log('클러스터 안의 마커 ID 목록:');
    markers.forEach((marker) => {
      console.log((marker as CourseMarker).courseId); // ✅ 여기서 id 출력
    });
  };

  return (
    <div className="relative w-screen h-screen">
      <>
        <div className="flex items-center gap-2 absolute top-4 left-4 z-20">
          <WalkStateToggle onToggle={handleToggleBtnClick} />
        </div>
        <Map
          currentLocation={location}
          courses={courses}
          onClusterclick={onClusterclick}
          mapCenterPosition={mapCenterPosition}
        />
        <BottomGPSButton
          onClick={() => {
            setMapCenterPosition({ lat: location?.lat || 0, lng: location?.lng || 0 });
          }}
        />
      </>
      {/* Modal 컴포넌트 */}
      <SaveCourseModal open={isCreateCourseModalOpen} onOpenChange={onModalOpenChange} />
    </div>
  );
}
