import { PostsBusiness } from "../../../src/business/PostsBusiness";
import { PostDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { likeDislikeDatabaseMock } from "../../mocks/likeDislikeDatabaseMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { IdGeratorMock } from "../../mocks/IdGeratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { likeOrDislikeScheme } from "../../../src/dtos/postDTO/LikeOrDislike.dto";
import { ZodError } from "zod";
import { NotFoundError } from "../../../src/customErrors/NotFoundError";
import { BadRequestError } from "../../../src/customErrors/BadRequestError";

describe("Test likeOrDislike Business", () => {
  const postsBusiness = new PostsBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new likeDislikeDatabaseMock(),
    new CommentDatabaseMock(),
    new TokenManagerMock(),
    new IdGeratorMock()
  );

  test("If post receives first like", async () => {
    const postLikeOrDislike = likeOrDislikeScheme.parse({
      token: "token-mock-normal",
      id: "id-post-2-mock",
      like: true,
    });

    const response = await postsBusiness.likeOrDislike(postLikeOrDislike);

    expect(response).toBe("Like or dislike updated");
  });

  test("If post receives second like", async () => {
    const postLikeOrDislike = likeOrDislikeScheme.parse({
      token: "token-mock-admin",
      id: "id-post-1-mock",
      like: true,
    });

    const response = await postsBusiness.likeOrDislike(postLikeOrDislike);

    expect(response).toBe("Like or dislike updated");
  });

  test("If post receives first dislike", async () => {
    const postLikeOrDislike = likeOrDislikeScheme.parse({
      token: "token-mock-normal",
      id: "id-post-2-mock",
      like: false,
    });

    const response = await postsBusiness.likeOrDislike(postLikeOrDislike);

    expect(response).toBe("Like or dislike updated");
  });

  test("If post receives second dislike", async () => {
    const postLikeOrDislike = likeOrDislikeScheme.parse({
      token: "token-mock-admin",
      id: "id-post-1-mock",
      like: false,
    });

    const response = await postsBusiness.likeOrDislike(postLikeOrDislike);

    expect(response).toBe("Like or dislike updated");
  });

  test("If zod erros works", async () => {
    expect.assertions(1);
    try {
      const postLikeOrDislike = likeOrDislikeScheme.parse({
        token: 123,
        id: "",
        like: "false",
      });

      const response = await postsBusiness.likeOrDislike(postLikeOrDislike);
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
          {
            code: "invalid_type",
            expected: "boolean",
            received: "string",
            path: ["like"],
            message: "Expected boolean, received string",
          },
        ]);
      }
    }
  });

  test("If send wrong token", async () => {
    expect.assertions(2);
    try {
      const postLikeOrDislike = likeOrDislikeScheme.parse({
        token: "token-mock-wrong",
        id: "id-post-2-mock",
        like: false,
      });

      const response = await postsBusiness.likeOrDislike(postLikeOrDislike);
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
      const postLikeOrDislike = likeOrDislikeScheme.parse({
        token: "token-mock-normal",
        id: "id-post-2-wrong",
        like: true,
      });

      const response = await postsBusiness.likeOrDislike(postLikeOrDislike);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe("Post not Found.");
        expect(error.statusCode).toBe(404);
      }
    }
  });

  test("If a user like you own post", async () => {
    expect.assertions(2);
    try {
      const postLikeOrDislike = likeOrDislikeScheme.parse({
        token: "token-mock-normal",
        id: "id-post-1-mock",
        like: true,
      });

      const response = await postsBusiness.likeOrDislike(postLikeOrDislike);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe(
          "It`s not possible for the creator like or dislike you own comment."
        );
        expect(error.statusCode).toBe(400);
      }
    }
  });
});
