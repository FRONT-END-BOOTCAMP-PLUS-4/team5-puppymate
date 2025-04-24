export class Post {
  userId: number;
  courseId: number;
  title: string;
  id?: number;
  content?: string | undefined;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    id: number,
    userId: number,
    courseId: number,
    title: string,
    content: string | undefined,
    createdAt: Date,
    updatedAt: Date
  ) {
    this.id = id;
    this.userId = userId;
    this.courseId = courseId;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
