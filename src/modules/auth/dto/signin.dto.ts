import z from 'zod';

export const signInSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: 'Password must contain at least 6 characters' })
    .max(20, { message: 'Password cannot exceed 20 characters' }),
});

export type SignInDTO = z.infer<typeof signInSchema>;
