import { PostRepository } from '@/domain/repositories/PostRepository';
import { CreatePostDto } from './dto/CreatePostDto';
import { CourseRepository } from '@/domain/repositories/CourseRepository';
import { PostImageRepository } from '@/domain/repositories/PostImageRepository';
import { StorageRepository } from '@/domain/repositories/StorageRepository';

export default class CreatePostUsecase {
  private readonly postRepository: PostRepository;
  private readonly courseRepository: CourseRepository;
  private readonly postImageRepository: PostImageRepository;
  private readonly storageRepository: StorageRepository;

  constructor(
    postRepository: PostRepository,
    courseRepository: CourseRepository,
    postImageRepository: PostImageRepository,
    storageRepository: StorageRepository
  ) {
    this.postRepository = postRepository;
    this.courseRepository = courseRepository;
    this.postImageRepository = postImageRepository;
    this.storageRepository = storageRepository;
  }
  async execute(createPostDto: CreatePostDto): Promise<number> {
    try {
      // 1. 게시물 생성
      const postId = await this.postRepository.create(createPostDto);

      // 2. 이미지 저장
      if (createPostDto.images && createPostDto.images.length > 0) {
        // 버킷 저장 후 path 값 배열로 반환
        const uploadedPaths = await this.storageRepository.saveMany(
          createPostDto.images
        );

        // 반환된 path, postId, orderIndex(정렬순) mapping
        const postImages = uploadedPaths.map((path, index) => ({
          postId,
          imageUrl: path,
          orderIndex: index
        }));

        // PostImage Table 저장
        await this.postImageRepository.createMany(postImages);
      }

      // 3. 해당 코스 is_public true로 변경
      await this.courseRepository.updatePublic(createPostDto.courseId, true);

      return postId;
    } catch (error) {
      console.error('Error in CreatePostUsecase:', error);
      throw new Error('Failed to create post with images');
    }
  }
}
