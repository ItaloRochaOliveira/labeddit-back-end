import { BadRequestError } from "../customErrors/BadRequestError";
import { NotFoundError } from "../customErrors/NotFoundError";
import { CommentDatabase } from "../database/CommentDatabase";
import { LikeDislikeCommentDatabase } from "../database/LikeDislikeCommentDatabase";
import { PostDatabase } from "../database/PostsDatabase";
import { GetCommentInputDTO } from "../dtos/commentDTO/GetComments.dto";
import { likeOrDislikeCommentInputDTO } from "../dtos/commentDTO/LikeOrDislikeComment.dto";
import { CreateCommentInputDTO } from "../dtos/commentDTO/createComment.dto";
import { DeleteCommentInputDTO } from "../dtos/commentDTO/deletePost.dto";
import { UpdateCommentInputDTO } from "../dtos/commentDTO/updatePost.dto";
import { Comment, CommentDB, CommentModel } from "../models/Comment";
import { LikeOrDislikeCommentDB } from "../models/LikeOrDislikeComment";
import { IdGerator } from "../services/IdGerator";
import { TokenManager } from "../services/TokenManager";

export class CommentBusiness {
  constructor(
    private postsDatabase: PostDatabase,
    private commentDatabase: CommentDatabase,
    private commentLikeOrDislikeDatabase: LikeDislikeCommentDatabase,
    private tokenManager: TokenManager,
    private idGerator: IdGerator
  ) {}

  // getCommentsByIdPost = async ({
  //   token,
  //   idPost,
  // }: GetCommentInputDTO): Promise<CommentModel[]> => {
  //   const tokenPayload = this.tokenManager.getPayload(token);

  //   if (!tokenPayload) {
  //     throw new NotFoundError("User don`t exist.");
  //   }

  //   const commentsDB = await this.commentDatabase.findCommentByIdPost(idPost);

  //   if (!commentsDB.length) {
  //     throw new NotFoundError("Post not exist.");
  //   }

  //   let comments: CommentModel[] = [];

  //   for (let commentDB of commentsDB) {
  //     const comment = new Comment(
  //       commentDB.id,
  //       commentDB.id_post,
  //       commentDB.id_user,
  //       commentDB.content,
  //       commentDB.likes,
  //       commentDB.dislikes,
  //       commentDB.created_at,
  //       commentDB.updated_at
  //     );

  //     const commentToResullt: CommentModel = {
  //       id: comment.ID,
  //       idUser: comment.IDUSER,
  //       idPost: comment.IDPOST,
  //       content: comment.CONTENT,
  //       likes: comment.LIKES,
  //       dislikes: comment.DISLIKES,
  //       createdAt: comment.CREATEDAT,
  //       updatedAt: comment.CREATEDAT,
  //     };

  //     comments.push(commentToResullt);
  //   }

  //   return comments;
  // };

  createCommentsByIdPost = async (
    input: CreateCommentInputDTO
  ): Promise<string> => {
    const { token, content, idPost } = input;

    const tokenPayload = this.tokenManager.getPayload(token);

    if (!tokenPayload) {
      throw new NotFoundError("User don't exist.");
    }

    const [postDB] = await this.postsDatabase.findPostById(idPost);

    if (!postDB) {
      throw new NotFoundError("Post not exist.");
    }

    const id = this.idGerator.gerate();

    const newComment = new Comment(
      id,
      tokenPayload.id,
      postDB.id,
      content,
      0,
      0,
      new Date().toISOString(),
      ""
    );

    const newCommentDB = newComment.CommentToDB();

    await this.commentDatabase.createComment(newCommentDB);

    return "Comment successfully created.";
  };

  editCommentsById = async (input: UpdateCommentInputDTO): Promise<string> => {
    const { token, id, content } = input;

    const tokenPayload = this.tokenManager.getPayload(token);

    if (!tokenPayload) {
      throw new NotFoundError("User don't exist.");
    }

    const userId = tokenPayload.id;

    const [commentDB] = await this.commentDatabase.findCommentById(id);

    if (!commentDB) {
      throw new NotFoundError("comment not found.");
    }

    if (commentDB.id_user !== userId) {
      throw new BadRequestError("Only user can change your own comment");
    }

    const newComment = new Comment(
      id,
      commentDB.id_user,
      commentDB.id_post,
      content,
      0,
      0,
      new Date().toISOString(),
      ""
    );

    content && (newComment.CONTENT = content);

    const updatePostDB = newComment.CommentToDB();

    await this.commentDatabase.editComment(updatePostDB, id);

    return "Comment updated.";
  };

