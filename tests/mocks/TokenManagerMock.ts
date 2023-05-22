import { TokenPayload, USER_ROLES } from "../../src/models/User";

export class TokenManagerMock {
  public createToken = (payload: TokenPayload): string => {
    if (payload.id === "new-id-123-mock") {
      return "novo-token-mock";
    } else if (payload.id === "id-admin") {
      return "token-mock-admin";
    } else {
      return "token-mock-normal";
    }
  };

  public getPayload = (token: string): TokenPayload | null => {
    if (token === "token-mock-normal") {
      return {
        id: "id-normal",
        name: "it-user",
        role: USER_ROLES.NORMAL,
      };
    } else if (token === "token-mock-admin") {
      return {
        id: "id-admin",
        name: "it-programmer",
        role: USER_ROLES.ADMIN,
      };
    } else if (token === "token-mock-normal-2") {
      return {
        id: "id-normal-2",
        name: "it-user",
        role: USER_ROLES.NORMAL,
      };
    } else if (token === "token-mock-normal-3") {
      return {
        id: "id-normal-3",
        name: "it-user",
        role: USER_ROLES.NORMAL,
      };
    } else {
      return null;
    }
  };
}
