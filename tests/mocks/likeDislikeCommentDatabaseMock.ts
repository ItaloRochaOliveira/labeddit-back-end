import { BaseDatabase } from "../../src/database/BaseDatabase";
import { LikeOrDislikeCommentDB } from "../../src/models/LikeOrDislikeComment";

const likeDislikeMock: LikeOrDislikeCommentDB[] = [
  {
    id_comment: "id-do-comentario-1",
    id_user: "id-do-admin",
    like: null,
  },
  {
    id_comment: "id-do-comentario-2",
    id_user: "id-do-normal",
    like: 1,
  },
];

export class LikeDislikeCommentDatabaseMock extends BaseDatabase {
  private LIKESDISLIKESCOMMENT_TABLE = "like_dislike_comment_post";

  findLikesAndDislikesById = async (id_user: any) => {
    const commentLikeDB = likeDislikeMock.filter(
      (likeDislike) => likeDislike.id_user === id_user
    );

    return commentLikeDB;
  };

  newLikeOrDislikeComment = async (
    newLikeComment: LikeOrDislikeCommentDB
  ): Promise<void> => {};

  updateLikeOrDislikeComment = async (
    id_user: string,
    id_comment: string,
    newLikeOrDislikeComment: any
  ): Promise<void> => {};

  deleteLikeOrDislikeComment = async (id_comment: string): Promise<void> => {};
}
