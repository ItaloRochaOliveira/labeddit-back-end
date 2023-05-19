export interface LikeOrDislikeDB {
  user_id: string;
  post_id: string;
  like: number | null;
}
