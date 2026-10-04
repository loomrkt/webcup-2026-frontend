import { z } from "zod";
import {
  COLOR_BLIND_MODES,
  COLOR_SCHEMES,
  LINE_SPACINGS,
  TEXT_SIZES,
} from "@/interfaces/accessibility";

export const preferencesSchema = z.object({
  textSize: z.enum(TEXT_SIZES),
  highContrast: z.boolean(),
  reducedMotion: z.boolean(),
  readableFont: z.boolean(),
  lineSpacing: z.enum(LINE_SPACINGS),
  colorScheme: z.enum(COLOR_SCHEMES),
  colorBlind: z.enum(COLOR_BLIND_MODES),
  plainLanguage: z.boolean(),
});

export type PreferencesFormInput = z.infer<typeof preferencesSchema>;