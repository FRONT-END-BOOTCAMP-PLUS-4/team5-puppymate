export class CreatePostDto {
  constructor(
    public userId: number,
    public courseId: number,
    public title: string,
    public content?: string | undefined,
    public images?: File[] | null
  ) {}
}
