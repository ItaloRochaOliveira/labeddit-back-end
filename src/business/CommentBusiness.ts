import { NotFoundError } from "../customErrors/NotFoundError";
import { CommentDatabase } from "../database/CommentDatabase";
import { LikeDislikeCommentDatabase } from "../database/LikeDislikeCommentDatabase";
import { likeDislikeDatabase } from "../database/LikeDislikeDatabase";
import { PostDatabase } from "../database/PostsDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { GetCommentInputDTO } from "../dtos/commentDTO/GetComments.dto";
import { CreateCommentInputDTO } from "../dtos/commentDTO/createComment.dto";
import { DeleteCommentInputDTO } from "../dtos/commentDTO/deletePost.dto";
import { UpdateCommentInputDTO } from "../dtos/commentDTO/updatePost.dto";
import { Comment, CommentModel } from "../models/Comment";
import { PostModel } from "../models/Post";
import { IdGerator } from "../services/IdGerator";
import { TokenManager } from "../services/TokenManager";

export class CommentBusiness {
  constructor(
    private postsDatabase: PostDatabase,
    private userDatabase: UserDatabase,
    private likesOrDislikeDatabase: likeDislikeDatabase,
    private commentDatabase: CommentDatabase,
    private commentLikeOrDislikeDatabase: LikeDislikeCommentDatabase,
    private tokenManager: TokenManager,
    private idGerator: IdGerator
  ) {}

  getCommentsByIdPost = async ({
    token,
    idPost,
  }: GetCommentInputDTO): Promise<CommentModel[]> => {
    const tokenPayload = this.tokenManager.getPayload(token);

    if (!tokenPayload) {
      throw new NotFoundError("User don`t exist.");
    }

    const commentsDB = await this.commentDatabase.findCommentById(idPost);

    if (!commentsDB.length) {
      throw new NotFoundError("Post not exist.");
    }

    let comments: CommentModel[] = [];

    for (let commentDB of commentsDB) {
      const comment = new Comment(
        commentDB.id,
        commentDB.id_post,
        commentDB.id_user,
        commentDB.content,
        commentDB.likes,
        commentDB.dislikes,
        commentDB.created_at,
        commentDB.updated_at
      );

      const commentToResullt: CommentModel = {
        id: comment.ID,
        idUser: comment.IDUSER,
        idPost: comment.IDPOST,
        content: comment.CONTENT,
        likes: comment.LIKES,
        dislikes: comment.DISLIKES,
        createdAt: comment.CREATEDAT,
        updatedAt: comment.CREATEDAT,
      };

      comments.push(commentToResullt);
    }

    return comments;
  };

  createCommentsByIdPost = async (
    input: CreateCommentInputDTO
  ): Promise<string> => {
    const { token, content, idPost } = input;
    const tokenPayload = this.tokenManager.getPayload(token);

    if (!tokenPayload) {
      throw new NotFoundError("User don`t exist.");
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

    return "Comment successfully created ";
  };

  editCommentsByIdPost = async (
    input: UpdateCommentInputDTO
  ): Promise<string> => {
    const { token, id, idPost, content } = input;

    const tokenPayload = this.tokenManager.getPayload(token);

    if (!tokenPayload) {
      throw new NotFoundError("Usuário inexistente.");
    }

    const userId = tokenPayload.id;

    const [postDB] = await this.postsDatabase.findPostById(id);

    if (!postDB) {
      throw new NotFoundError("Post not found.");
    }

    const [commentDB] = await this.commentDatabase.findCommentById(id);

    if (!commentDB) {
      throw new NotFoundError("comment not found.");
    }

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

    content && (newComment.CONTENT = content);

    const updatePostDB = newComment.CommentToDB();

    await this.postsDatabase.editPost(updatePostDB, id);

    return "Post updated.";
  };

  deleteCommentsByIdPost = async (
    commentForDelete: DeleteCommentInputDTO
  ): Promise<string> => {
    const { token, id } = commentForDelete;

    const tokenPayload = this.tokenManager.getPayload(token);

    if (!tokenPayload) {
      throw new NotFoundError("Usuário inexistente.");
    }

    // await this.likeOrDislikeComments(id);

    await this.commentDatabase.deleteComment(id);

    return "Post deleted.";
  };

  likeOrDislikeComments = () => {};
}
