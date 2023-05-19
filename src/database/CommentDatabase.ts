import { CommentDB } from "../models/Comment";
import { BaseDatabase } from "./BaseDatabase";

export class CommentDatabase extends BaseDatabase {
  private COMMENTPOST_TABLE = "comment_post";

  findCommentById = async (id_post: string): Promise<CommentDB[]> => {
    const commentsDB: CommentDB[] = await BaseDatabase.connection(
      this.COMMENTPOST_TABLE
    ).where(id_post);

    return commentsDB;
  };

  createComment = async (newComment: CommentDB): Promise<void> => {
    await BaseDatabase.connection(this.COMMENTPOST_TABLE).insert(newComment);
  };

  editComment = async (newComment: CommentDB, id: string): Promise<any> => {
    await BaseDatabase.connection(this.COMMENTPOST_TABLE)
      .update(newComment)
      .where(id);
  };

  deleteComment = async (id: string): Promise<any> => {
    await BaseDatabase.connection(this.COMMENTPOST_TABLE).del().where(id);
  };
}
