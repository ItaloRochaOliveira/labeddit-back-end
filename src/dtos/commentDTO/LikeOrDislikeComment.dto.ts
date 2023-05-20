import z from "zod";

export interface likeOrDislikeCommentInputDTO {
  token: string;
  id: string;
  like: boolean;
}

export const likeOrDislikeCommentScheme = z
  .object({
    token: z.string().min(1),
    id: z.string().min(36, "'id' must be at least 36 characters."),
    like: z.boolean(),
  })
  .transform((data) => data as likeOrDislikeCommentInputDTO);
