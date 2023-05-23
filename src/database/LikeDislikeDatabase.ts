import { LikeOrDislikeDB } from "../models/LikeOrDislike";
import { BaseDatabase } from "./BaseDatabase";

export class likeDislikeDatabase extends BaseDatabase {
  private static LIKESDISLIKES_TABLE = "like_dislike";

  findLikesAndDislikesById = async (id_user: any) => {
    const postLikedDB = await BaseDatabase.connection(
      likeDislikeDatabase.LIKESDISLIKES_TABLE
    ).where({ id_user });

    return postLikedDB;
  };

  newLikeOrDislike = async (newLike: LikeOrDislikeDB): Promise<void> => {
    await BaseDatabase.connection(
      likeDislikeDatabase.LIKESDISLIKES_TABLE
    ).insert(newLike);
  };

  updateLikeOrDislike = async (
    id_user: string,
    id_post: string,
    newLikeOrDislike: any
  ): Promise<void> => {
    await BaseDatabase.connection(likeDislikeDatabase.LIKESDISLIKES_TABLE)
      .update(newLikeOrDislike)
      .where({ id_post })
      .andWhere({ id_user });
  };

  deleteLikeOrDislike = async (id_post: string): Promise<void> => {
    await BaseDatabase.connection(likeDislikeDatabase.LIKESDISLIKES_TABLE)
      .del()
      .where({ id_post });
  };
}
