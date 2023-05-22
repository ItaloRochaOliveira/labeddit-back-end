import { LikeOrDislikeDB } from "../models/LikeOrDislike";
import { BaseDatabase } from "./BaseDatabase";

export class likeDislikeDatabase extends BaseDatabase {
  private static LIKESDISLIKES_TABLE = "like_dislike";

  findLikesAndDislikesById = async (user_id: any) => {
    const postLikedDB = await BaseDatabase.connection(
      likeDislikeDatabase.LIKESDISLIKES_TABLE
    ).where({ user_id });

    return postLikedDB;
  };

  newLikeOrDislike = async (newLike: LikeOrDislikeDB): Promise<void> => {
    await BaseDatabase.connection(
      likeDislikeDatabase.LIKESDISLIKES_TABLE
    ).insert(newLike);
  };

  updateLikeOrDislike = async (
    user_id: string,
    post_id: string,
    newLikeOrDislike: any
  ): Promise<void> => {
    await BaseDatabase.connection(likeDislikeDatabase.LIKESDISLIKES_TABLE)
      .update(newLikeOrDislike)
      .where({ post_id })
      .andWhere({ user_id });
  };

  deleteLikeOrDislike = async (post_id: string): Promise<void> => {
    await BaseDatabase.connection(likeDislikeDatabase.LIKESDISLIKES_TABLE)
      .del()
      .where({ post_id });
  };
}
