import { ZodError } from "zod";
import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { IdGerator } from "../../../src/services/IdGerator";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { PostDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { LikeDislikeCommentDatabaseMock } from "../../mocks/likeDislikeCommentDatabaseMock";
import { NotFoundError } from "../../../src/customErrors/NotFoundError";
import { BadRequestError } from "../../../src/customErrors/BadRequestError";
import { DeleteCommentScheme } from "../../../src/dtos/commentDTO/deletePost.dto";

describe("Test CreateComment Business", () => {
  const commentBusiness = new CommentBusiness(
    new PostDatabaseMock(),
    new CommentDatabaseMock(),
    new LikeDislikeCommentDatabaseMock(),
    new TokenManagerMock(),
    new IdGerator()
  );

  test("If user can delete your own comment", async () => {
    const CommentForDelete = DeleteCommentScheme.parse({
      token: "token-mock-admin",
      id: "id-comentario-1",
    });

    const response = await commentBusiness.deleteCommentsById(CommentForDelete);

    expect(response).toBe("Post deleted.");
  });

  test("If zod errors works", async () => {
    expect.assertions(1);
    try {
      const CommentForDelete = DeleteCommentScheme.parse({
        token: 123,
        id: "",
      });

      const response = await commentBusiness.deleteCommentsById(
        CommentForDelete
      );
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues).toEqual([
          {
            code: "invalid_type",
            expected: "string",
            received: "number",
            path: ["token"],
            message: "Expected string, received number",
          },
          {
            code: "too_small",
            minimum: 1,
            type: "string",
            inclusive: true,
            exact: false,
            message: "'id' must be at least 1 characters.",
            path: ["id"],
          },
        ]);
      }
    }
  });

  test("If inform a wrong token", async () => {
    expect.assertions(2);
    try {
      const CommentForDelete = DeleteCommentScheme.parse({
        token: "token-mock-wrong",
        id: "id-comentario-1",
      });

      const response = await commentBusiness.deleteCommentsById(
        CommentForDelete
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe("User don't exist.");
        expect(error.statusCode).toBe(404);
      }
    }
  });

  test("If inform id wrong ", async () => {
    expect.assertions(2);
    try {
      const CommentForDelete = DeleteCommentScheme.parse({
        token: "token-mock-admin",
        id: "id-comentario-wrong",
      });

      const response = await commentBusiness.deleteCommentsById(
        CommentForDelete
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe("comment not found.");
        expect(error.statusCode).toBe(404);
      }
    }
  });

  test("If user is not the owner", async () => {
    expect.assertions(2);
    try {
      const CommentForDelete = DeleteCommentScheme.parse({
        token: "token-mock-normal",
        id: "id-comentario-1",
      });

      const response = await commentBusiness.deleteCommentsById(
        CommentForDelete
      );
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("Only user can delete your own comment");
        expect(error.statusCode).toBe(400);
      }
    }
  });
});
