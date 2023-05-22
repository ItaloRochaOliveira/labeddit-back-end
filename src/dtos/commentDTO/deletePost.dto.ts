import z from "zod";

export interface DeleteCommentInputDTO {
  token: string;
  id: string;
}

export const DeleteCommentScheme = z
  .object({
    token: z.string().min(1),
    id: z.string().min(1, "'id' must be at least 1 characters."),
  })
  .transform((data) => data as DeleteCommentInputDTO);