  deleteCommentsById = async (
    commentForDelete: DeleteCommentInputDTO
  ): Promise<string> => {
    const { token, id } = commentForDelete;

    const tokenPayload = this.tokenManager.getPayload(token);

    if (!tokenPayload) {
      throw new NotFoundError("User don't exist.");
    }

    const [commentDB] = await this.commentDatabase.findCommentById(id);

    if (!commentDB) {
      throw new NotFoundError("comment not found.");
    }

    if (commentDB.id_user !== tokenPayload.id) {
      throw new BadRequestError("Only user can delete your own comment");
    }

    await this.commentLikeOrDislikeDatabase.deleteLikeOrDislikeComment(id);

    await this.commentDatabase.deleteComment(id);

    return "Post deleted.";
  };

  likeOrDislikeComments = async (
    postLikeOrDislike: likeOrDislikeCommentInputDTO
  ) => {
    const { token, id, like } = postLikeOrDislike;

    const tokenPayload = this.tokenManager.getPayload(token);

    if (!tokenPayload) {
      throw new NotFoundError("User don't exist.");
    }

    const userId = tokenPayload.id;
    const idComment = id;

    let response: string;

    const likeDB: number = !like ? 0 : 1;

    let newUserLikeOrDislikeDB: LikeOrDislikeCommentDB = {
      id_user: userId,
      id_comment: idComment,
      like: likeDB,
    };

    const [commentLikedExistDB] =
      await this.commentLikeOrDislikeDatabase.findLikesAndDislikesById(userId);

    const [commentDB] = await this.commentDatabase.findCommentById(idComment);

    if (!commentDB) {
      throw new NotFoundError("Post not Found.");
    }

    if (commentDB.id_user === userId) {
      throw new BadRequestError(
        "It`s not possible for the creator like or dislike your own comment."
      );
    }

    if (!commentLikedExistDB || commentLikedExistDB.id_comment !== idComment) {
      let updateComment;

      if (!like) {
        updateComment = { ...commentDB, dislikes: commentDB.dislikes + 1 };
      } else {
        updateComment = { ...commentDB, likes: commentDB.likes + 1 };
      }

      await this.commentDatabase.editComment(updateComment, idComment);

      await this.commentLikeOrDislikeDatabase.newLikeOrDislikeComment(
        newUserLikeOrDislikeDB
      );

      response = "Like or dislike updated";
    } else {
      let updateComment: CommentDB | undefined;

      if (!like && commentLikedExistDB.like === null) {
        updateComment = { ...commentDB, dislikes: commentDB.dislikes + 1 };
      } else if (like && commentLikedExistDB.like === null) {
        updateComment = { ...commentDB, likes: commentDB.likes + 1 };
      }

      if (likeDB === commentLikedExistDB.like) {
        likeDB === 0
          ? (updateComment = { ...commentDB, dislikes: commentDB.dislikes - 1 })
          : (updateComment = { ...commentDB, likes: commentDB.likes - 1 });

        newUserLikeOrDislikeDB = { ...newUserLikeOrDislikeDB, like: null };
      }

      if (likeDB === 0 && commentLikedExistDB.like === 1) {
        updateComment = {
          ...commentDB,
          dislikes: commentDB.dislikes + 1,
          likes: commentDB.likes - 1,
        };
      } else if (likeDB === 1 && commentLikedExistDB.like === 0) {
        updateComment = {
          ...commentDB,
          dislikes: commentDB.dislikes - 1,
          likes: commentDB.likes + 1,
        };
      }

      await this.commentDatabase.editComment(
        updateComment as CommentDB,
        idComment
      );

      await this.commentLikeOrDislikeDatabase.updateLikeOrDislikeComment(
        userId,
        idComment,
        newUserLikeOrDislikeDB
      );

      response = "Like or dislike updated";
    }

    return response;
  };
}
