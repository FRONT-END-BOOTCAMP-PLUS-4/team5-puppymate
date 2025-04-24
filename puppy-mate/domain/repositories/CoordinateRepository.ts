import { CourseCoordinate } from '../entities/CourseCoordinate';

export interface CoordinateRepository {
  create(coordinates: CourseCoordinate[], courseId: number): Promise<void>;
  findAllByCourseId(courseId: number): Promise<CourseCoordinate[]>;
}
