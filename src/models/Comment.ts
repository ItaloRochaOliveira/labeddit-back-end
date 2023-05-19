// export interface CommentModel {
//   id: string;
//   content: string;
//   likes: number;
//   dislikes: number;
//   createdAt: string;
//   updatedAt: string;
//   creator: CreatorObj | undefined;
// }

export interface CommentDB {
  id: string;
  id_user: string;
  id_post: string;
  content: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
}
