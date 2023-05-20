import z from "zod";

export interface CreateCommentInputDTO {
  token: string;
  content: string;
  idPost: string;
}

export const CreateCommentScheme = z
  .object({
    token: z.string().min(1),
    content: z.string().min(1),
    idPost: z.string().min(1),
  })
  .transform((data) => data as CreateCommentInputDTO);
