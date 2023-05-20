export class HashManager {
  public hash = async (plaintext: string): Promise<string> => {
    return "new-hash-mock";
  };

  public compare = async (
    plaintext: string,
    hash: string
  ): Promise<boolean> => {
    // return bcrypt.compare(plaintext, hash);

    switch (plaintext) {
      case "12345":
        return hash === "hash-mock-admin-it-programer";
      case "54321":
        return hash === "hash-mock-normal-it-user";

      default:
        return false;
    }
  };
}
