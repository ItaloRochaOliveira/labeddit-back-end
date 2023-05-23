import { ZodError } from "zod";
import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { CreateCommentScheme } from "../../../src/dtos/commentDTO/createComment.dto";
import { IdGerator } from "../../../src/services/IdGerator";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { PostDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { LikeDislikeCommentDatabaseMock } from "../../mocks/likeDislikeCommentDatabaseMock";
import { NotFoundError } from "../../../src/customErrors/NotFoundError";
import { BadRequestError } from "../../../src/customErrors/BadRequestError";

describe("Test CreateComment Business", () => {
  const commentBusiness = new CommentBusiness(
    new PostDatabaseMock(),
    new CommentDatabaseMock(),
    new LikeDislikeCommentDatabaseMock(),
    new TokenManagerMock(),
    new IdGerator()
  );

  test("If create comment works", async () => {
    const userComment = CreateCommentScheme.parse({
      token: "token-mock-normal",
      content: "comment a first post",
      idPost: "id-post-2-mock",
    });

    const result = await commentBusiness.createCommentsByIdPost(userComment);

    expect(result).toBe("Comment successfully created.");
  });

  test("If zod errors works", async () => {
    expect.assertions(1);
    try {
      const userComment = CreateCommentScheme.parse({
        token: 123,
        content: "",
        idPost: false,
      });

      const result = await commentBusiness.createCommentsByIdPost(userComment);
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
            message: "String must contain at least 1 character(s)",
            path: ["content"],
          },
          {
            code: "invalid_type",
            expected: "string",
            received: "boolean",
            path: ["idPost"],
            message: "Expected string, received boolean",
          },
        ]);
      }
    }
  });

  test("If inform a wrong token", async () => {
    expect.assertions(2);
    try {
      const userComment = CreateCommentScheme.parse({
        token: "token-mock-wrong",
        content: "comment a first post",
        idPost: "id-post-1-mock",
      });

      const result = await commentBusiness.createCommentsByIdPost(userComment);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe("User don't exist.");
        expect(error.statusCode).toBe(404);
      }
    }
  });

  test("If inform id post wrong ", async () => {
    expect.assertions(2);
    try {
      const userComment = CreateCommentScheme.parse({
        token: "token-mock-normal",
        content: "comment a first post",
        idPost: "id-post-1-wrong",
      });

      const result = await commentBusiness.createCommentsByIdPost(userComment);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe("Post not exist.");
        expect(error.statusCode).toBe(404);
      }
    }
  });

  test("If return error when user try comment your own post", async () => {
    expect.assertions(2);
    try {
      const userComment = CreateCommentScheme.parse({
        token: "token-mock-normal",
        content: "comment a first post",
        idPost: "id-post-1-mock",
      });

      const result = await commentBusiness.createCommentsByIdPost(userComment);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe(
          "It's not possible for the creator like or dislike your own comment."
        );
        expect(error.statusCode).toBe(400);
      }
    }
  });
});
