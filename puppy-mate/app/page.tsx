'use client';
import { useState, useEffect, useRef } from 'react';

import useKakaoLoader from '@/lib/use-kakao-loader';
import { Map } from '@/app/components/map/Map';
import { useCourseQuery } from '@/queries/Course';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';
import SaveCourseModal from '@/app/components/map/SaveCourseModal';
import useRecordingMapStore from '@/store/useRecordingMapStore';

import { CourseMarker, Location } from '@/types/Map';

// icons, buttons
import { BottomGPSButton } from '@/app/components/map/GPSIcon';
import { WalkStateToggle } from '@/app/components/map/WalkStateToggle';

// course list drawer
import CourseListDrawer from '@/app/components/post/CourseListDrawer';

// store
import useCoursesMapStore from '@/store/useCoursesMapStore';
import useDrawerSnapPointStore from '@/store/useDrawerSnapPoint';

export default function MapPage() {
  // 마커, 클러스터 표시할 코스들 가져오기
  const { coursesQuery } = useCourseQuery();
  // 현재 위치 가져오기
  const { location, error } = useCurrentLocation();
  // 맵 중앙 위치 설정
  const [mapCenterPosition, setMapCenterPosition] = useState<Location>({
    lat: 37.566535,
    lng: 126.977125,
  });
  const initialLocationSetRef = useRef(false);

  const handleGPSButtonClick = () => {
    if (location) {
      setMapCenterPosition({ lat: location.lat, lng: location.lng });
    }
  };

  const { isLoading: isCoursesLoading, data: courses, isError: isCoursesError, error: coursesError } = coursesQuery;
  useKakaoLoader();

  // 초기 위치 설정
  useEffect(() => {
    if (location && !initialLocationSetRef.current) {
      setMapCenterPosition({ lat: location.lat, lng: location.lng });
      initialLocationSetRef.current = true;
    }
  }, [location]);

  // 토글버튼 클릭 상태 관리
  const { isSavingCourse, startRecordingCourse } = useRecordingMapStore();
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

  const { appendCourseIds, clearCourseIds } = useCoursesMapStore();
  const courseCoordinates = useCoursesMapStore();
  // 클러스터 클릭혹은 바깥 클릭시 바텀 시트 스냅 포인트 변경
  // 경로 상세보기 코스 좌표들이 있으면 바텀 시트 고정
  const { snapPoints, setSnapPoint } = useDrawerSnapPointStore();

  const handleMarkerClick = (courseId: number) => {
    clearCourseIds();
    appendCourseIds([courseId]);
    setSnapPoint(snapPoints[1]);
  };

  // 클러스터 클릭시 바텀 시트에 표시될 게시물들의 코스 아이디 목록 설정
  const handleClusterclick = (target: kakao.maps.MarkerClusterer, cluster: kakao.maps.Cluster) => {
    const markers = cluster.getMarkers();
    const newCourseIds: number[] = [];
    markers.forEach((marker) => {
      // 클러스터안의 마커들의 courseId를 가져옴
      const courseId = (marker as CourseMarker).courseId;
      if (courseId) {
        newCourseIds.push(courseId);
      }
    });

    const uniqueCourseIds = Array.from(new Set(newCourseIds));
    clearCourseIds();
    appendCourseIds(uniqueCourseIds);
    setSnapPoint(snapPoints[1]);
  };

  // 경로 상세보기 눌렀을때 바텀 시트 내리기
  // 경로 상세보기 취소 했을때 바텀 시트 올리기
  // useEffect(() => {
  //   if (courseCoordinates.length > 0) {
  //     setSnapPoint(snapPoints[0]);
  //   } else {
  //     setSnapPoint(snapPoints[1]);
  //   }
  // }, [courseCoordinates]);

  return (
    <div className="relative w-screen h-screen">
      <>
        <div className="flex items-center gap-2 absolute top-4 left-4 z-20">
          <WalkStateToggle onToggle={handleToggleBtnClick} />
        </div>
        <Map
          currentLocation={location}
          courses={courses}
          onClusterclick={handleClusterclick}
          onMarkerClick={handleMarkerClick}
          mapCenterPosition={mapCenterPosition}
        />
      </>
      <BottomGPSButton onClick={handleGPSButtonClick} />
      {/* Modal 컴포넌트 */}
      <SaveCourseModal open={isCreateCourseModalOpen} onOpenChange={onModalOpenChange} />
      {/* Course List Drawer */}
      <CourseListDrawer />
    </div>
  );
}
