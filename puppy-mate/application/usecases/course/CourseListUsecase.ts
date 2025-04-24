import { CourseRepository } from '@/domain/repositories/CourseRepository';
import { CourseListDto } from './dto/CourseListDto';

export default class CourseListUsecase {
    private readonly courseRepository: CourseRepository;

    constructor(courseRepository: CourseRepository) {
        this.courseRepository = courseRepository;
    }

    async execute(
        southWestLat: number,
        southWestLng: number,
        northEastLat: number,
        northEastLng: number
    ): Promise<CourseListDto> {
        const courses = await this.courseRepository.findInBounds(
            southWestLat,
            southWestLng,
            northEastLat,
            northEastLng
        );
        return { courses } as CourseListDto;
    }
}
