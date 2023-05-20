import { CommentModel } from "../../models/Comment";
import z from "zod";

export interface GetCommentInputDTO {
  token: string;
  idPost: string;
}

export interface GetCommentOutputDTO {
  message: string;
  products: CommentModel;
}

export const GetCommentSchema = z
  .object({
    token: z.string().min(1),
  })
  .transform((data) => data as GetCommentInputDTO);
