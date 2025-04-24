import { Post } from '@/domain/entities/Post';
import { PostRepository } from '@/domain/repositories/PostRepository';
import { createClient } from '@/utils/supabase/server';

export class SbPostRepository implements PostRepository {
  async create(post: Post): Promise<number> {
    const supabase = await createClient();

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: post.userId,
          course_id: post.courseId,
          title: post.title,
          content: post.content,
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating post:', error);
        throw new Error('Failed to create post.');
      }

      return data.id;
    } catch (error) {
      console.error('Error creating post:', error);
      throw new Error('Failed to create post.');
    }
  }

  async findById(id: number): Promise<Post | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('posts')
      .select(
        `
        id,
        user_id,
        course_id,
        title,
        content,
        created_at,
        updated_at
      `
      )
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error finding post by ID:', error);
      return null;
    }

    if (!data) return null;

    return new Post(
      data.id,
      data.user_id,
      data.course_id,
      data.title,
      data.content,
      new Date(data.created_at),
      new Date(data.updated_at)
    );
  }

  async findAll(): Promise<Post[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('posts')
      .select(
        `
        id,
        user_id,
        course_id,
        title,
        content,
        created_at,
        updated_at
      `
      );

    if (error) {
      console.error('Error finding all posts:', error);
      throw new Error('Failed to fetch posts.');
    }

    return data.map((row: any) => {
      return new Post(
        row.id,
        row.user_id,
        row.course_id,
        row.title,
        row.content,
        new Date(row.created_at),
        new Date(row.updated_at)
      );
    });
  }

  async findByUserId(userId: number): Promise<Post[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('posts')
      .select(
        `
        id,
        user_id,
        course_id,
        title,
        content,
        created_at,
        updated_at
      `
      )
      .eq('user_id', userId);

    if (error) {
      console.error('Error finding posts by user ID:', error);
      throw new Error('Failed to fetch posts.');
    }

    return data.map((row: any) => {
      return new Post(
        row.id,
        row.user_id,
        row.course_id,
        row.title,
        row.content,
        new Date(row.created_at),
        new Date(row.updated_at)
      );
    });
  }

  async update(id: number, updatedPost: Partial<Post>): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
      .from('posts')
      .update({
        title: updatedPost.title,
        content: updatedPost.content,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating post:', error);
      return false;
    }

    return true;
  }

  async delete(id: number): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase.from('posts').delete().eq('id', id);

    if (error) {
      console.error('Error deleting post:', error);
      return false;
    }

    return true;
  }
}