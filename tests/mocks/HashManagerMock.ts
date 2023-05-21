export class HashManagerMock {
  public hash = async (plaintext: string): Promise<string> => {
    return "new-hash-mock";
  };

  public compare = async (
    plaintext: string,
    hash: string
  ): Promise<boolean> => {
    // return bcrypt.compare(plaintext, hash);

    switch (plaintext) {
      case "Senha/123AA":
        return hash === "hash-mock-admin-it-programer";
      case "1a/3()0SST2":
        return hash === "hash-mock-normal-it-user";

      default:
        return false;
    }
  };
}
