import { z } from 'zod';
import ZodValidator from '../validator';
import { ChangePasswordInput } from '../../../../interfaces/user';
const changePasswordSchema: z.ZodType<ChangePasswordInput> = z
  .object({
    password: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword', 'invalid'],
  });

export default new ZodValidator(changePasswordSchema);
