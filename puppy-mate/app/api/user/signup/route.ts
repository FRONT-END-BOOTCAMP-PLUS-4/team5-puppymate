import { CreateUserDto } from '@/application/usecases/user/dto/CreateUserDto';
import CreateUserUsecase from '@/application/usecases/user/CreateUserUsecase';

import { SbUserRepository } from '@/infra/repositories/supabase/SbUserRepository';
import { SbStorageRepository } from '@/infra/repositories/supabase/SbStorageRepository';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const nickname = formData.get('nickname') as string;
    const image = formData.get('profileImage') as File | null;

    if (!email || !password || !nickname) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 422 });
    }

    const createUserDto: CreateUserDto = {
      email,
      password,
      nickname,
      profileImage: image || undefined,
    };

    const createUserUsecase = new CreateUserUsecase(
      new SbUserRepository(),
      new SbStorageRepository()
    );
    const newUser = await createUserUsecase.execute(createUserDto);

    return NextResponse.json({ userId: newUser.userId }, { status: 201 });
  } catch (error) {
    console.error('Error processing POST request:', error);
    return NextResponse.json(
      { message: 'Failed to create member', error },
      { status: 500 }
    );
  }
}
