import { CoordinateDto } from './CoordinateDto';
export class GetMyCoursesDto {
  constructor(
    public name: string,
    public address: string,
    public distance: number,
    public duration: number,
    public coordinates: CoordinateDto[],
    public isPublic?: boolean,
    public createdAt?: Date
  ) {}
}
