import { PostsBusiness } from "../../../src/business/PostsBusiness";
import { PostDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { likeDislikeDatabaseMock } from "../../mocks/likeDislikeDatabaseMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { IdGeratorMock } from "../../mocks/IdGeratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { CreatePostScheme } from "../../../src/dtos/postDTO/createPost.dto";
import { ZodError } from "zod";
import { NotFoundError } from "../../../src/customErrors/NotFoundError";

describe("Test createPost Business", () => {
  const postsBusiness = new PostsBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new likeDislikeDatabaseMock(),
    new CommentDatabaseMock(),
    new TokenManagerMock(),
    new IdGeratorMock()
  );

  test("If post created", async () => {
    const userPost = CreatePostScheme.parse({
      token: "token-mock-normal",
      content: "new content post",
    });

    const result = await postsBusiness.createPost(userPost);

    expect(result).toBe("Post successfully created.");
  });

  test("If zod erros works", async () => {
    expect.assertions(1);
    try {
      const userPost = CreatePostScheme.parse({
        token: 123,
        content: "",
      });

      const result = await postsBusiness.createPost(userPost);
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
        ]);
      }
    }
  });

  test("If send wrong token", async () => {
    expect.assertions(2);
    try {
      const userPost = CreatePostScheme.parse({
        token: "token-mock-wrong",
        content: "new content post",
      });

      const result = await postsBusiness.createPost(userPost);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe("User don't exist.");
        expect(error.statusCode).toBe(404);
      }
    }
  });
});
