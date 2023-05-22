import { BaseDatabase } from "../../src/database/BaseDatabase";
import { LikeOrDislikeDB } from "../../src/models/LikeOrDislike";

const likeDislikeMock: LikeOrDislikeDB[] = [
  {
    post_id: "id-post-1-mock",
    user_id: "id-admin",
    like: null,
  },
  {
    post_id: "id-post-1-mock",
    user_id: "id-normal-2",
    like: 1,
  },
  {
    post_id: "id-post-1-mock",
    user_id: "id-normal-3",
    like: 0,
  },
];

export class likeDislikeDatabaseMock extends BaseDatabase {
  private LIKESDISLIKES_TABLE = "like_dislike";

  findLikesAndDislikesById = async (user_id: any) => {
    const postLikedDB = likeDislikeMock.filter(
      (likeDislike) => likeDislike.user_id === user_id
    );

    return postLikedDB;
  };

  newLikeOrDislike = async (newLike: LikeOrDislikeDB): Promise<void> => {};

  updateLikeOrDislike = async (
    user_id: string,
    post_id: string,
    newLikeOrDislike: any
  ) => {};

  deleteLikeOrDislike = async (post_id: string): Promise<void> => {};
}
