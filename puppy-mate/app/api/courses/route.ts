import { CourseListDto } from '@/application/usecases/course/dto/CourseListDto';
import { SbCourseRepository } from '@/infra/repositories/supabase/SbCourseRepository';
import { NextResponse, NextRequest } from 'next/server';
import CreateCourseUsecase from '@/application/usecases/course/CreateCourseUsecase';
import { SbCoordinatesRepository } from '@/infra/repositories/supabase/SbCoordinatesRepository';
import { CreateCourseDto } from '@/application/usecases/course/dto/CreateCourseDto';
import CourseListIsPublicUsecase from '@/application/usecases/course/CourseListIsPublicUsecase';
import { CourseListIsPublicDto } from '@/application/usecases/course/dto/CourseListIsPublicDto';

export async function GET() {
  try {
    const courseListUsecase = new CourseListIsPublicUsecase(new SbCourseRepository());

    const courseListIsPublicDto: CourseListIsPublicDto[] = await courseListUsecase.execute();
    return NextResponse.json(courseListIsPublicDto);
  } catch (error) {
    console.log('Error fetching course list:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, address, distance, duration, coordinates } = body;
    if (!name || address === undefined || !distance || !duration) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 422 });
    }
    const createCourseDto = new CreateCourseDto(1, name, address, distance, duration, coordinates);
    const createCourseUsecase = new CreateCourseUsecase(new SbCourseRepository(), new SbCoordinatesRepository());
    const newCourse = await createCourseUsecase.execute(createCourseDto);

    return NextResponse.json({ message: 'Course created successfully', newCourse }, { status: 201 });
  } catch (error) {
    console.log('Error create course:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// export async function GET(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams;
//     const southWestLat = searchParams.get('southWestLat');
//     const southWestLng = searchParams.get('southWestLng');
//     const northEastLat = searchParams.get('northEastLat');
//     const northEastLng = searchParams.get('northEastLng');

//     if (!southWestLat || !southWestLng || !northEastLat || !northEastLng) {
//       return NextResponse.json({ error: 'Invalid request' }, { status: 422 });
//     }

//     const courseListUsecase = new CourseListUsecase(new SbCourseRepository());

//     const courseListDto: CourseListDto = await courseListUsecase.execute(
//       parseFloat(southWestLat),
//       parseFloat(southWestLng),
//       parseFloat(northEastLat),
//       parseFloat(northEastLng)
//     );
//     return NextResponse.json(courseListDto);
//   } catch (error) {
//     console.log('Error fetching course list:', error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }
