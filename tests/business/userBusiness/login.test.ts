import { UserBusiness } from "../../../src/business/UserBusiness";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { IdGeratorMock } from "../../mocks/IdGeratorMock";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { loginScheme } from "../../../src/dtos/userDTO/login.dto";
import { ZodError } from "zod";
import { NotFoundError } from "../../../src/customErrors/NotFoundError";
import { BadRequestError } from "../../../src/customErrors/BadRequestError";

describe("Test Login Business", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeratorMock(),
    new HashManagerMock(),
    new TokenManagerMock()
  );

  test("If login return login sucessfully and token of user admin", async () => {
    const user = loginScheme.parse({
      email: "it-programmer@gmail.com",
      password: "Senha/123AA",
    });

    const output = await userBusiness.login(user);

    expect(output).toEqual({
      message: "user successfully logged in",
      token: "token-mock-admin",
    });
  });

  test("If login return user normal login sucessfully and token", async () => {
    const user = loginScheme.parse({
      email: "it-normal@gmail.com",
      password: "1a/3()0SST2",
    });

    const output = await userBusiness.login(user);

    expect(output).toEqual({
      message: "user successfully logged in",
      token: "token-mock-normal",
    });
  });

  test("If zod error works", async () => {
    expect.assertions(1);
    try {
      const user = loginScheme.parse({
        email: "random",
        password: 123,
      });

      const output = await userBusiness.login(user);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues).toEqual([
          {
            code: "invalid_string",
            message: "Invalid email",
            path: ["email"],
            validation: "email",
          },
          {
            code: "invalid_type",
            expected: "string",
            received: "number",
            path: ["password"],
            message: "Expected string, received number",
          },
        ]);
      }
    }
  });

  test("If NotFoundError works", async () => {
    expect.assertions(2);
    try {
      const user = loginScheme.parse({
        email: "random-user@gmail.com",
        password: "Senha/123AA",
      });

      const output = await userBusiness.login(user);
    } catch (error) {
      if (error instanceof NotFoundError) {
        expect(error.message).toBe("Email not exist.");
        expect(error.statusCode).toBe(404);
      }
    }
  });

  test("If BadRequestError works", async () => {
    expect.assertions(2);
    try {
      const user = loginScheme.parse({
        email: "it-programmer@gmail.com",
        password: "Senh/23AA21",
      });

      const output = await userBusiness.login(user);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("Email or password incorrect.");
        expect(error.statusCode).toBe(400);
      }
    }
  });
});
