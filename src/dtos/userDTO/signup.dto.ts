import z from "zod";

export interface signupInputDTO {
  name: string;
  email: string;
  password: string;
}

export interface signupOutputDTO {
  message: string;
  token: string;
}

export const signupScheme = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  password: z.string().min(1),
});
