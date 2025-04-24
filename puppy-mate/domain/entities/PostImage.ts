export class PostImage {
  postId: number;
  imageUrl: string;
  orderIndex: number | null;
  id?: number;

  constructor(
    id: number,
    postId: number,
    imageUrl: string,
    orderIndex: number | null
  ) {
    this.id = id;
    this.postId = postId;
    this.imageUrl = imageUrl;
    this.orderIndex = orderIndex;
  }
}
