import * as z from "zod"


export const InvestmentValidation = z.object({
    amount:z.number().or(z.string().regex(/^\d+$/).transform(Number)),
    investor: z.string(),
    date: z.string() ,
})