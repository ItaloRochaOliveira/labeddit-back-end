import { BaseDatabase } from "../../src/database/BaseDatabase";
import { USER_ROLES, UserDB } from "../../src/models/User";

const usersMock: UserDB[] = [
  {
    id: "id-admin",
    name: "it-programmer",
    email: "it-programmer@gmail.com",
    password: "hash-mock-admin-it-programer",
    role: USER_ROLES.ADMIN,
    created_at: new Date().toISOString(),
  },
  {
    id: "id-normal",
    name: "it-user",
    email: "it-normal@gmail.com",
    password: "hash-mock-normal-it-user",
    role: USER_ROLES.NORMAL,
    created_at: new Date().toISOString(),
  },
  {
    id: "id-normal-2",
    name: "it-user",
    email: "it-normal-2@gmail.com",
    password: "hash-mock-normal-it-user-2",
    role: USER_ROLES.NORMAL,
    created_at: new Date().toISOString(),
  },
  {
    id: "id-normal-3",
    name: "it-user",
    email: "it-normal-3@gmail.com",
    password: "hash-mock-normal-it-user-3",
    role: USER_ROLES.NORMAL,
    created_at: new Date().toISOString(),
  },
];

export class UserDatabaseMock extends BaseDatabase {
  private static USERS_TABLE = "users";

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
