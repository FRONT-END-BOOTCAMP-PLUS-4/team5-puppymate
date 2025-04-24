import { UserRepository } from '@/domain/repositories/UserRepository';
import { StorageRepository } from '@/domain/repositories/StorageRepository';
import { GetUserDto } from './dto/GetUserDto';

export default class GetUserUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly storageRepository: StorageRepository
  ) {}

  async execute(userId: number): Promise<GetUserDto | null> {
    // 1. User 도메인 객체 조회
    const user = await this.userRepository.findById(userId);
    if (!user) return null;
    console.log('확인1', user);
    // 2. User → GetUserDto 변환 (객체 파라미터 방식에 맞게 수정)
    const getUserDto = new GetUserDto({
      email: user.email,
      nickname: user.nickname,
      profileImage: user.profileImageUrl,
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });

    // 3. 프로필 이미지 URL 처리
    if (getUserDto.profileImage) {
      const publicUrl = await this.storageRepository.getPublicUrl(
        getUserDto.profileImage
      );
      getUserDto.profileImage = publicUrl;
      
    }

    console.log('확인2:', getUserDto);
    return getUserDto;
  }
}
