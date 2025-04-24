import { UserRepository } from '@/domain/repositories/UserRepository';
import { StorageRepository } from '@/domain/repositories/StorageRepository';
import { CreateUserDto } from './dto/CreateUserDto';
import bcrypt from 'bcrypt';
import { User } from '@/domain/entities/User';

export default class CreateUserUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly storageRepository: StorageRepository
  ) {}

  async execute(createUserDto: CreateUserDto): Promise<{ userId: number }> {
    const { email, password, nickname, profileImage } = createUserDto;

    let fileName: string | undefined;

    // 1. 이미지 파일이 있다면 Supabase에 저장
    if (profileImage) {
      fileName = await this.storageRepository.save(profileImage as File);
    }

    // 2. 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. User 객체 생성
    const user: User = {
      email,
      password: hashedPassword,
      nickname,
      profileImageUrl: fileName,
    };

    // 4. DB에 저장하고 userId 반환
    const userId = await this.userRepository.create(user);
    console.log('User created with ID:', userId);
    return { userId };
  }
}
