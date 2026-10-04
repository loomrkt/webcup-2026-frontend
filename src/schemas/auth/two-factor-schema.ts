import { z } from "zod";

export const twoFactorCodeSchema = z.object({
  code: z
    .string()
    .regex(/^\d{6}$/, "Le code doit contenir exactement 6 chiffres."),
});

export type TwoFactorCodeInput = z.infer<typeof twoFactorCodeSchema>;