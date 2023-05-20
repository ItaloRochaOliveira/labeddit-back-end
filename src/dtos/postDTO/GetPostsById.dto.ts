import { PostModel } from "../../models/Post";
import z from "zod";

export interface GetPostByIdInputDTO {
  token: string;
  idPost: string;
}

export interface GetPostByIdOutputDTO {
  message: string;
  products: PostModel;
}

export const GetPostByIdSchema = z
  .object({
    token: z.string().min(1),
    idPost: z.string().min(1),
  })
  .transform((data) => data as GetPostByIdInputDTO);
