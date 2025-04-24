import { PostImage } from '@/domain/entities/PostImage';
import { PostImageRepository } from '@/domain/repositories/PostImageRepository';
import { createClient } from '@/utils/supabase/server';

export class SbPostImageRepository implements PostImageRepository {
  async createMany(postImages: PostImage[]): Promise<number[]> {
    const supabase = await createClient();

    try {
      const { data, error } = await supabase
        .from('post_images')
        .insert(
          postImages.map(image => ({
            post_id: image.postId,
            image_url: image.imageUrl,
            order_index: image.orderIndex
          }))
        )
        .select('id');

      if (error) {
        console.error('Error creating post images:', error);
        throw new Error('Failed to create post images');
      }

      return data.map(item => item.id);
    } catch (error) {
      console.error('Error in createMany:', error);
      throw error;
    }
  }
  async findByPostId(postId: number): Promise<PostImage[]> {
    const supabase = await createClient();

    try {
      const { data, error } = await supabase
        .from('post_images')
        .select('*')
        .eq('post_id', postId)
        .order('order_index');

      if (error) {
        console.error('Error fetching post images:', error);
        throw new Error('Failed to fetch post images');
      }

      if (!data) return [];

      return data.map(
        item => new PostImage(item.id, postId, item.image_url, item.order_index)
      );
    } catch (error) {
      console.error('Error in findByPostId:', error);
      throw error;
    }
  }
}
