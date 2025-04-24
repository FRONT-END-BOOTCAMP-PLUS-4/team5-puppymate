import { CoordinateDto } from '../course/dto/CoordinateDto';
import { CoordinateListDto } from './dto/CoordinateListDto';
import { CoordinateRepository } from '@/domain/repositories/CoordinateRepository';

export default class CoordinateListUsecase {
  private readonly coordinateRepository: CoordinateRepository;

  constructor(coordinateRepository: CoordinateRepository) {
    this.coordinateRepository = coordinateRepository;
  }

  async execute(courseId: number): Promise<CoordinateListDto> {
    const coordinates = await this.coordinateRepository.findAllByCourseId(
      courseId
    );

    const coordinateList = coordinates.map(
      coordinate => new CoordinateDto(coordinate.lat, coordinate.lng)
    );

    return new CoordinateListDto(coordinateList);
  }
}
