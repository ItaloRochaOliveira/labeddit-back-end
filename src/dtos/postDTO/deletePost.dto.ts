import z from "zod";

export interface DeletePostInputDTO {
  token: string;
  id: string;
}

export const DeletePostScheme = z
  .object({
    token: z.string().min(1),
    id: z.string().min(36, "'id' must be at least 36 characters."),
  })
  .transform((data) => data as DeletePostInputDTO);
