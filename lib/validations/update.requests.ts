import * as z from "zod";

export const UpdateRequestValidation = z.object({
  investmentId: z.string(),
  index: z.number(),
  amount: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
  method: z.string(),
  initials: z.string().max(34),
  date: z.date(), 
  status: z.string(),
});