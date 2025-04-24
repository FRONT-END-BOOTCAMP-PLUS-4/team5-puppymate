import { UserRepository } from '@/domain/repositories/UserRepository';
import { LoginUserDto } from './dto/LoginUserDto';

export default class LoginUserUsecase {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(loginUserDto: LoginUserDto): Promise<{ id: number } | null> {
    const user = await this.userRepository.login(
      loginUserDto.email,
      loginUserDto.password
    );

    if (!user) {
      return null; // 로그인 실패 시 null 반환
    }
    return { id: user.id! }; // 성공 시 userId 반환
  }
}
