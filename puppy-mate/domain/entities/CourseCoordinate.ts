export class CourseCoordinate {
  constructor(
    public lat: number,
    public lng: number,
    public courseId?: number,
    public pointOrder?: number,
    public id?: number
  ) {}
}
