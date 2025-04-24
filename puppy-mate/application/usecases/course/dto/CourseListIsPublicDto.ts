export class CourseListIsPublicDto {
  constructor(
    public id: number,
    public startPoint: { lat: number; lng: number }
  ) {}
}
