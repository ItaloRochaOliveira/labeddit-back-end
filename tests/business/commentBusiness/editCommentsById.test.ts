import { ZodError } from "zod";
import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { UpdateCommentScheme } from "../../../src/dtos/commentDTO/updatePost.dto";
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

  test("If comment is updated", async () => {
    const intensForUpdate = UpdateCommentScheme.parse({
      token: "token-mock-admin",
      id: "id-comentario-1",
      content: "updated comment in post",
    });

    const response = await commentBusiness.editCommentsById(intensForUpdate);

    expect(response).toBe("Comment updated.");
  });

  test("If zod errors works", async () => {
    expect.assertions(1);
    try {
      const intensForUpdate = UpdateCommentScheme.parse({
        token: 123,
        id: "",
        content: false,
      });

      const response = await commentBusiness.editCommentsById(intensForUpdate);
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

  test("If inform a wrong token", async () => {
    expect.assertions(2);
    try {
      const intensForUpdate = UpdateCommentScheme.parse({
        token: "token-mock-wrong",
        id: "id-comentario-1",
        content: "updated comment in post",
      });

      const response = await commentBusiness.editCommentsById(intensForUpdate);
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
      const intensForUpdate = UpdateCommentScheme.parse({
        token: "token-mock-admin",
        id: "id-comentario-wrong",
        content: "updated comment in post",
      });

      const response = await commentBusiness.editCommentsById(intensForUpdate);
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
      const intensForUpdate = UpdateCommentScheme.parse({
        token: "token-mock-admin",
        id: "id-comentario-2",
        content: "updated comment in post",
      });

      const response = await commentBusiness.editCommentsById(intensForUpdate);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("Only user can change your own comment");
        expect(error.statusCode).toBe(400);
      }
    }
  });
});
