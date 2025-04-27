import { PostLikeRepository } from '@/domain/repositories/PostLikeRepository';
import { createClient } from '@/utils/supabase/server';
import { GetLikedPostWithSnapshotDto } from '@/application/usecases/postlike/dto/GetLikedPostWithSnapshotDto';
import { CoordinateDto } from '@/application/usecases/course/dto/CoordinateDto';

export class SbPostLikeRepository implements PostLikeRepository {
  // 내가 찜한 게시글 + 썸네일(좌표) 리스트
  async findLikedPostsWithSnapshot(
    userId: number
  ): Promise<GetLikedPostWithSnapshotDto[]> {
    const supabase = await createClient();

    try {
      const { data, error } = await supabase
        .from('post_likes')
        .select(
          `
          post_id,
          posts (
            id,
            title,
            content,
            course_id,
            created_at,
            courses (
              id,
              name,
              address,
              is_public,
              distance,
              duration,
              created_at,
              updated_at,
              course_coordinates (
                id,
                lat,
                lng,
                point_order
              )
            )
          )
        `
        )
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching liked posts with snapshot:', error);
        throw new Error('Failed to fetch liked posts with snapshot');
      }

      if (!data) return [];

      return data.map((item: any) => {
        const post = item.posts;
        const course = post?.courses;

        const coordinates =
          course?.course_coordinates?.map(
            (c: any) => new CoordinateDto(c.lat, c.lng)
          ) ?? [];

        return new GetLikedPostWithSnapshotDto(
          post.id,
          post.title,
          post.content,
          post.course_id,
          course.address || '주소 없음', // ✅ address 추가 (5번째 파라미터)
          coordinates,
          new Date(post.created_at),
          Math.round((course.distance / 1000) * 100) / 100,
          Math.floor(course.duration / 1000 / 60)
        );
      });
    } catch (error) {
      console.error('Error in findLikedPostsWithSnapshot:', error);
      throw error;
    }
  }

  async create(userId: number, postId: number): Promise<void> {
    const supabase = await createClient();

    try {
      const { error } = await supabase
        .from('post_likes')
        .insert({
          user_id: userId,
          post_id: postId,
        })
        .single();

      if (error) {
        console.error('Error creating post_like:', error);
        throw new Error('Failed to create post_like.');
      }
    } catch (error) {
      console.error('Error creating post_like:', error);
      throw new Error('Failed to create post_like.');
    }
  }

  async delete(userId: number, postId: number): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId);

    if (error) {
      console.error('Error deleting post:', error);
      return false;
    }

    return true;
  }

  async hasLiked(userId: number, postId: number): Promise<boolean> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .maybeSingle();

    if (error) {
      console.error('Error checking like status:', error);
      return false;
    }

    return !!data;
  }
}
