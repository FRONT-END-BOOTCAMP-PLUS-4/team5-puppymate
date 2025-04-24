import { PostImage } from '../entities/PostImage';

export interface PostImageRepository {
  /**
   * 여러 게시물 이미지 생성
   * @param postImages - 생성할 게시물 이미지 객체 배열
   * @returns 생성된 이미지 ID 배열
   */
  createMany(postImages: PostImage[]): Promise<number[]>;
  /**
   * 해당 게시물의 이미지 조회
   * @param postId - 게시물 ID
   * @returns 해당 게시물의 이미지 리스트
   */
  findByPostId(postId: number): Promise<PostImage[]>;
  // /**
  //  * 게시물 이미지 생성
  //  * @param postImage - 생성할 게시물 이미지 객체
  //  * @returns 생성된 게시물 이미지 ID
  //  */
  // create(postImage: PostImage): Promise<number>;

  // /**
  //  * 특정 게시물의 이미지 조회
  //  * @param postId - 게시물 ID
  //  * @returns 해당 게시물의 이미지 리스트
  //  */
  // findByPostId(postId: number): Promise<PostImage[]>;

  // /**
  //  * ID로 게시물 이미지 조회
  //  * @param id - 조회할 게시물 이미지 ID
  //  * @returns 게시물 이미지 객체 또는 null
  //  */
  // findById(id: number): Promise<PostImage | null>;

  // /**
  //  * 게시물 이미지 업데이트
  //  * @param id - 업데이트할 게시물 이미지 ID
  //  * @param updatedPostImage - 업데이트할 데이터가 포함된 게시물 이미지 객체
  //  * @returns 업데이트 성공 여부
  //  */
  // update(id: number, updatedPostImage: Partial<PostImage>): Promise<boolean>;

  // /**
  //  * 게시물 이미지 삭제
  //  * @param id - 삭제할 게시물 이미지 ID
  //  * @returns 삭제 성공 여부
  //  */
  // delete(id: number): Promise<boolean>;

  // /**
  //  * 특정 게시물의 모든 이미지 삭제
  //  * @param postId - 삭제할 게시물 ID
  //  * @returns 삭제된 이미지 개수
  //  */
  // deleteByPostId(postId: number): Promise<number>;
}
