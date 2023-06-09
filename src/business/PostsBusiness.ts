import { BadRequestError } from "../customErrors/BadRequestError";
import { NotFoundError } from "../customErrors/NotFoundError";
import { CommentDatabase } from "../database/CommentDatabase";
import { LikeDislikeCommentDatabase } from "../database/LikeDislikeCommentDatabase";
import { likeDislikeDatabase } from "../database/LikeDislikeDatabase";
import { PostDatabase } from "../database/PostsDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { GetPostInputDTO } from "../dtos/postDTO/GetPosts.dto";
import {
  GetPostByIdInputDTO,
  GetPostByIdOutputDTO,
} from "../dtos/postDTO/GetPostsById.dto";
import { likeOrDislikeInputDTO } from "../dtos/postDTO/LikeOrDislike.dto";
import { CreatePostInputDTO } from "../dtos/postDTO/createPost.dto";
import { DeletePostInputDTO } from "../dtos/postDTO/deletePost.dto";
import { UpdatePostInputDTO } from "../dtos/postDTO/updatePost.dto";
import { Comment, CommentModel, CommentsObj } from "../models/Comment";
import {
  LikeDislike,
  LikeOrDislike,
  LikeOrDislikeDB,
} from "../models/LikeOrDislike";
import { LikeDislikeComment } from "../models/LikeOrDislikeComment";
import { Post, PostDB, PostModel } from "../models/Post";
import { USER_ROLES } from "../models/User";
import { IdGerator } from "../services/IdGerator";
import { TokenManager } from "../services/TokenManager";

//tentando resolver erro no deploy

export class PostsBusiness {
  constructor(
    private postsDatabase: PostDatabase,
    private userDatabase: UserDatabase,
    private likesOrDislikeDatabase: likeDislikeDatabase,
    private commentDatabase: CommentDatabase,
    private tokenManager: TokenManager,
    private idGerator: IdGerator,
    private likeDislikeCommentDatabase: LikeDislikeCommentDatabase
  ) {}

  getAllPosts = async ({ token }: GetPostInputDTO): Promise<PostModel[]> => {
    const tokenPayload = this.tokenManager.getPayload(token);

    if (!tokenPayload) {
      throw new NotFoundError("User don't exist.");
    }

    const postsDB = await this.postsDatabase.findAllPosts();

    let posts: PostModel[] = [];

    for (let postDB of postsDB) {
      const [{ id, name }] = await this.userDatabase.findUserById(
        postDB.creator_id as string
      );

      const commentsDB = await this.commentDatabase.findCommentByIdPost(
        postDB.id
      );

      let comments: any = [];

      for (let commentDB of commentsDB) {
        const [{ id, name }] = await this.userDatabase.findUserById(
          commentDB.id_user
        );

        const comment = new Comment(
          commentDB.id,
          commentDB.id_post,
          commentDB.content,
          commentDB.likes,
          commentDB.dislikes,
          commentDB.created_at,
          commentDB.updated_at,
          {
            id,
            name,
          }
        );

        const commentToResullt: CommentsObj = comment.CommentToGetAllPost();

        comments.push(commentToResullt);
      }

      const likeDislikesDB =
        await this.likesOrDislikeDatabase.findLikesAndDislikesByIdPost(
          postDB.id
        );

      let impressions: any = [];

      for (let likeDislikeDB of likeDislikesDB) {
        const likeDislike = new LikeDislike(
          likeDislikeDB.id_user,
          likeDislikeDB.id_post,
          likeDislikeDB.like
        );

        const likeDislikeToResult: LikeOrDislike =
          likeDislike.LikeDislikeToResult();

        impressions.push(likeDislikeToResult);
      }

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
        },
        ""
      );

      const postToResult: PostModel = {
        id: post.ID,
        content: post.CONTENT,
        likes: post.LIKES,
        dislikes: post.DISLIKES,
        createdAt: post.CREATEDAT,
        updatedAt: post.CREATEDAT,
        creator: post.CREATOR,
        comments,
        impressions,
      };

