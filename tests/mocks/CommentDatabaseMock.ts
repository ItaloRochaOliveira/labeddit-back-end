import { BaseDatabase } from "../../src/database/BaseDatabase";
import { CommentDB } from "../../src/models/Comment";

const commentsMock: CommentDB[] = [
  {
    id: "id-do-comentario-1",
    id_user: "id-do-admin",
    id_post: "id-do-post-1-mock",
    content: "muito legal esse primeiro teste!",
    likes: 0,
    dislikes: 0,
    created_at: new Date().toISOString(),
    updated_at: "",
  },
  {
    id: "id-do-comentario-2",
    id_user: "id-do-normal",
    id_post: "id-do-post-2-mock",
    content: "muito legal esse segundo teste!",
    likes: 0,
    dislikes: 0,
    created_at: new Date().toISOString(),
    updated_at: "",
  },
];

export class CommentDatabaseMock extends BaseDatabase {
  private COMMENTPOST_TABLE = "comment_post";

  findCommentById = async (id_post: string): Promise<CommentDB[]> => {
    const commentsDB: CommentDB[] = commentsMock.filter(
      (commentMock) => commentMock.id_post === id_post
    );

    return commentsDB;
  };

  createComment = async (newComment: CommentDB): Promise<void> => {};

  editComment = async (newComment: CommentDB, id: string): Promise<any> => {};

  deleteComment = async (id: string): Promise<any> => {};
}