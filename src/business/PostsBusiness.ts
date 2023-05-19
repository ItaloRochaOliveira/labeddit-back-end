import { NotFoundError } from "../customErrors/NotFoundError";
import { CommentDatabase } from "../database/CommentDatabase";
import { LikeDislikeCommentDatabase } from "../database/LikeDislikeCommentDatabase";
import { likeDislikeDatabase } from "../database/LikeDislikeDatabase";
import { PostDatabase } from "../database/PostsDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { Post, PostModel } from "../models/Post";
import { IdGerator } from "../services/IdGerator";
import { TokenManager } from "../services/TokenManager";

export class PostsBusiness {
  constructor(
    private postsDatabase: PostDatabase,
    private userDatabase: UserDatabase,
    private likesOrDislikeDatabase: likeDislikeDatabase,
    private commentDatabase: CommentDatabase,
    private commentLikeOrDislikeDatabase: LikeDislikeCommentDatabase,
    private tokenManager: TokenManager,
    private idGerator: IdGerator
  ) {}

  getAllPostsOrComments = async (token: string) => {
    const tokenPayload = this.tokenManager.getPayload(token);

    if (!tokenPayload) {
      throw new NotFoundError("User don`t exist.");
    }

    const postsDB = await this.postsDatabase.findAllPosts();

    let posts: PostModel[] = [];

    for (let postDB of postsDB) {
      const [{ id, name }] = await this.userDatabase.findUserById(
        postDB.creator_id as string
      );

      const post = new Post(
        postDB.id,
        postDB.content,
        postDB.likes,
        postDB.dislikes,
        postDB.created_at,
        postDB.updated_at,
        {
          id,
          name,
        }
      );

      const postToResult: PostModel = {
        id: post.ID,
        content: post.CONTENT,
        likes: post.LIKES,
        dislikes: post.DISLIKES,
        createdAt: post.CREATEDAT,
        updatedAt: post.CREATEDAT,
        creator: post.CREATOR,
      };

      posts.push(postToResult);
    }

    return posts;
  };

  getPostsById = async () => {};
  createPost = async () => {};
  editPost = async () => {};
  deletePost = async () => {};

  likeOrDislike = async () => {};

  getCommentsByIdPost = async () => {};
  createCommentsByIdPost = async () => {};
  editCommentsByIdPost = async () => {};
  deleteCommentsByIdPost = async () => {};

  likeOrDislikeComments = () => {};
}
