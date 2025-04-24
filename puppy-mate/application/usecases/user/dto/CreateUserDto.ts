export class CreateUserDto {
  constructor(
    public email: string,
    public password: string,
    public nickname: string,
    public profileImage?: File,
    public id?: number,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
