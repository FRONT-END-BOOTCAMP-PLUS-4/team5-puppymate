'use client';

import { useEffect, useState } from 'react';
import { getLikedPostsWithSnapshot } from '@/api/mypage';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import SnapShotMap from '@/app/components/map/SnapShotMap';
import useKakaoLoader from '@/lib/use-kakao-loader';
import { useRouter } from 'next/navigation';
import { GetLikedPostWithSnapshotDto } from '@/application/usecases/postlike/dto/GetLikedPostWithSnapshotDto';
import { formatDate } from '@/utils/common';
import Mypageheader from '../components/Mypageheader';
import { CiCalendar } from 'react-icons/ci';
import { IoLocationOutline } from 'react-icons/io5';
import { LuTimer } from 'react-icons/lu';
import { FaShoePrints, FaRegHeart, FaMapMarkerAlt } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { LatLng } from '@/types/Map';
import useCoursesMapStore from '@/store/useCoursesMapStore';

export default function LikedPostsPage() {
  const router = useRouter();
  const [likedPosts, setLikedPosts] = useState<GetLikedPostWithSnapshotDto[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const { setCourseCoordinates, clearCourseCoordinates } = useCoursesMapStore();

  useKakaoLoader();

  useEffect(() => {
    async function fetchLikedPosts() {
      try {
        const data = await getLikedPostsWithSnapshot();
        setLikedPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchLikedPosts();
  }, []);

  const handleFollowBtnClick = (e: React.MouseEvent, coordinates: LatLng[]) => {
    e.stopPropagation();
    router.push('/');
    clearCourseCoordinates();
    setCourseCoordinates(coordinates);
  };

  const handleCardClick = (postId: number) => {
    router.push(`/post/${postId}`);
  };

  if (loading) {
    return (
      <div className='space-y-4 p-4'>
        <Skeleton className='h-4 w-24 mb-1' />
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
              <Skeleton className='h-40 w-full mt-2' />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <Mypageheader title='찜 산책로' />
      <div className='space-y-4 p-4'>
        {likedPosts.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-24 text-gray-500'>
            <FaRegHeart size={52} className='text-orange-300 mb-4' />
            <p className='text-center text-lg font-medium'>
              찜한 게시글이 없습니다
            </p>
            <p className='text-sm mt-1'>마음에 드는 게시글을 찜해보세요</p>
          </div>
        ) : (
          likedPosts.map((post) => (
            <Card
              key={post.postId}
              className='overflow-hidden rounded-2xl py-0 shadow-sm border border-orange-200 transition-all hover:shadow-md bg-white cursor-pointer'
              onClick={() => handleCardClick(post.postId)}
            >
              <CardHeader className='bg-gradient-to-r py-4 from-orange-50 to-orange-100 pb-3'>
                <CardTitle className='text-lg font-semibold text-orange-700'>
                  {post.title}
                </CardTitle>
                <CardDescription className='text-sm text-gray-600 flex items-center gap-1'>
                  <IoLocationOutline size={16} />
                  {post.address || '주소 정보 없음'}
                </CardDescription>
              </CardHeader>

              <CardContent className='p-4'>
                <div className='flex flex-col md:flex-row gap-4'>
                  <div className='flex-1 space-y-2 text-sm text-gray-700 content-center'>
                    <div className='flex items-center gap-2'>
                      <FaShoePrints className='text-xl rotate-[-90deg] text-orange-400' />
                      <span>
                        거리: {Math.round(post.distance * 10) / 10} km
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <LuTimer className='text-xl text-orange-400' />
                      <span>소요 시간: {post.duration} 분</span>
                    </div>
                    <div className='flex items-center gap-2 text-xs text-gray-500 mt-1'>
                      <CiCalendar className='text-xl text-orange-400' />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>

                  {post.coordinates?.length > 0 && (
                    <SnapShotMap coordinates={post.coordinates} size={150} />
                  )}
                </div>
              </CardContent>

              <CardFooter className='[.border-t]:pt-4 items-center flex flex-col gap-2 p-4 border-t border-orange-100'>
                <Button
                  onClick={(e) => handleFollowBtnClick(e, post.coordinates)}
                  variant='outline'
                  className='w-full border-orange-300 text-orange-600 hover:bg-orange-50 hover:text-orange-700 flex items-center justify-center gap-2 rounded-xl'
                >
                  <FaMapMarkerAlt />
                  코스 따라가기
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
