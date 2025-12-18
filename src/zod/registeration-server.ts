// src/zod/registration-server.ts
import { z } from "zod";
import { registrationSchema } from "./register-student";

export const registrationServerSchema = registrationSchema.transform((data) => {
  const levelMap = {
    freshman: "100",
    sophomore: "200",
    junior: "300",
    senior: "400",
    postgrad: "500",
  } as const;

  return {
    ...data,
    level: levelMap[data.level],
  };
});

export type RegistrationServerInput = z.infer<typeof registrationServerSchema>;
