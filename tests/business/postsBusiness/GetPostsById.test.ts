import { PostsBusiness } from "../../../src/business/PostsBusiness";
import { PostDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { likeDislikeDatabaseMock } from "../../mocks/likeDislikeDatabaseMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { IdGeratorMock } from "../../mocks/IdGeratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { GetPostByIdSchema } from "../../../src/dtos/postDTO/GetPostsById.dto";
import { ZodError } from "zod";
import { NotFoundError } from "../../../src/customErrors/NotFoundError";
import { LikeDislikeCommentDatabaseMock } from "../../mocks/likeDislikeCommentDatabaseMock";

describe("Test getPostsById Business", () => {
  const postsBusiness = new PostsBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new likeDislikeDatabaseMock(),
    new CommentDatabaseMock(),
    new TokenManagerMock(),
    new IdGeratorMock(),
    new LikeDislikeCommentDatabaseMock()
  );

  test("If return posts by id", async () => {
    const input = GetPostByIdSchema.parse({
      idPost: "id-post-1-mock",
      token: "token-mock-normal",
    });

    const posts = await postsBusiness.getPostsById(input);

    expect(posts).toEqual([
      {
        id: "id-post-1-mock",
        content: "Primeiro post para test",
        likes: 1,
        dislikes: 1,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        creator: {
          id: "id-normal",
          name: "it-user",
        },
        comments: [
          {
            content: "muito legal esse primeiro teste!",
            createdAt: expect.any(String),
            dislikes: 0,
            id: "id-comentario-1",
            idPost: "id-post-1-mock",
            idUser: "id-admin",
            likes: 0,
            updatedAt: expect.any(String),
          },
        ],
      },
    ]);
  });

  test("If zod erros works", async () => {
    expect.assertions(1);
    try {
      const input = GetPostByIdSchema.parse({
        idPost: "",
        token: 123,
      });

      const posts = await postsBusiness.getPostsById(input);
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
            path: ["idPost"],
          },
        ]);
      }
    }
  });

  test("If send wrong token", async () => {
    expect.assertions(2);
    try {
      const input = GetPostByIdSchema.parse({
        idPost: "id-post-1-mock",
        token: "token-mock-wrong",
      });

      const posts = await postsBusiness.getPostsById(input);
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
      const input = GetPostByIdSchema.parse({
        idPost: "id-post-wrong",
        token: "token-mock-normal",
      });

      const posts = await postsBusiness.getPostsById(input);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe("Post with this id don't exist.");
        expect(error.statusCode).toBe(404);
      }
    }
  });
});
