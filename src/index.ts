import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { userRoutes } from "./routes/userRoutes";
import { postsRoutes } from "./routes/postsRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.listen(Number(process.env.PORT) || 3003, () => {
  console.log(`Servidor rodando na porta ${Number(process.env.PORT) || 3003}`);
});

app.use("/user", userRoutes);
app.use("post", postsRoutes);
