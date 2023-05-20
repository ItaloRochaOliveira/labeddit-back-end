import { TokenPayload, USER_ROLES } from "../../src/models/User";

export class TokenManager {
  public createToken = (payload: TokenPayload): string => {
    if (payload.id === "new-id-123-mock") {
      return "novo-token-mock";
    } else if (payload.id === "id-do-admin") {
      return "token-mock-admin";
    } else {
      return "token-mock-normal";
    }
  };

  public getPayload = (token: string): TokenPayload | null => {
    if (token === "token-mock-normal") {
      return {
        id: "id-do-normal",
        name: "it-user",
        role: USER_ROLES.NORMAL,
      };
    } else if (token === "token-mock-admin") {
      return {
        id: "id-do-admin",
        name: "it-programmer",
        role: USER_ROLES.ADMIN,
      };
    } else {
      return null;
    }
  };
}
