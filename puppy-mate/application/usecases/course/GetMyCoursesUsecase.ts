import { CourseRepository } from '@/domain/repositories/CourseRepository';
import { CoordinateRepository } from '@/domain/repositories/CoordinateRepository';
import { GetMyCoursesDto } from './dto/GetMyCoursesDto';
import { Course } from '@/domain/entities/Course';

export default class GetMyCoursesUsecase {
  private readonly courseRepository: CourseRepository;
  private readonly coordinateRepository: CoordinateRepository;

  constructor(
    courseRepository: CourseRepository,
    coordinateRepository: CoordinateRepository
  ) {
    this.courseRepository = courseRepository;
    this.coordinateRepository = coordinateRepository;
  }

  async execute(userId: number): Promise<GetMyCoursesDto[]> {
    const myCourses: Course[] = await this.courseRepository.findAllByUserId(
      userId
    );

    // 각 코스별로 coordinates를 비동기로 조회해서 DTO로 변환
    const dtoPromises = myCourses.map(async (course) => {
      // 좌표 배열 조회
      const coordinates = await this.coordinateRepository.findAllByCourseId(
        course.id || 0
      );

      // {lat, lng} 형태로 변환 (필요하다면)
      const coords = coordinates.map((coord) => ({
        lat: coord.lat,
        lng: coord.lng,
      }));

      return new GetMyCoursesDto(
        course.name,
        course.address,
        course.distance,
        Math.floor(course.duration / 60),
        coords,
        course.isPublic,
        course.createdAt
      );
    });

    // 모든 DTO 비동기 생성 결과를 병렬로 반환
    return Promise.all(dtoPromises);
  }
}
