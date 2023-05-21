import { BadRequestError } from "../customErrors/BadRequestError";
import { NotFoundError } from "../customErrors/NotFoundError";
import { UserDatabase } from "../database/UserDatabase";
import { loginInputDTO, loginOutputDTO } from "../dtos/userDTO/login.dto";
import { signupInputDTO, signupOutputDTO } from "../dtos/userDTO/signup.dto";
import { USER_ROLES, Users } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGerator } from "../services/IdGerator";
import { TokenManager } from "../services/TokenManager";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGerator: IdGerator,
    private hashManager: HashManager,
    private tokenManager: TokenManager
  ) {}

  signup = async (userLogin: signupInputDTO): Promise<signupOutputDTO> => {
    const { name, email, password } = userLogin;

    const [userDB] = await this.userDatabase.findUserByEmail(email);

    if (userDB) {
      throw new BadRequestError("Email alrealdy exists.");
    }

    const id = this.idGerator.gerate();

    const hashPassword = await this.hashManager.hash(password);

    const newUser = new Users(
      id,
      name,
      email,
      hashPassword,
      USER_ROLES.NORMAL,
      new Date().toISOString()
    );

    const newUserDB = newUser.toDBModel();

    await this.userDatabase.createUser(newUserDB);

    const tokenPayload = newUser.toUserPayloadModel();

    const token = this.tokenManager.createToken(tokenPayload);

    const response: loginOutputDTO = {
      message: "user successfully created",
      token,
    };

    return response;
  };

  login = async (userLogin: loginInputDTO): Promise<loginOutputDTO> => {
    const { email, password } = userLogin;

    const [userDB] = await this.userDatabase.findUserByEmail(email);

    if (!userDB) {
      throw new NotFoundError("Email not exist.");
    }

    const hashPassword = userDB.password;

    const isPasswordCorrect = await this.hashManager.compare(
      password,
      hashPassword
    );

    if (!isPasswordCorrect) {
      throw new BadRequestError("Email or password incorrect.");
    }

    const user = new Users(
      userDB.id,
      userDB.name,
      userDB.email,
      userDB.password,
      userDB.role,
      userDB.created_at
    );

    const tokenPayload = user.toUserPayloadModel();

    const token = this.tokenManager.createToken(tokenPayload);

    const response: signupOutputDTO = {
      message: "user successfully logged in",
      token,
    };

    return response;
  };
}
