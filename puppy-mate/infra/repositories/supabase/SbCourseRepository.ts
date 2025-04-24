import { Course } from '@/domain/entities/Course';
import { CourseRepository } from '@/domain/repositories/CourseRepository';
import { createClient } from '@/utils/supabase/server';

export class SbCourseRepository implements CourseRepository {
  async findInBounds(
    southWestLat: number,
    southWestLng: number,
    northEastLat: number,
    northEastLng: number
  ): Promise<Course[]> {
    const supabase = await createClient();

    const query = supabase
      .from('course_coordinates')
      .select(
        `
                id,
                route_id,
                lat,
                lng,
                point_order,
                courses (*)
            `
      )
      .filter('courses.is_public', 'eq', true)
      .gte('lat', southWestLat)
      .lte('lat', northEastLat)
      .gte('lng', southWestLng)
      .lte('lng', northEastLng)
      .order('point_order', { ascending: true });

    const { data, error } = await query;

    if (error) {
      throw new Error('Method not implemented.');
    }

    return data.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      address: row.address,
      isPublic: row.is_public,
      distance: row.distance,
      duration: row.duration,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at), // Added updatedAt property
      coordinates: {
        lat: row.lat,
        lng: row.lng,
      },
    })) as Course[];
  }

  async findByIsPublic(): Promise<
    { id: number; startPoint: { lat: number; lng: number } }[]
  > {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('courses')
      .select(
        `
          id,
          course_coordinates (
            lat,
            lng
          )
        `
      )
      .eq('is_public', true);

    if (error) {
      console.error('Error finding public courses:', error);
      throw new Error('Failed to find public courses.');
    }

    return data.map((course: any) => {
      const startPoint = course.course_coordinates?.[0]; // Assuming the first coordinate is the start point
      return {
        id: course.id,
        startPoint: {
          lat: startPoint?.lat,
          lng: startPoint?.lng,
        },
      };
    });
  }
  async findById(id: number): Promise<Course | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('courses')
      .select(
        `
                id,
                user_id,
                name,
                address,
                is_public,
                distance,
                duration,
                created_at,
                updated_at
            `
      )
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error finding course by ID:', error);
      return null;
    }

    if (!data) return null;

    return new Course(
      data.id,
      data.user_id,
      data.name,
      data.address,
      data.is_public,
      data.distance,
      data.duration,
      new Date(data.created_at),
      new Date(data.updated_at)
    );
  }
  async findAllByUserId(userId: number): Promise<Course[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to fetch courses:', error);
      return [];
    }

    // data가 null일 수 있으니 기본값 처리
    return (data ?? []).map(
      (row: any) =>
        new Course(
          row.user_id, // userId
          row.name, // name
          row.address, // address
          row.distance, // distance
          row.duration, // duration
          row.id, // id (optional)
          row.is_public, // isPublic (optional)
          row.created_at ? new Date(row.created_at) : undefined, // createdAt (optional)
          row.updated_at ? new Date(row.updated_at) : undefined // updatedAt (optional)
        )
    );
  }

  async create(course: Course): Promise<{ id: number }> {
    const supabase = await createClient();

    try {
      // 1. courses 테이블에 경로 정보 저장
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .insert({
          user_id: course.userId,
          name: course.name,
          address: course.address,
          is_public: course.isPublic,
          distance: course.distance,
          duration: course.duration,
        })
        .select('id')
        .single();

      if (courseError) {
        console.error('Error inserting course:', courseError);
        throw new Error('Failed to insert course.');
      }
      // 3. 저장된 데이터를 반환
      return { id: courseData.id };
    } catch (error) {
      console.error('Error creating course:', error);
      throw new Error('Failed to create course.');
    }
  }

  async update(course: Course): Promise<Course> {
    // Implementation for updating a course
    throw new Error('Method not implemented.');
  }

  async updatePublic(id: number, flag: boolean): Promise<void> {
    const supabase = await createClient();
    try {
      const { error } = await supabase
        .from('courses')
        .update({ is_public: flag })
        .eq('id', id)
        .select('id');

      if (error) {
        console.error('Error updating is_public flag in supabase:', error);
        throw new Error('Failed to update is_public flag.');
      }
    } catch (error) {
      console.error('Error updating is_public course:', error);
      throw new Error('Failed to create course.');
    }
  }

  async delete(id: number): Promise<void> {
    // Implementation for deleting a course
    throw new Error('Method not implemented.');
  }
}
