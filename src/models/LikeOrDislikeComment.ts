export interface LikeOrDislikeCommentDB {
  id_user: string;
  id_comment: string;
  like: number | null;
}
