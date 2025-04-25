'use client';

import { Heart, MapPin, Calendar } from 'lucide-react';
import SnapShotMap from '../map/SnapShotMap';
import { LatLng } from '@/types/Map';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import useCoursesMapStore from '@/store/useCoursesMapStore';
import { Skeleton } from '@/components/ui/skeleton';
import useDrawerSnapPointStore from '@/store/useDrawerSnapPoint';

interface CoursePostItemProps {
  id: number;
  likes: number;
  title: string;
  createdAt: string;
  totalDistance: number;
  duration: number;
  username: string;
  address: string;
  coordinates: LatLng[];
}

const CoursePostItem = ({
  id,
  likes,
  title,
  createdAt,
  totalDistance,
  duration,
  username,
  address,
  coordinates,
}: CoursePostItemProps) => {
  // Format totalDistance to display only up to 2 decimal places
  const formattedDistance = totalDistance.toFixed(1);
  const formattedDate = new Date(createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // 카드 내용 클릭시 포스트 상세 보기 페이지 이동
  const router = useRouter();

  const handleCardContentClick = () => {
    router.push(`/post/${id}`);
  };

  // 경로 상세보기 누를때 zustand Store에 좌표들 저장, snapPoints 변경 (0.3 으로 고정)
  const { setSnapPoint, setSnapPoints, snapPoints } = useDrawerSnapPointStore();
  const { setCourseCoordinates, clearCourseCoordinates } = useCoursesMapStore();
  const handleRouteDetailClick = () => {
    clearCourseCoordinates();
    setCourseCoordinates(coordinates);
    setSnapPoint(snapPoints[0]);
    setSnapPoints([snapPoints[0], snapPoints[0], snapPoints[0]]);
  };

  // 경로 상세보기 누를때 바텀 시트 스냅 포인트 변경

  return (
    <Card className="w-full p-4">
      <Tooltip>
        <TooltipTrigger asChild>
          <CardContent className="flex-1 flex flex-col gap-1 p-0 cursor-pointer" onClick={handleCardContentClick}>
            <div className="flex gap-4 justify-between">
              <div>
                <div className="font-semibold text-lg text-ellipsis line-clamp-1">{title}</div>
                {/* text-muted-foreground 는 shadcn 에서 설정한 secondary text 색상  (약간 어두운 회색)*/}
                <div className="text-sm mt-1 text-muted-foreground">
                  {username} • {formattedDate}
                </div>
                <div className="text-sm text-muted-foreground line-clamp-1">{address}</div>

                <div className="text-muted-foreground text-sm">
                  {formattedDistance} km • {Math.round(duration / 60)} 분
                </div>
                <div>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Heart className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                    {likes}
                  </div>
                </div>
              </div>
              <div className="w-[110px] h-[110px] rounded-xl overflow-hidden shadow-md">
                <SnapShotMap coordinates={coordinates} size={110} />
              </div>
            </div>
          </CardContent>
        </TooltipTrigger>
        <TooltipContent>포스트 페이지 이동</TooltipContent>
      </Tooltip>
      <CardFooter className="p-0 m-0">
        <Button variant="outline" className="w-full text-sm cursor-pointer" onClick={handleRouteDetailClick}>
          경로 상세 보기
        </Button>
      </CardFooter>
    </Card>
  );
};

export const CoursePostItemSkeleton = () => {
  return (
    <div className="w-full p-4">
      <div className="flex gap-4 justify-between">
        <div className="flex-1 flex flex-col gap-1">
          <Skeleton className="h-6 w-3/4 mb-1" />
          <Skeleton className="h-4 w-1/2 mt-1" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="w-[110px] h-[110px] rounded-xl" />
      </div>
      <Skeleton className="h-9 w-full mt-4" />
    </div>
  );
};

export default CoursePostItem;