      posts.push(postToResult);
    }

    return posts;
  };

  getPostsById = async (
    input: GetPostByIdInputDTO
  ): Promise<GetPostByIdOutputDTO> => {
    const { token, idPost } = input;
    const tokenPayload = this.tokenManager.getPayload(token);

    if (!tokenPayload) {
      throw new NotFoundError("User don't exist.");
    }

    const postsDB = await this.postsDatabase.findPostById(idPost);

    if (!postsDB.length) {
      throw new NotFoundError("Post with this id don't exist.");
    }

    let posts: any = [];

    for (let postDB of postsDB) {
      const [{ id, name }] = await this.userDatabase.findUserById(
        postDB.creator_id as string
      );

      const commentsDB = await this.commentDatabase.findCommentByIdPost(idPost);

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

      let comments: CommentModel[] = [];

      for (let commentDB of commentsDB) {
        const [{ id, name }] = await this.userDatabase.findUserById(
          commentDB.id_user
        );

        const comment = new Comment(
          commentDB.id,
          commentDB.id_post,
          commentDB.content,
          commentDB.likes,
          commentDB.dislikes,
          commentDB.created_at,
          commentDB.updated_at,
          {
            id,
            name,
          }
        );

        const likeDislikesCommentDB =
          await this.likeDislikeCommentDatabase.findLikesAndDislikesByIdComment(
            commentDB.id
          );

        const impressions: any = [];
        for (let likeDislikeCommentDB of likeDislikesCommentDB) {
          const likeDislikeComment = new LikeDislikeComment(
            likeDislikeCommentDB.id_user,
            likeDislikeCommentDB.id_comment,
            likeDislikeCommentDB.like
          );

          const likeDislikeCommentToResult =
            likeDislikeComment.LikeDislikeToResult();

          impressions.push(likeDislikeCommentToResult);
        }

        const commentToResullt: CommentModel = {
          id: comment.ID,
          idPost: comment.IDPOST,
          content: comment.CONTENT,
          likes: comment.LIKES,
          dislikes: comment.DISLIKES,
          createdAt: comment.CREATEDAT,
          updatedAt: comment.CREATEDAT,
          creator: comment.CREATOR,
          impressions,
        };

        comments.push(commentToResullt);
      }

      const likeDislikesDB =
        await this.likesOrDislikeDatabase.findLikesAndDislikesByIdPost(
          postDB.id
        );

      let impressions: any = [];

      for (let likeDislikeDB of likeDislikesDB) {
        const likeDislike = new LikeDislike(
          likeDislikeDB.id_user,
          likeDislikeDB.id_post,
          likeDislikeDB.like
        );

        const likeDislikeToResult: LikeOrDislike =
          likeDislike.LikeDislikeToResult();

        impressions.push(likeDislikeToResult);
      }

      const postToResult: any = {
        id: post.ID,
        content: post.CONTENT,
        likes: post.LIKES,
        dislikes: post.DISLIKES,
        createdAt: post.CREATEDAT,
        updatedAt: post.CREATEDAT,
        creator: post.CREATOR,
        comments: comments,
        impressions: impressions,
      };

      posts.push(postToResult);
    }

    return posts;
  };

  createPost = async (input: CreatePostInputDTO): Promise<string> => {
    const { token, content } = input;
    const tokenPayload = this.tokenManager.getPayload(token);

    if (!tokenPayload) {
      throw new NotFoundError("User don't exist.");
    }

    const id = this.idGerator.gerate();

    const newPost = new Post(
      id,
      content,
      0,
      0,
      new Date().toISOString(),
      "",
      undefined,
      tokenPayload.id
    );

    const newPostDB = newPost.PostToDB();

    await this.postsDatabase.createPost(newPostDB);

    return "Post successfully created.";
  };

  editPost = async (input: UpdatePostInputDTO) => {
    const { token, id, content } = input;

    const tokenPayload = this.tokenManager.getPayload(token);

    if (!tokenPayload) {
      throw new NotFoundError("User don't exist.");
    }

    const userId = tokenPayload.id;

    const [postDB] = await this.postsDatabase.findPostById(id);

    if (!postDB) {
      throw new NotFoundError("Post not found.");
    }

    const postOfUser = postDB.creator_id === userId;

    if (!postOfUser) {
      throw new BadRequestError("only the user can update the post");
    }

    const post = new Post(
      postDB.id,
      postDB.content,
      postDB.likes,
      postDB.dislikes,
      postDB.created_at,
      postDB.updated_at,
      undefined,
      userId
    );

    post.UPDATEDAT = new Date().toISOString();
    content && (post.CONTENT = content);

    const updatePostDB = post.PostToDB();

    await this.postsDatabase.editPost(updatePostDB, id);

    return "Post updated.";
  };

  deletePost = async (postForDelete: DeletePostInputDTO): Promise<string> => {
    const { token, id } = postForDelete;

    const tokenPayload = this.tokenManager.getPayload(token);

    if (!tokenPayload) {
      throw new NotFoundError("User don't exist.");
    }

    const [postDB] = await this.postsDatabase.findPostById(id);

    if (!postDB) {
      throw new NotFoundError("Post not found.");
    }

    const postOfUser = postDB.creator_id === tokenPayload.id;

    if (tokenPayload.role !== USER_ROLES.ADMIN) {
      if (!postOfUser) {
        throw new BadRequestError("only the user can update the post");
      }
    }

    const commentsDB = await this.commentDatabase.findCommentByIdPost(id);

    for (let commentDB of commentsDB) {
      await this.likeDislikeCommentDatabase.deleteLikeOrDislikeComment(
        commentDB.id
      );

      await this.commentDatabase.deleteComment(commentDB.id);
    }

    await this.likesOrDislikeDatabase.deleteLikeOrDislike(id);

    await this.postsDatabase.deletePost(id);

    return "Post deleted.";
  };

  likeOrDislike = async (postLikeOrDislike: likeOrDislikeInputDTO) => {
    const { token, id, like } = postLikeOrDislike;

    const tokenPayload = this.tokenManager.getPayload(token);

    if (!tokenPayload) {
      throw new NotFoundError("User don't exist.");
    }

    const userId = tokenPayload.id;
    const postId = id;

    let response: string;

    const likeDB: number = !like ? 0 : 1;

    let newUserLikeOrDislikeDB: LikeOrDislikeDB = {
      id_user: userId,
      id_post: postId,
      like: likeDB,
    };

    const [postLikedExistDB] =
      await this.likesOrDislikeDatabase.findLikesAndDislikesById(
        postId,
        userId
      );

    const [postDB] = await this.postsDatabase.findPostById(postId);

    if (!postDB) {
      throw new NotFoundError("Post not Found.");
    }

    if (postDB.creator_id === userId) {
      throw new BadRequestError(
        "It`s not possible for the creator like or dislike you own comment."
      );
    }

    if (!postLikedExistDB) {
      let updatePost;

      if (!like) {
        updatePost = { ...postDB, dislikes: postDB.dislikes + 1 };
      } else {
        updatePost = { ...postDB, likes: postDB.likes + 1 };
      }

      await this.postsDatabase.editPost(updatePost, postId);

      await this.likesOrDislikeDatabase.newLikeOrDislike(
        newUserLikeOrDislikeDB
      );

      response = "Like or dislike updated";
    } else {
      let updatePost: PostDB | undefined;

      if (!like && postLikedExistDB.like === null) {
        updatePost = { ...postDB, dislikes: postDB.dislikes + 1 };
      } else if (like && postLikedExistDB.like === null) {
        updatePost = { ...postDB, likes: postDB.likes + 1 };
      }

      if (likeDB === postLikedExistDB.like) {
        likeDB === 0
          ? (updatePost = { ...postDB, dislikes: postDB.dislikes - 1 })
          : (updatePost = { ...postDB, likes: postDB.likes - 1 });

        newUserLikeOrDislikeDB = { ...newUserLikeOrDislikeDB, like: null };
      }

      if (likeDB === 0 && postLikedExistDB.like === 1) {
        updatePost = {
          ...postDB,
          dislikes: postDB.dislikes + 1,
          likes: postDB.likes - 1,
        };
      } else if (likeDB === 1 && postLikedExistDB.like === 0) {
        updatePost = {
          ...postDB,
          dislikes: postDB.dislikes - 1,
          likes: postDB.likes + 1,
        };
      }

      await this.postsDatabase.editPost(updatePost as PostDB, postId);

      await this.likesOrDislikeDatabase.updateLikeOrDislike(
        userId,
        postId,
        newUserLikeOrDislikeDB
      );

      response = "Like or dislike updated";
    }

    return response;
  };
}
