import { BaseDatabase } from "../../src/database/BaseDatabase";
import { LikeOrDislikeDB } from "../../src/models/LikeOrDislike";

const likeDislikeMock: LikeOrDislikeDB[] = [
  {
    id_post: "id-post-1-mock",
    id_user: "id-admin",
    like: null,
  },
  {
    id_post: "id-post-1-mock",
    id_user: "id-normal-2",
    like: 1,
  },
  {
    id_post: "id-post-1-mock",
    id_user: "id-normal-3",
    like: 0,
  },
];

export class likeDislikeDatabaseMock extends BaseDatabase {
  private LIKESDISLIKES_TABLE = "like_dislike";

  findLikesAndDislikesById = async (
    id_post: string,
    id_user: string
  ): Promise<LikeOrDislikeDB[]> => {
    const postLikedDB: LikeOrDislikeDB[] = likeDislikeMock.filter(
      (likeDislike) =>
        likeDislike.id_user === id_user && likeDislike.id_post === id_post
    );

    return postLikedDB;
  };

  findLikesAndDislikesByIdPost = async (
    id_post: string
  ): Promise<LikeOrDislikeDB[]> => {
    const postLikedDB: LikeOrDislikeDB[] = likeDislikeMock.filter(
      (likeDislike) => likeDislike.id_post === id_post
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
