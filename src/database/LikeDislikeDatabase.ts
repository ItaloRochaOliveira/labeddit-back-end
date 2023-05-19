import { LikeOrDislike, LikeOrDislikeDB } from "../models/LikeOrDislike";
import { BaseDatabase } from "./BaseDatabase";

export class likeDislikeDatabase extends BaseDatabase {
  private LIKESDISLIKES_TABLE = "like_dislike";

  newLikeOrDislike = async (newLike: LikeOrDislikeDB): Promise<void> => {
    await BaseDatabase.connection(this.LIKESDISLIKES_TABLE).insert(newLike);
  };

  updateLikeOrDislike = async (
    newLike: LikeOrDislikeDB,
    id: string
  ): Promise<void> => {
    await BaseDatabase.connection(this.LIKESDISLIKES_TABLE)
      .update(newLike)
      .where(id);
  };
}
