import { PostsBusiness } from "../../../src/business/PostsBusiness";
import { PostDatabaseMock } from "../../mocks/PostsDatabaseMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { likeDislikeDatabaseMock } from "../../mocks/likeDislikeDatabaseMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { IdGeratorMock } from "../../mocks/IdGeratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UpdatePostScheme } from "../../../src/dtos/postDTO/updatePost.dto";
import { ZodError } from "zod";
import { NotFoundError } from "../../../src/customErrors/NotFoundError";
import { BadRequestError } from "../../../src/customErrors/BadRequestError";

describe("Test editPost Business", () => {
  const postsBusiness = new PostsBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new likeDislikeDatabaseMock(),
    new CommentDatabaseMock(),
    new TokenManagerMock(),
    new IdGeratorMock()
  );

  test("If edit post successfully", async () => {
    const intensForUpdate = UpdatePostScheme.parse({
      token: "token-mock-normal",
      id: "id-post-1-mock",
      content: "this post was updated",
    });

    const response = await postsBusiness.editPost(intensForUpdate);

    expect(response).toBe("Post updated.");
  });

  test("If zod erros works", async () => {
    expect.assertions(1);
    try {
      const intensForUpdate = UpdatePostScheme.parse({
        token: 123,
        id: "",
        content: false,
      });

      const response = await postsBusiness.editPost(intensForUpdate);
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
            expected: "string",
            received: "boolean",
            path: ["content"],
            message: "Expected string, received boolean",
          },
        ]);
      }
    }
  });

  test("If send wrong token", async () => {
    expect.assertions(2);
    try {
      const intensForUpdate = UpdatePostScheme.parse({
        token: "token-mock-wrong",
        id: "id-post-1-mock",
        content: "this post was updated",
      });

      const response = await postsBusiness.editPost(intensForUpdate);
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
      const intensForUpdate = UpdatePostScheme.parse({
        token: "token-mock-normal",
        id: "id-post-1-wrong",
        content: "this post was updated",
      });

      const response = await postsBusiness.editPost(intensForUpdate);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe("Post not found.");
        expect(error.statusCode).toBe(404);
      }
    }
  });

  test("If send wrong user", async () => {
    expect.assertions(2);
    try {
      const intensForUpdate = UpdatePostScheme.parse({
        token: "token-mock-admin",
        id: "id-post-1-mock",
        content: "this post was updated",
      });

      const response = await postsBusiness.editPost(intensForUpdate);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("only the user can update the post");
        expect(error.statusCode).toBe(400);
      }
    }
  });
});
