import { CourseRepository } from '@/domain/repositories/CourseRepository';
import { CoordinateRepository } from '@/domain/repositories/CoordinateRepository';
import { CreateCourseDto } from '@/application/usecases/course/dto/CreateCourseDto';

export default class CreateCourseUsecase {
  private readonly courseRepository: CourseRepository;
  private readonly coordinateRepository: CoordinateRepository;

  constructor(courseRepository: CourseRepository, coordinateRepository: CoordinateRepository) {
    this.courseRepository = courseRepository;
    this.coordinateRepository = coordinateRepository;
  }

  async execute(createCourseDto: CreateCourseDto): Promise<{ courseId: number }> {
    const courseId = await this.courseRepository.create(createCourseDto);
    await this.coordinateRepository.create(createCourseDto.coordinates, courseId.id);
    return { courseId: courseId.id };
  }
}
