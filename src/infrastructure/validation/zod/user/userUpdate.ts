import { z } from 'zod';
import ZodValidator from '../validator';
import { UpdateUserInput } from '../../../../interfaces/user';

const updateUserSchema: z.ZodType<UpdateUserInput> = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.email(),
  })
  .partial()
  .transform((data): UpdateUserInput => {
    const output: UpdateUserInput = {};
    if (data.firstName !== undefined) output.firstName = data.firstName;
    if (data.lastName !== undefined) output.lastName = data.lastName;
    if (data.email !== undefined) output.email = data.email;
    return output;
  });

export default new ZodValidator(updateUserSchema);