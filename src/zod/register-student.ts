import { z } from "zod";

export const registrationSchema = z.object({
  name: z.string().min(4, "Full name is required"),
  gender: z.enum(["male", "female"]),
  level: z.enum(["freshman", "sophomore", "junior", "senior", "postgrad"]),
  matricNo: z.string().min(4, "Matriculation number is Required"),
  email: z.string().email("Invalid email address"),
  // bio: z.string().optional(),
});

export type RegistrationData = z.infer<typeof registrationSchema>;
