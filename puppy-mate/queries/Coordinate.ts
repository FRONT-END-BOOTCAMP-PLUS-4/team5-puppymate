import { getCourseCoordinates } from '@/api/coordinate';
import { CoordinateListDto } from '@/application/usecases/coordinate/dto/CoordinateListDto';
import { useQuery } from '@tanstack/react-query';

export const useCoordinatesQuery = (courseId: string) => {
  const coordinatesQuery = useQuery<CoordinateListDto>({
    queryKey: ['coordinate', courseId],
    queryFn: () => getCourseCoordinates(courseId),
    enabled: !!courseId // courseId가 있을 때만 실행되게
  });

  return {
    coordinatesQuery
  };
};
