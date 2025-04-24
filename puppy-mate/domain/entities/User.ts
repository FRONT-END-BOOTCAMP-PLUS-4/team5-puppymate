// User 클래스
export class User {
  constructor(
    public email: string,
    public password: string,
    public nickname: string,
    public profileImageUrl?: string,
    public id?: number,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
