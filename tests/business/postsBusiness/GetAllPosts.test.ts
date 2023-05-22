import { PostsBusiness } from "../../../src/business/PostsBusiness";
import { PostDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { likeDislikeDatabaseMock } from "../../mocks/likeDislikeDatabaseMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { IdGeratorMock } from "../../mocks/IdGeratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { GetPostSchema } from "../../../src/dtos/postDTO/GetPosts.dto";
import { ZodError } from "zod";
import { NotFoundError } from "../../../src/customErrors/NotFoundError";
import { LikeDislikeCommentDatabaseMock } from "../../mocks/likeDislikeCommentDatabaseMock";

describe("Test GetAllPosts Business", () => {
  const postsBusiness = new PostsBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new likeDislikeDatabaseMock(),
    new CommentDatabaseMock(),
    new TokenManagerMock(),
    new IdGeratorMock(),
    new LikeDislikeCommentDatabaseMock()
  );

  test("If return all posts", async () => {
    const token = GetPostSchema.parse({
      token: "token-mock-normal",
    });

    const posts = await postsBusiness.getAllPosts(token);

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
      },
      {
        id: "id-post-2-mock",
        content: "Segundo post para test",
        likes: 0,
        dislikes: 0,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        creator: {
          id: "id-admin",
          name: "it-programmer",
        },
      },
    ]);
  });

  test("If zod erros works", async () => {
    expect.assertions(1);
    try {
      const token = GetPostSchema.parse({
        token: "",
      });

      const posts = await postsBusiness.getAllPosts(token);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues).toEqual([
          {
            code: "too_small",
            minimum: 1,
            type: "string",
            inclusive: true,
            exact: false,
            message: "String must contain at least 1 character(s)",
            path: ["token"],
          },
        ]);
      }
    }
  });

  test("If send wrong token", async () => {
    expect.assertions(2);
    try {
      const token = GetPostSchema.parse({
        token: "token-mock-wrong",
      });

      const posts = await postsBusiness.getAllPosts(token);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe("User don't exist.");
        expect(error.statusCode).toBe(404);
      }
    }
  });
});
