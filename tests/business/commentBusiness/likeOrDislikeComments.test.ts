import { ZodError } from "zod";
import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { IdGerator } from "../../../src/services/IdGerator";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { PostDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { LikeDislikeCommentDatabaseMock } from "../../mocks/likeDislikeCommentDatabaseMock";
import { NotFoundError } from "../../../src/customErrors/NotFoundError";
import { BadRequestError } from "../../../src/customErrors/BadRequestError";
import { likeOrDislikeCommentScheme } from "../../../src/dtos/commentDTO/LikeOrDislikeComment.dto";

describe("Test likeOrDislikeComments Business", () => {
  const commentBusiness = new CommentBusiness(
    new PostDatabaseMock(),
    new CommentDatabaseMock(),
    new LikeDislikeCommentDatabaseMock(),
    new TokenManagerMock(),
    new IdGerator()
  );

  test("If post receives first like", async () => {
    const commentLikeOrDislike = likeOrDislikeCommentScheme.parse({
      token: "token-mock-admin",
      id: "id-comentario-2",
      like: true,
    });

    const response = await commentBusiness.likeOrDislikeComments(
      commentLikeOrDislike
    );

    expect(response).toBe("Like or dislike updated");
  });

  test("If post receives second like", async () => {
    const commentLikeOrDislike = likeOrDislikeCommentScheme.parse({
      token: "token-mock-normal",
      id: "id-comentario-1",
      like: true,
    });

    const response = await commentBusiness.likeOrDislikeComments(
      commentLikeOrDislike
    );

    expect(response).toBe("Like or dislike updated");
  });

  test("If post receives first dislike", async () => {
    const commentLikeOrDislike = likeOrDislikeCommentScheme.parse({
      token: "token-mock-admin",
      id: "id-comentario-2",
      like: false,
    });

    const response = await commentBusiness.likeOrDislikeComments(
      commentLikeOrDislike
    );

    expect(response).toBe("Like or dislike updated");
  });

  test("If post receives second dislike", async () => {
    const commentLikeOrDislike = likeOrDislikeCommentScheme.parse({
      token: "token-mock-normal",
      id: "id-comentario-1",
      like: false,
    });

    const response = await commentBusiness.likeOrDislikeComments(
      commentLikeOrDislike
    );

    expect(response).toBe("Like or dislike updated");
  });

  test("If like in post with like", async () => {
    const commentLikeOrDislike = likeOrDislikeCommentScheme.parse({
      token: "token-mock-normal-2",
      id: "id-comentario-2",
      like: true,
    });

    const response = await commentBusiness.likeOrDislikeComments(
      commentLikeOrDislike
    );

    expect(response).toBe("Like or dislike updated");
  });

  test("If dislike in post with like", async () => {
    const commentLikeOrDislike = likeOrDislikeCommentScheme.parse({
      token: "token-mock-normal-3",
      id: "id-comentario-2",
      like: true,
    });

    const response = await commentBusiness.likeOrDislikeComments(
      commentLikeOrDislike
    );

    expect(response).toBe("Like or dislike updated");
  });

  test("If like in post with dislike", async () => {
    const commentLikeOrDislike = likeOrDislikeCommentScheme.parse({
      token: "token-mock-normal-2",
      id: "id-comentario-2",
      like: false,
    });

    const response = await commentBusiness.likeOrDislikeComments(
      commentLikeOrDislike
    );

    expect(response).toBe("Like or dislike updated");
  });

  test("If zod erros works", async () => {
    expect.assertions(1);
    try {
      const commentLikeOrDislike = likeOrDislikeCommentScheme.parse({
        token: 123,
        id: "",
        like: "false",
      });

      const response = await commentBusiness.likeOrDislikeComments(
        commentLikeOrDislike
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
      const commentLikeOrDislike = likeOrDislikeCommentScheme.parse({
        token: "token-mock-wrong",
        id: "id-comentario-1",
        like: true,
      });

      const response = await commentBusiness.likeOrDislikeComments(
        commentLikeOrDislike
      );
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe("User don't exist.");
        expect(error.statusCode).toBe(404);
      }
    }
  });

  test("If send wrong id", async () => {
    expect.assertions(2);
    try {
      const commentLikeOrDislike = likeOrDislikeCommentScheme.parse({
        token: "token-mock-admin",
        id: "id-comentario-wrong",
        like: true,
      });

      const response = await commentBusiness.likeOrDislikeComments(
        commentLikeOrDislike
      );
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
      const commentLikeOrDislike = likeOrDislikeCommentScheme.parse({
        token: "token-mock-admin",
        id: "id-comentario-1",
        like: true,
      });

      const response = await commentBusiness.likeOrDislikeComments(
        commentLikeOrDislike
      );
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
