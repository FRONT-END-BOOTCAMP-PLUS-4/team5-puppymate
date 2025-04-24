import { getPublicCourses } from '@/api/course';
import { CourseListIsPublicDto } from '@/application/usecases/course/dto/CourseListIsPublicDto';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
export const useCourseQuery = () => {
  const coursesQuery = useQuery<CourseListIsPublicDto[]>({
    queryKey: ['courses'],
    queryFn: async (): Promise<CourseListIsPublicDto[]> => {
      try {
        return await getPublicCourses();
      } catch (error) {
        console.error('Failed to fetch public courses:', error);
        throw error;
      }
    },
  });

  return {
    coursesQuery,
  };
};
