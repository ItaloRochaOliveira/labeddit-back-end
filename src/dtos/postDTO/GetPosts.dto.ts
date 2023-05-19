import { PostModel } from "../../models/Post";
import z from "zod";

export interface GetPostInputDTO {
  token: string;
}

export interface GetPostOutputDTO {
  message: string;
  products: PostModel;
}

export const GetPostSchema = z
  .object({
    token: z.string().min(1),
  })
  .transform((data) => data as GetPostInputDTO);
