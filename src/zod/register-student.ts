import { z } from "zod";

export const registrationSchema = z.object({
  name: z.string().min(4, "Full name is required"),
  gender: z.enum(["male", "female"]),
  level: z.preprocess(
    (val) => {
      const map: Record<string, string> = {
        "100": "freshman",
        "200": "sophomore",
        "300": "junior",
        "400": "senior",
        "500": "postgrad",
      };
      return map[val as string] ?? val;
    },
    z.enum(["freshman", "sophomore", "junior", "senior", "postgrad"]),
  ),
  matricNo: z.string().min(4, "Matriculation number is Required"),
  email: z.email("Invalid email address"),
  // bio: z.string().optional(),
});

export type RegistrationData = z.infer<typeof registrationSchema>;
