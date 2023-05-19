import z from "zod";

export interface UpdatePostInputDTO {
  token: string;
  id: string;
  content: string;
}

export const UpdatePostScheme = z
  .object({
    token: z.string().min(1),
    id: z.string().min(36, "'id' must be at least 36 characters."),
    content: z.string().min(1),
  })
  .transform((data) => data as UpdatePostInputDTO);
