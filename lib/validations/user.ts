import * as z from "zod";


export const UserValidation = z.object({
    profile_photo: z.string().url().nonempty(),
    name: z.string().min(3).max(30),
    lastname: z.string().min(3).max(30),
    bio: z.string().min(3).max(30),
    mail: z.string().email().nonempty(),
    tel: z.string().min(10).max(15).nonempty(),
    city: z.string().min(3).max(30).nonempty(),
    passport_series: z.string().min(2).max(2).nonempty(),
    passport_number: z.string().min(7).max(7).nonempty(),
    cardNumber: z.string().min(16).max(16).nonempty(),
  });