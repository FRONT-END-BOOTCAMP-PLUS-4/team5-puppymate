import DeletePostUsecase from '@/application/usecases/post/DeletePostUsecase';
import { UpdatePostDto } from '@/application/usecases/post/dto/UpdatePostDto';
import GetPostUsecase from '@/application/usecases/post/GetPostUsecase';
import UpdatePostUsecase from '@/application/usecases/post/UpdatePostUsecase';
import { SbCoordinatesRepository } from '@/infra/repositories/supabase/SbCoordinatesRepository';
import { SbPostImageRepository } from '@/infra/repositories/supabase/SbPostImageRepository';
import { SbPostRepository } from '@/infra/repositories/supabase/SbPostRepository';
import { SbStorageRepository } from '@/infra/repositories/supabase/SbStorageRepository';
import { getUserIdFromRequest } from '@/utils/auth';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const userId = getUserIdFromRequest(request);
    let isWriter = false;
    if (!id) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 422 });
    }

    const getPostUsecase = new GetPostUsecase(
      new SbPostRepository(),
      new SbCoordinatesRepository(),
      new SbPostImageRepository(),
      new SbStorageRepository()
    );
    const postDto = await getPostUsecase.execute(id);
    if (!postDto) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    console.log(postDto.userId, 'reaquest', request, userId);
    if (userId && postDto.userId === userId) {
      isWriter = true;
    }

    return NextResponse.json(
      { data: { ...postDto, isWriter } },
      { status: 200 }
    );
  } catch (error) {
    console.log('Error read Post:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 1, id, title, content } = body;
    if (!userId || !id || !title) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 422 });
    }
    const createPostDto = new UpdatePostDto(title, content);
    const createPostUsecase = new UpdatePostUsecase(new SbPostRepository());
    const { postId, isSuccess } = await createPostUsecase.execute(
      id,
      createPostDto
    );
    return NextResponse.json(
      {
        message: '게시물이 수정되었습니다.',
        postId: postId,
        isSuccess: isSuccess
      },
      { status: 200 }
    );
  } catch (error) {
    console.log('Error create Post:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (!id) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 422 });
    }
    const deletePostUsecase = new DeletePostUsecase(new SbPostRepository());
    const { isSuccess } = await deletePostUsecase.execute(id);
    return NextResponse.json(
      {
        message: '게시물이 삭제되었습니다.',
        isSuccess: isSuccess
      },
      { status: 200 }
    );
  } catch (error) {
    console.log('Error delete Post:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
