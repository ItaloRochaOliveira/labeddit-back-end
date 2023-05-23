import { UserBusiness } from "../../../src/business/UserBusiness";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { IdGeratorMock } from "../../mocks/IdGeratorMock";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { signupScheme } from "../../../src/dtos/userDTO/signup.dto";
import { ZodError } from "zod";
import { BadRequestError } from "../../../src/customErrors/BadRequestError";

describe("Test Signup Business", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeratorMock(),
    new HashManagerMock(),
    new TokenManagerMock()
  );

  test("If signup return message and sign up user", async () => {
    const input = signupScheme.parse({
      name: "new-user",
      email: "new-email@email.com",
      password: "New-pass1",
    });

    const output = await userBusiness.signup(input);

    expect(output).toEqual({
      message: "user successfully created",
      token: "novo-token-mock",
    });
  });

  test("if zod errors works", async () => {
    expect.assertions(1);
    try {
      const input = signupScheme.parse({
        name: "",
        email: 123,
        password: "",
      });

      const output = await userBusiness.signup(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues).toEqual([
          {
            code: "too_small",
            exact: false,
            inclusive: true,
            message: "String must contain at least 1 character(s)",
            minimum: 1,
            path: ["name"],
            type: "string",
          },
          {
            code: "invalid_type",
            expected: "string",
            message: "Expected string, received number",
            path: ["email"],
            received: "number",
          },
          {
            code: "invalid_string",
            message:
              "The password must have 8 to 12 character, with uppercase and lowercase letter. Must to be minimum of one number and one character special",
            path: ["password"],
            validation: "regex",
          },
        ]);
      }
    }
  });

  test("Test if user already exist", async () => {
    expect.assertions(2);
    try {
      const input = signupScheme.parse({
        name: "it-normal",
        email: "it-programmer@gmail.com",
        password: "Passw1/rd",
      });

      const output = await userBusiness.signup(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("Email alrealdy exists.");
        expect(error.statusCode).toBe(400);
      }
    }
  });

  test("If return error and request a password strong", async () => {
    expect.assertions(1);
    try {
      const input = signupScheme.parse({
        name: "new-user",
        email: "new-user@gmail.com",
        password: "Passw1",
      });

      const output = await userBusiness.signup(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues).toEqual([
          {
            code: "invalid_string",
            message:
              "The password must have 8 to 12 character, with uppercase and lowercase letter. Must to be minimum of one number and one character special",
            path: ["password"],
            validation: "regex",
          },
        ]);
      }
    }
  });
});
