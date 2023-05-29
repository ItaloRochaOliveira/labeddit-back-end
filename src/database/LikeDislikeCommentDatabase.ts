import { CommentDB } from "../models/Comment";
import { LikeOrDislikeCommentDB } from "../models/LikeOrDislikeComment";
import { BaseDatabase } from "./BaseDatabase";

export class LikeDislikeCommentDatabase extends BaseDatabase {
  private static LIKESDISLIKESCOMMENT_TABLE = "like_dislike_comment_post";

  findLikesAndDislikesById = async (
    id_user: string,
    id_comment: string
  ): Promise<LikeOrDislikeCommentDB[]> => {
    const commentLikeDB = await BaseDatabase.connection(
      LikeDislikeCommentDatabase.LIKESDISLIKESCOMMENT_TABLE
    )
      .where({ id_user })
      .andWhere({ id_comment });

    return commentLikeDB;
  };

  findLikesAndDislikesByIdComment = async (
    id_comment: string
  ): Promise<LikeOrDislikeCommentDB[]> => {
    const commentLikeDB = await BaseDatabase.connection(
      LikeDislikeCommentDatabase.LIKESDISLIKESCOMMENT_TABLE
    ).where({ id_comment });

    return commentLikeDB;
  };

  newLikeOrDislikeComment = async (
    newLikeComment: LikeOrDislikeCommentDB
  ): Promise<void> => {
    await BaseDatabase.connection(
      LikeDislikeCommentDatabase.LIKESDISLIKESCOMMENT_TABLE
    ).insert(newLikeComment);
  };

  updateLikeOrDislikeComment = async (
    id_user: string,
    id_comment: string,
    newLikeOrDislikeComment: any
  ): Promise<void> => {
    await BaseDatabase.connection(
      LikeDislikeCommentDatabase.LIKESDISLIKESCOMMENT_TABLE
    )
      .update(newLikeOrDislikeComment)
      .where({ id_comment })
      .andWhere({ id_user });
  };

  deleteLikeOrDislikeComment = async (id_comment: string): Promise<void> => {
    await BaseDatabase.connection(
      LikeDislikeCommentDatabase.LIKESDISLIKESCOMMENT_TABLE
    )
      .del()
      .where({ id_comment });
  };
}
