import { LikeOrDislikeCommentDB } from "../models/LikeOrDislikeComment";
import { BaseDatabase } from "./BaseDatabase";

export class LikeDislikeCommentDatabase extends BaseDatabase {
  private LIKESDISLIKESCOMMENT_TABLE = "like_dislike_comment_post";

  findLikesAndDislikesById = async (id_user: any) => {
    const commentLikeDB = await BaseDatabase.connection(
      this.LIKESDISLIKESCOMMENT_TABLE
    ).where({ id_user });

    return commentLikeDB;
  };

  newLikeOrDislikeComment = async (
    newLikeComment: LikeOrDislikeCommentDB
  ): Promise<void> => {
    await BaseDatabase.connection(this.LIKESDISLIKESCOMMENT_TABLE).insert(
      newLikeComment
    );
  };

  updateLikeOrDislikeComment = async (
    id_user: string,
    id_comment: string,
    newLikeOrDislikeComment: any
  ): Promise<void> => {
    await BaseDatabase.connection(this.LIKESDISLIKESCOMMENT_TABLE)
      .update(newLikeOrDislikeComment)
      .where({ id_comment })
      .andWhere({ id_user });
  };

  deleteLikeOrDislikeComment = async (id_comment: string): Promise<void> => {
    await BaseDatabase.connection(this.LIKESDISLIKESCOMMENT_TABLE)
      .del()
      .where({ id_comment });
  };
}
