import { PostRepository } from '@/domain/repositories/PostRepository';
import { UpdatePostDto } from './dto/UpdatePostDto';

export default class UpdatePostUsecase {
  private readonly postRepository: PostRepository;
  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  async execute(
    id: number,
    updatePostDto: UpdatePostDto
  ): Promise<{ postId: number; isSuccess: boolean }> {
    const result = await this.postRepository.update(id, updatePostDto);
    return { postId: id, isSuccess: result };
  }
}
