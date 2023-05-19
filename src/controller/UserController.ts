import { Request, Response } from "express";
// import { userBusiness } from "../business/UsersBusiness";
import { signupScheme } from "../dtos/userDTO/signup.dto";
import { loginScheme } from "../dtos/userDTO/login.dto";
import { BaseError } from "../customErrors/BaseError";
import { ZodError } from "zod";
import { UserBusiness } from "../business/UserBusiness";

export class UserController {
  constructor(private userBusiness: UserBusiness) {}

  signup = async (req: Request, res: Response) => {
    try {
      const newUser = signupScheme.parse({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      const response = await this.userBusiness.signup(newUser);

      res.status(200).send(response);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("erro inesperado");
      }
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const user = loginScheme.parse({
        email: req.body.email,
        password: req.body.password,
      });

      const response = await this.userBusiness.login(user);

      res.status(200).send(response);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("erro inesperado");
      }
    }
  };
}
