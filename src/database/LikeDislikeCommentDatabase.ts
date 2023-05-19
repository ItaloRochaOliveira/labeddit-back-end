import { LikeOrDislikeCommentDB } from "../models/LikeOrDislikeComment";
import { BaseDatabase } from "./BaseDatabase";

export class LikeDislikeCommentDatabase extends BaseDatabase {
  private LIKESDISLIKESCOMMENT_TABLE = "like_dislike_comment_post";

  newLikeOrDislike = async (newLike: LikeOrDislikeCommentDB): Promise<void> => {
    await BaseDatabase.connection(this.LIKESDISLIKESCOMMENT_TABLE).insert(
      newLike
    );
  };

  updateLikeOrDislike = async (
    newLike: LikeOrDislikeCommentDB,
    id: string
  ): Promise<void> => {
    await BaseDatabase.connection(this.LIKESDISLIKESCOMMENT_TABLE)
      .update(newLike)
      .where(id);
  };
}
