import * as z from "zod";

export const RequestValidation = z.object({
  investmentId: z.string(),
  index: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
  amount: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
  method: z.string(),
  initials: z.string().max(34),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: z.string(),
});
