import { BaseDatabase } from "../../src/database/BaseDatabase";
import { USER_ROLES, UserDB } from "../../src/models/User";

const usersMock: UserDB[] = [
  {
    id: "id-do-admin",
    name: "it-programmer",
    email: "it-programmer@gmail.com",
    password: "hash-mock-admin-it-programer",
    role: USER_ROLES.ADMIN,
    created_at: new Date().toISOString(),
  },
  {
    id: "id-do-normal",
    name: "it-user",
    email: "it-normal@gmail.com",
    password: USER_ROLES.NORMAL,
    role: USER_ROLES.NORMAL,
    created_at: new Date().toISOString(),
  },
];

export class UserDatabaseMock extends BaseDatabase {
  private USERS_TABLE = "users";

  findUserById = async (id: string): Promise<UserDB[]> => {
    const user: UserDB[] = usersMock.filter((userMock) => userMock.id === id);

    return user;
  };

  findUserByEmail = async (email: string): Promise<UserDB[]> => {
    const user: UserDB[] = usersMock.filter(
      (userMock) => userMock.email === email
    );

    return user;
  };

  createUser = async (newUser: UserDB): Promise<void> => {};

  upadateUser = async (upadateUser: UserDB, id: string): Promise<void> => {};

  deleteUser = async (id: string): Promise<void> => {};
}
