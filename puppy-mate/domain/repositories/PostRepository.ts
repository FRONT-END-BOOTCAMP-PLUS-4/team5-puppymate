import { Post } from '../entities/Post';

export interface PostRepository {
  /**
   * 게시물 생성
   * @param post - 생성할 게시물 객체
   * @returns 생성된 게시물 ID
   */
  create(post: Post): Promise<number>;

  /**
   * ID로 게시물 조회
   * @param id - 조회할 게시물 ID
   * @returns 게시물 객체 또는 null
   */
  findById(id: number): Promise<Post | null>;

  /**
   * 모든 게시물 조회
   * @returns 게시물 리스트
   */
  findAll(): Promise<Post[]>;

  /**
   * 특정 사용자의 게시물 조회
   * @param userId - 사용자 ID
   * @returns 해당 사용자의 게시물 리스트
   */
  findByUserId(userId: number): Promise<Post[]>;

  /**
   * 게시물 업데이트
   * @param id - 업데이트할 게시물 ID
   * @param updatedPost - 업데이트할 데이터가 포함된 게시물 객체
   * @returns 업데이트 성공 여부
   */
  update(id: number, updatedPost: Partial<Post>): Promise<boolean>;

  /**
   * 게시물 삭제
   * @param id - 삭제할 게시물 ID
   * @returns 삭제 성공 여부
   */
  delete(id: number): Promise<boolean>;
}