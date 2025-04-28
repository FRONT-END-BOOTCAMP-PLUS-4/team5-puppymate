'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMyPosts } from '@/api/mypage';
import { GetMyPostsDto } from '@/application/usecases/post/dto/GetMyPostsDto';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import SnapShotMap from '@/app/components/map/SnapShotMap';
import useKakaoLoader from '@/lib/use-kakao-loader';
import { Button } from '@/components/ui/button';
import { CiCalendar } from 'react-icons/ci';
import { IoLocationOutline } from 'react-icons/io5';
import { LuTimer } from 'react-icons/lu';
import { FaShoePrints, FaRegHeart } from 'react-icons/fa';
import Mypageheader from '../components/Mypageheader';
import { formatDate } from '@/utils/common';

export default function MyPostsPage() {
  const router = useRouter();
  const [myPosts, setMyPosts] = useState<GetMyPostsDto[]>([]);
  const [loading, setLoading] = useState(true);
  useKakaoLoader();

  useEffect(() => {
    async function fetchMyPosts() {
      try {
        const data = await getMyPosts();
        setMyPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchMyPosts();
  }, []);

  const handleCardClick = (postId: number) => {
    router.push(`/post/${postId}`);
  };

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-4 w-24 mb-1" />
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-40 w-full mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <>
      <Mypageheader title="내 게시물" />
      <div className="space-y-4 p-4">
        {myPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500">
            <FaRegHeart size={52} className="text-orange-300 mb-4" />
            <p className="text-center text-lg font-medium">
              작성한 게시글이 없습니다
            </p>
            <p className="text-sm mt-1">산책로를 등록해보세요</p>
          </div>
        ) : (
          myPosts.map((post) => (
            <Card
              key={post.postId}
              className="overflow-hidden rounded-2xl py-0 shadow-sm border border-orange-200 transition-all hover:shadow-md bg-white cursor-pointer"
              onClick={() => handleCardClick(post.postId)}
            >
              <CardHeader className="bg-gradient-to-r py-4 from-orange-50 to-orange-100 pb-3">
                <CardTitle className="text-lg font-semibold text-orange-700">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 flex items-center gap-1">
                  <IoLocationOutline size={16} />
                  {post.address || '주소 정보 없음'}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-2 text-sm text-gray-700 content-center">
                    <div className="flex items-center gap-2">
                      <FaShoePrints className="text-xl rotate-[-90deg] text-orange-400" />
                      <span>거리: {Math.round(post.distance * 10) / 10} km</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <LuTimer className="text-xl text-orange-400" />
                      <span>소요 시간: {post.duration} 분</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    {post.content
                      ? (post.content.length > 40
                          ? `${post.content.slice(0, 40)}...`
                          : post.content)
                      : '내용 없음'}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <CiCalendar className="text-xl text-orange-400" />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </div>

                  {post.coordinates?.length > 0 && (
                    <SnapShotMap coordinates={post.coordinates} size={150} />
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
