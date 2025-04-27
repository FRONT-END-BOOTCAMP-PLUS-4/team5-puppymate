import { CoordinateDto } from '../../course/dto/CoordinateDto';

export class GetLikedPostWithSnapshotDto {
  constructor(
    public postId: number,
    public title: string,
    public content: string,
    public courseId: number,
    public address: string,
    public coordinates: CoordinateDto[],
    public createdAt: Date,
    public distance: number, // ← 추가
    public duration: number // ← 추가
  ) {}
}
