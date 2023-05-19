import { UserDB } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
  private USERS_TABLE = "users";

  findUserById = async (id: string): Promise<UserDB[]> => {
    const user: UserDB[] = await BaseDatabase.connection(
      this.USERS_TABLE
    ).where(id);
    return user;
  };

  findUserByEmail = async (email: string): Promise<UserDB[]> => {
    const user: UserDB[] = await BaseDatabase.connection(
      this.USERS_TABLE
    ).where(email);
    return user;
  };

  createUser = async (newUser: UserDB): Promise<void> => {
    await BaseDatabase.connection(this.USERS_TABLE).insert(newUser);
  };

  upadateUser = async (upadateUser: UserDB, id: string): Promise<void> => {
    await BaseDatabase.connection(this.USERS_TABLE)
      .update(upadateUser)
      .where(id);
  };

  deleteUser = async (id: string): Promise<void> => {
    await BaseDatabase.connection(this.USERS_TABLE).del().where(id);
  };
}
