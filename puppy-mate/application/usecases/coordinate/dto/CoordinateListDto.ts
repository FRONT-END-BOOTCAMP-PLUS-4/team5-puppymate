import { CoordinateDto } from '../../course/dto/CoordinateDto';

export class CoordinateListDto {
  constructor(public coordinates: CoordinateDto[]) {}
}
