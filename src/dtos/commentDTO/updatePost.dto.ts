import z from "zod";

export interface UpdateCommentInputDTO {
  token: string;
  idPost: string;
  content: string;
}

export const UpdateCommentScheme = z
  .object({
    token: z.string().min(1),
    idPost: z.string().min(36, "'id' must be at least 36 characters."),
    content: z.string().min(1),
  })
  .transform((data) => data as UpdateCommentInputDTO);
