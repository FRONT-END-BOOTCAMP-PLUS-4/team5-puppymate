import { User } from '../entities/User';

export interface UserRepository {
  /**
   * 사용자 회원가입
   * @param user - 회원가입할 사용자 객체
   * @returns 생성된 사용자 ID
   */
  create(user: User): Promise<number>;

  /**
   * 사용자 로그인
   * @param email - 사용자의 이메일
   * @param password - 사용자의 비밀번호
   * @returns 사용자 객체 또는 null
   */
  login(email: string, password: string): Promise<User | null>;

  /**
   * ID로 사용자 조회
   * @param id - 조회할 사용자 ID
   * @returns 사용자 객체 또는 null
   */
  findById(id: number): Promise<User | null>;

  /**
   * 이메일로 사용자 조회
   * @param email - 조회할 사용자 이메일
   * @returns 사용자 객체 또는 null
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * 모든 사용자 조회
   * @returns 사용자 리스트
   */
  findAll(): Promise<User[]>;

  /**
   * 사용자 정보 업데이트
   * @param id - 업데이트할 사용자 ID
   * @param updatedUser - 업데이트할 데이터가 포함된 사용자 객체
   * @returns 업데이트 성공 여부
   */
  update(id: number, updatedUser: Partial<User>): Promise<boolean>;

  /**
   * 사용자 삭제
   * @param id - 삭제할 사용자 ID
   * @returns 삭제 성공 여부
   */
  delete(id: number): Promise<boolean>;
  /**
   * 사용자 ID로 프로필 이미지 URL 조회
   * @param id - 사용자 ID
   * @returns 프로필 이미지 URL 문자열 또는 null
   */
}
