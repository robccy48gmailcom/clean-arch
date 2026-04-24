// src/infrastructure/validation/joi/user/adminUpdate.ts

import * as Joi from 'joi';
import JOIValidator from '../validator';

const adminValidator = Joi.object({
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().allow('user', 'admin').only().optional(),
  password: Joi.string().min(6).optional(),
  confirmPassword: Joi.when(Joi.ref('password'), {
    is: Joi.required(),
    then: Joi.any()
      .valid(Joi.ref('password'))
      .required()
      .options({
        messages: {
          'any.required': 'password confirmation is required',
          'any.only': 'must match password',
        },
      }),
    otherwise: Joi.forbidden(),
  }),
});

export default new JOIValidator(adminValidator);
