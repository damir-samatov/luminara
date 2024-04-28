export type CommentDto = {
  id: string;
  postId: string;
  body: string;
  createdAt: Date;
  user: {
    id: string;
    username: string;
    imageUrl: string;
  };
};
