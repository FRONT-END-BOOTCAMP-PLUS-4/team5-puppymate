import { CreatePostDto } from '@/application/usecases/post/dto/CreatePostDto';
import CreatePostUsecase from '@/application/usecases/post/CreatePostUsecase';
import { SbCourseRepository } from '@/infra/repositories/supabase/SbCourseRepository';
import { SbPostRepository } from '@/infra/repositories/supabase/SbPostRepository';
import { NextRequest, NextResponse } from 'next/server';
import { SbPostImageRepository } from '@/infra/repositories/supabase/SbPostImageRepository';
import { SbStorageRepository } from '@/infra/repositories/supabase/SbStorageRepository';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const userId = Number(formData.get('userId'));
    const courseId = Number(formData.get('courseId'));
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const images = formData.getAll('images') as File[];

    const createPostDto = new CreatePostDto(
      userId,
      courseId,
      title,
      content,
      images
    );
    const createPostUsecase = new CreatePostUsecase(
      new SbPostRepository(),
      new SbCourseRepository(),
      new SbPostImageRepository(),
      new SbStorageRepository()
    );
    const newPostId = await createPostUsecase.execute(createPostDto);
    return NextResponse.json(
      { message: '게시물 작성이 완료되었습니다.', newPostId },
      { status: 201 }
    );
  } catch (error) {
    console.log('Error create Post:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
