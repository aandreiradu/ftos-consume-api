import z from 'zod';

export const signUpSchema = z
  .object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is reuqired' }),
    email: z.string().email({ message: 'Incorrect email format' }),
    password: z
      .string()
      .min(6, { message: 'Password must contain at least 6 characters' })
      .max(20, { message: 'Password cannot exceed 20 characters' }),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type SignUpDTO = z.infer<typeof signUpSchema>;
