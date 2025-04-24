'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getUserProfile, logoutUser } from '@/api/user'; // logoutUser 추가
import { useRouter } from 'next/navigation';
import { GetUserDto } from '@/application/usecases/user/dto/GetUserDto';

export default function MyPage() {
  const [profile, setProfile] = useState<GetUserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  console.log('dd', profile?.profileImage);
  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  // 로그아웃 핸들러
  const handleLogout = () => {
    logoutUser();
    router.push('/login'); // 로그아웃 후 로그인 페이지로 이동
  };
  const handleBackMainPage = () => {
    router.push('/'); // 메인 페이지로 이동
  };

  if (loading) {
    return (
      <div className='p-6 space-y-4'>
        <Skeleton className='w-24 h-24 rounded-full' />
        <Skeleton className='w-32 h-6' />
        <div className='space-y-2'>
          <Skeleton className='h-20' />
          <Skeleton className='h-20' />
          <Skeleton className='h-20' />
        </div>
      </div>
    );
  }

  return (
    <div className='p-6 space-y-6'>
      {/* 상단: 프로필 + 로그아웃/메인으로 버튼 */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <div className='relative w-24 h-24'>
            <Image
              src={profile?.profileImage || '/default-profile.png'}
              alt='Profile'
              fill
              className='rounded-full object-cover'
            />
          </div>
          <div className='text-xl font-semibold'>{profile?.nickname}</div>
        </div>
        {/* 오른쪽 버튼 2개를 flex로 묶기 */}
        <div className='flex gap-2'>
          <button
            onClick={handleBackMainPage}
            className='px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition'
          >
            {'← 메인으로'}
          </button>
          <button
            onClick={handleLogout}
            className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition'
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* 관리 카드들: 한 줄에 하나씩(세로 배치) */}
      <div className='grid grid-cols-1 gap-4'>
        <Card
          onClick={() => router.push('/mypage/courses')}
          className='cursor-pointer hover:shadow-md transition'
        >
          <CardContent className='p-6 text-center text-lg font-medium'>
            내 산책로 관리
          </CardContent>
        </Card>
        <Card
          onClick={() => router.push('/mypage/likes')}
          className='cursor-pointer hover:shadow-md transition'
        >
          <CardContent className='p-6 text-center text-lg font-medium'>
            찜 산책로 관리
          </CardContent>
        </Card>
        <Card
          onClick={() => router.push('/mypage/posts')}
          className='cursor-pointer hover:shadow-md transition'
        >
          <CardContent className='p-6 text-center text-lg font-medium'>
            내 포스트 관리
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
