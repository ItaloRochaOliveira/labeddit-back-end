import z from "zod";

export interface CreatePostInputDTO {
  token: string;
  content: string;
}

export const CreatePostScheme = z
  .object({
    token: z.string().min(1),
    content: z.string().min(1),
  })
  .transform((data) => data as CreatePostInputDTO);
