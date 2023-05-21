import { UserBusiness } from "../../../src/business/UserBusiness";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { IdGeratorMock } from "../../mocks/IdGeratorMock";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { loginScheme } from "../../../src/dtos/userDTO/login.dto";

describe("Test Signup Business", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeratorMock(),
    new HashManagerMock(),
    new TokenManagerMock()
  );

  test("If login return user login sucessfully and token", async () => {
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
});
