import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
  private USERS_TABLE = "users";

  findUserById = async (id: string): Promise<any> => {
    const user = await BaseDatabase.connection(this.USERS_TABLE).where(id);
    return user;
  };

  findUserByEmail = async (email: string): Promise<any> => {
    const user = await BaseDatabase.connection(this.USERS_TABLE).where(email);
    return user;
  };

  createUser = async (newUser: any): Promise<void> => {
    await BaseDatabase.connection(this.USERS_TABLE).insert(newUser);
  };

  upadateUser = async (upadateUser: any, id: string): Promise<void> => {
    await BaseDatabase.connection(this.USERS_TABLE)
      .update(upadateUser)
      .where(id);
  };

  deleteUser = async (id: string): Promise<void> => {
    await BaseDatabase.connection(this.USERS_TABLE).del().where(id);
  };
}
