import { PostsBusiness } from "../../../src/business/PostsBusiness";
import { PostDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { likeDislikeDatabaseMock } from "../../mocks/likeDislikeDatabaseMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { IdGeratorMock } from "../../mocks/IdGeratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { DeletePostScheme } from "../../../src/dtos/postDTO/deletePost.dto";
import { ZodError } from "zod";
import { NotFoundError } from "../../../src/customErrors/NotFoundError";
import { BadRequestError } from "../../../src/customErrors/BadRequestError";
import { LikeDislikeCommentDatabaseMock } from "../../mocks/likeDislikeCommentDatabaseMock";

describe("Test deletePost Business", () => {
  const postsBusiness = new PostsBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new likeDislikeDatabaseMock(),
    new CommentDatabaseMock(),
    new TokenManagerMock(),
    new IdGeratorMock(),
    new LikeDislikeCommentDatabaseMock()
  );

  test("If delete post successfully", async () => {
    const postForDelete = DeletePostScheme.parse({
      token: "token-mock-normal",
      id: "id-post-1-mock",
    });

    const response = await postsBusiness.deletePost(postForDelete);

    expect(response).toBe("Post deleted.");
  });

  test("If zod erros works", async () => {
    expect.assertions(1);
    try {
      const postForDelete = DeletePostScheme.parse({
        token: 123,
        id: "",
      });

      const response = await postsBusiness.deletePost(postForDelete);
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

  test("If send wrong token", async () => {
    expect.assertions(2);
    try {
      const postForDelete = DeletePostScheme.parse({
        token: "token-mock-wrong",
        id: "id-post-1-mock",
      });

      const response = await postsBusiness.deletePost(postForDelete);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe("User don't exist.");
        expect(error.statusCode).toBe(404);
      }
    }
  });

  test("If send wrong id post", async () => {
    expect.assertions(2);
    try {
      const postForDelete = DeletePostScheme.parse({
        token: "token-mock-normal",
        id: "id-post-1-wrong",
      });

      const response = await postsBusiness.deletePost(postForDelete);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe("Post not found.");
        expect(error.statusCode).toBe(404);
      }
    }
  });

  test("If send wrong user no owner", async () => {
    expect.assertions(2);
    try {
      const postForDelete = DeletePostScheme.parse({
        token: "token-mock-normal",
        id: "id-post-2-mock",
      });

      const response = await postsBusiness.deletePost(postForDelete);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("only the user can update the post");
        expect(error.statusCode).toBe(400);
      }
    }
  });
});
