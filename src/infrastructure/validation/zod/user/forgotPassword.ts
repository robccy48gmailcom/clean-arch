import { z } from 'zod';
import { ForgotPasswordInput } from '../../../../interfaces/user';
import ZodValidator from '../validator';
const forgotPasswordSchema: z.ZodType<ForgotPasswordInput> = z.object({
  email: z.email(),
});

export default new ZodValidator(forgotPasswordSchema);
