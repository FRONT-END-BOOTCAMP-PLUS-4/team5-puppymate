import { CourseRepository } from '@/domain/repositories/CourseRepository';
import { CourseListIsPublicDto } from './dto/CourseListIsPublicDto';

export default class CourseListIsPublicUsecase {
  private readonly courseRepository: CourseRepository;

  constructor(courseRepository: CourseRepository) {
    this.courseRepository = courseRepository;
  }

  async execute(): Promise<CourseListIsPublicDto[]> {
    const courses = await this.courseRepository.findByIsPublic();

    // 반환된 데이터를 CourseListIsPublicDto로 매핑
    const courseDtos = courses.map(
      (course) => new CourseListIsPublicDto(course.id, course.startPoint)
    );

    return courseDtos;
  }
}