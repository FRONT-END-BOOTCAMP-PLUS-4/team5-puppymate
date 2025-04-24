export class GetUserDto {
  email: string;
  nickname: string;
  profileImage?: string;
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(params: {
    email: string;
    nickname: string;
    profileImage?: string;
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.email = params.email;
    this.nickname = params.nickname;
    this.profileImage = params.profileImage;
    this.id = params.id;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
}
