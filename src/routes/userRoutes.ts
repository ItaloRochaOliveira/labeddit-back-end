import express from "express";
import { UserController } from "../controller/UserController";
import { UserBusiness } from "../business/UserBusiness";
import { UserDatabase } from "../database/UserDatabase";
import { IdGerator } from "../services/IdGerator";
import { HashManager } from "../services/HashManager";
import { TokenManager } from "../services/TokenManager";

export const userRoutes = express.Router();

const userController = new UserController(
  new UserBusiness(
    new UserDatabase(),
    new IdGerator(),
    new HashManager(),
    new TokenManager()
  )
);

userRoutes.post("/signup", userController.signup);
userRoutes.post("/login", userController.login);
