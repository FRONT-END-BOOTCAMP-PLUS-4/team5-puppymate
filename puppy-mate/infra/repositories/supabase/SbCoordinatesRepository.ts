import { CourseCoordinate } from '@/domain/entities/CourseCoordinate';
import { CoordinateRepository } from '@/domain/repositories/CoordinateRepository';
import { createClient } from '@/utils/supabase/server';

export class SbCoordinatesRepository implements CoordinateRepository {
  async create(coordinates: CourseCoordinate[], courseId: number): Promise<void> {
    const supabase = await createClient();

    try {
      const { data, error } = await supabase.from('course_coordinates').insert(
        coordinates.map((coordinate, index) => ({
          course_id: courseId,
          lat: coordinate.lat,
          lng: coordinate.lng,
          point_order: index + 1,
        }))
      );

      if (error) {
        throw new Error('Failed to create coordinates');
      }

      return;
    } catch (error) {
      throw new Error('Failed to create coordinates');
    }
  }

  async findAllByCourseId(courseId: number): Promise<CourseCoordinate[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('course_coordinates')
      .select('*')
      .eq('course_id', courseId)
      .order('point_order', { ascending: true });

    if (error) {
      throw new Error('Failed to find coordinates');
    }

    return data.map((row: any) => ({
      id: row.id,
      courseId: row.course_id,
      lat: row.lat,
      lng: row.lng,
      pointOrder: row.point_order,
    })) as CourseCoordinate[];
  }
}
