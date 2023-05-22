import z from "zod";

export interface UpdateCommentInputDTO {
  token: string;
  id: string;
  content: string;
}

export const UpdateCommentScheme = z
  .object({
    token: z.string().min(1),
    id: z.string().min(1, "'id' must be at least 1 characters."),
    content: z.string().min(1),
  })
  .transform((data) => data as UpdateCommentInputDTO);
