import { User } from '@/domain/entities/User';
import bcrypt from 'bcrypt';
import { UserRepository } from '@/domain/repositories/UserRepository';
import { createClient } from '@/utils/supabase/server';

export class SbUserRepository implements UserRepository {
  async create(user: User): Promise<number> {
    const supabase = await createClient();

    try {
      // 1. 이메일 중복 확인
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .maybeSingle();

      if (fetchError) {
        console.error('Error checking email duplication:', fetchError.message);
        throw new Error('Failed to check email duplication.');
      }

      if (existingUser) {
        throw new Error('이미 사용 중인 이메일입니다.');
      }

      // 2. 사용자 생성
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: user.email,
          password: user.password, // 해싱된 비밀번호 저장
          nickname: user.nickname,
          profile_image_url: user.profileImageUrl,
        })
        .select()
        .single();
      console.log('🔍 Supabase insert result:', data); // ✅ 여기!!
      if (error) {
        console.error('Error creating user:', error.message);
        throw new Error('Failed to create user.');
      }
      return data.id;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<User | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error logging in:', error);
      return null;
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, data.password);
    if (!isPasswordValid) {
      console.error('Invalid password.');
      return null;
    }
    return data;
  }

  async findById(id: number): Promise<User | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }

    return new User(
      data.email, // email
      data.password, // password
      data.nickname, // nickname
      data.profile_image_url, // profileImageUrl
      data.id, // id
      new Date(data.created_at), // createdAt
      new Date(data.updated_at) // updatedAt
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error finding user by email:', error);
      return null;
    }

    return new User(
      data.id,
      data.email,
      data.password,
      data.nickname,
      data.profileImageUrl,
      new Date(data.created_at),
      new Date(data.updated_at)
    );
  }

  async findAll(): Promise<User[]> {
    const supabase = await createClient();

    const { data, error } = await supabase.from('users').select('*');

    if (error) {
      console.error('Error finding all users:', error);
      throw new Error('Failed to fetch users.');
    }

    return data.map((row: any) => {
      return new User(
        row.id,
        row.email,
        row.password,
        row.nickname,
        row.profile_image_rl,
        new Date(row.created_at),
        new Date(row.updated_at)
      );
    });
  }

  async update(id: number, updatedUser: Partial<User>): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
      .from('users')
      .update({
        email: updatedUser.email,
        password: updatedUser.password, // 비밀번호는 해싱된 상태로 업데이트해야 합니다.
        nickname: updatedUser.nickname,
        profileImageUrl: updatedUser.profileImageUrl,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating user:', error);
      return false;
    }

    return true;
  }

  async delete(id: number): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase.from('users').delete().eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
      return false;
    }

    return true;
  }
}
