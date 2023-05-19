export interface LikeOrDislikeDB {
  user_id: string;
  post_id: string;
  like: number;
}

export class LikeOrDislike {
  constructor(
    private user_id: string,
    private post_id: string,
    private like: number | null
  ) {}

  public get USER_ID(): string {
    return this.user_id;
  }

  public get POST_ID(): string {
    return this.post_id;
  }

  public get LIKE(): number | null {
    return this.like;
  }

  public set USER_ID(newUserId: string) {
    this.user_id = newUserId;
  }

  public set POST_ID(newPostId: string) {
    this.post_id = newPostId;
  }

  public set LIKE(newLike: number | null) {
    this.like = newLike;
  }
}
