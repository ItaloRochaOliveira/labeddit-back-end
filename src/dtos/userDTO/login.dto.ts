import z from "zod";

export interface loginInputDTO {
  email: string;
  password: string;
}

export interface loginOutputDTO {
  message: string;
  token: string;
}

export const loginScheme = z.object({
  email: z.string().min(1).email(),
  password: z
    .string()
    .min(1)
    .regex(
      new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g),
      "The password must have 8 to 12 character, with uppercase and lowercase letter. Must to be minimum of one number and one character special"
    ),
});
