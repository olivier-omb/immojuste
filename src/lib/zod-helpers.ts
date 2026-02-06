import { z } from "zod";

/**
 * Safe number schema that handles NaN, null, undefined, and empty strings.
 * Converts invalid values to 0 before validation.
 */
export const safeNum = (min?: number, message?: string) => {
  const base = z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === "") return 0;
      const num = Number(val);
      return Number.isNaN(num) ? 0 : num;
    },
    z.number({ message: message || "Nombre invalide" })
  );

  if (min !== undefined) {
    return base.pipe(z.number().min(min, message));
  }
  return base;
};

/**
 * Optional safe number schema.
 */
export const safeNumOptional = () =>
  z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === "") return undefined;
      const num = Number(val);
      return Number.isNaN(num) ? undefined : num;
    },
    z.number({ message: "Nombre invalide" }).optional()
  );
