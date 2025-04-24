import { LoginUserDto } from '@/application/usecases/user/dto/LoginUserDto';
import LoginUserUsecase from '@/application/usecases/user/LoginUserUseCase';

import { SbUserRepository } from '@/infra/repositories/supabase/SbUserRepository';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 422 });
    }

    const loginUserDto: LoginUserDto = { email, password };
    const loginUserUsecase = new LoginUserUsecase(new SbUserRepository());
    const user = await loginUserUsecase.execute(loginUserDto);
    console.log(' usecase:', user);
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    const token = jwt.sign(
      { userId: user.id, email }, // payload
      process.env.JWT_SECRET!, // 시크릿 키 (환경 변수)
      { expiresIn: '3h' } // 토큰 만료 시간
    );
    //usecase -> route -> api -> page(userId 체크 확인)
    return NextResponse.json({ userId: user.id, token }, { status: 200 });
  } catch (error) {
    console.error('Error processing POST request:', error);
    return NextResponse.json({ message: 'Failed to login' }, { status: 500 });
  }
}
