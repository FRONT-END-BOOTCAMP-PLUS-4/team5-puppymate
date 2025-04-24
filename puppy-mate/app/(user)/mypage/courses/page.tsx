'use client';

import { useEffect, useState } from 'react';
import { getMyCourses } from '@/api/course';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { GetMyCoursesDto } from '@/application/usecases/course/dto/GetMyCoursesDto';
import SnapShotMap from '@/app/components/map/SnapShotMap';
import useKakaoLoader from '@/lib/use-kakao-loader';
import { useRouter } from 'next/navigation';

export default function MyCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<GetMyCoursesDto[]>([]);
  const [loading, setLoading] = useState(true);
  useKakaoLoader();
  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await getMyCourses();
        setCourses(data);
      } catch (error) {
        // 에러 처리 (필요시)
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);
  const handleBackMyPage = () => {
    router.push('/mypage');
  };
  if (loading) {
    // 로딩 시 Skeleton 카드 3개 표시
    return (
      <div className='space-y-4 p-4'>
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className='h-6 w-32 mb-2' />
              <Skeleton className='h-4 w-48' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-4 w-24 mb-1' />
              <Skeleton className='h-4 w-24 mb-1' />
              <Skeleton className='h-4 w-16' />
              <Skeleton className='h-40 w-full mt-2' /> {/* 지도 스켈레톤 */}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className='space-y-4 p-4'>
      <button
        onClick={handleBackMyPage}
        className='px-4 py-2 rounded bg-orange-600 text-white font-semibold shadow hover:bg-orange-700 transition'
      >
        {'←'}
      </button>
      {courses.length === 0 ? (
        <div className='text-center text-gray-500'>내 코스가 없습니다.</div>
      ) : (
        courses.map((course, idx) => {
          console.log('코스 경로확인 :', course.coordinates);

          return (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{course.name}</CardTitle>
                <CardDescription>{course.address}</CardDescription>
              </CardHeader>
              <CardContent className='space-y-1'>
                <div className='flex flex-row items-stretch gap-4'>
                  {/* 왼쪽: 텍스트 정보 */}
                  <div className='flex-1 flex flex-col justify-between py-2'>
                    <div>
                      <div>거리: {course.distance} km</div>
                      <div>소요 시간: {course.duration} 분</div>
                      <div>
                        공개 여부:{' '}
                        <span
                          className={
                            course.isPublic ? 'text-green-600' : 'text-gray-400'
                          }
                        >
                          {course.isPublic ? '공개' : '비공개'}
                        </span>
                      </div>
                    </div>
                    <div className='text-xs text-gray-400 mt-2'>
                      생성일:{' '}
                      {course.createdAt
                        ? new Date(course.createdAt).toLocaleDateString()
                        : '-'}
                    </div>
                  </div>
                  {/* 오른쪽: 지도 */}
                  {course.coordinates && (
                    <div
                      className='flex-shrink-0 flex items-center'
                      style={{ height: 200 }}
                    >
                      <SnapShotMap
                        coordinates={course.coordinates}
                        size={200}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
