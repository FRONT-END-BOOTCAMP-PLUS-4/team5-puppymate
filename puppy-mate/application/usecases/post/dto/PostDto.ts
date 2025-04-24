import { Post } from '@/domain/entities/Post';
import { CoordinateDto } from '../../course/dto/CoordinateDto';
import { CourseCoordinate } from '@/domain/entities/CourseCoordinate';
export class PostDto {
  userId: number;
  courseId: number;
  title: string;
  id?: number;
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
  coordinates: CoordinateDto[];
  images?: string[];
  isWriter: boolean;

  constructor(
    post: Post,
    coordinates: CourseCoordinate[],
    images: string[],
    isWriter: boolean
  ) {
    this.id = post.id;
    this.userId = post.userId;
    this.courseId = post.courseId;
    this.title = post.title;
    this.content = post.content;
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;
    this.coordinates = coordinates.map(
      coordinate => new CoordinateDto(coordinate.lat, coordinate.lng)
    );
    this.images = images;
    this.isWriter = isWriter;
  }
}
