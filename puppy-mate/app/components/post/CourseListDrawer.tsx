'use client';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerPortal } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import CoursePostList from '@/app/components/post/CoursePostList';
import { useCourseIdPostQuery } from '@/queries/CourseIdPost';
import { useRef, useEffect } from 'react';

import useCoursesMapStore from '@/store/useCoursesMapStore';
import useDrawerSnapPointStore from '@/store/useDrawerSnapPoint';
function CourseListDrawer() {
  const { courseIds, courseCoordinates, clearCourseCoordinates } = useCoursesMapStore();
  const { snapPoints, snapPoint, setSnapPoints, setSnapPoint } = useDrawerSnapPointStore();
  const { posts, isLoading, isError, errors } = useCourseIdPostQuery(courseIds);

  // 바텀 시트 바깥 클릭시 스냅 포인트 변경
  const drawerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        setSnapPoint(snapPoints[0]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // onSnapPointChange 함수 타입 수정
  const onSnapPointChange = (snapPoint: number | string | null) => {
    setSnapPoint(snapPoint as number);
  };

  return (
    <Drawer
      open={true}
      modal={false}
      direction="bottom"
      snapPoints={snapPoints}
      activeSnapPoint={snapPoint}
      setActiveSnapPoint={onSnapPointChange}>
      <DrawerPortal>
        <DrawerContent ref={drawerRef} className="h-full -translate-y-5">
          {courseCoordinates.length > 0 && (
            <div className="absolute -top-11 left-1/2 transform -translate-x-1/2 z-10">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border shadow-md"
                onClick={() => {
                  clearCourseCoordinates();
                  setSnapPoints([0.3, 0.7, 1]);
                  setSnapPoint(0.7);
                }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <DrawerHeader className="text-center">
            <DrawerTitle className="text-md font-medium">코스 {(posts || []).length}개</DrawerTitle>
          </DrawerHeader>
          <CoursePostList posts={posts} isLoading={isLoading} isError={isError} errors={errors} />
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}

export default CourseListDrawer;
