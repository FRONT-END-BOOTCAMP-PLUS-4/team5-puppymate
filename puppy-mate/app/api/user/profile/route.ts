import { NextRequest, NextResponse } from 'next/server';
import GetUserUsecase from '@/application/usecases/user/GetUserUsecase';
import { SbUserRepository } from '@/infra/repositories/supabase/SbUserRepository';
import { SbStorageRepository } from '@/infra/repositories/supabase/SbStorageRepository';
import { getUserIdFromRequest } from '@/utils/auth';

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    // 3. 유즈케이스 실행
    const getUserUsecase = new GetUserUsecase(
      new SbUserRepository(),
      new SbStorageRepository()
    );
    const getUserDto = await getUserUsecase.execute(userId);
    if (!getUserDto) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    console.log('여기 확인', getUserDto.profileImage);
    // 4. 유저 정보 응답
    return NextResponse.json(getUserDto, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return NextResponse.json(
      { message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
