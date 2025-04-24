import { PostRepository } from '@/domain/repositories/PostRepository';

export default class DeletePostUsecase {
  private readonly postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  async execute(id: number): Promise<{ isSuccess: boolean }> {
    const isSuccess = await this.postRepository.delete(id);
    return { isSuccess: isSuccess };
  }
}
