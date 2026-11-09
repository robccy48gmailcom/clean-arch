// app/src/entities/index.ts

import ILoginResponse from './loginResponse';
import IUserDAO from './userDAO';
import { CreateAdminInput } from './createAdminInput';
import { RegisterInput } from './registerInput';
import { UpdateUserInput } from './updateUserInput';
import { ChangePasswordInput } from './changePasswordInput';
import { ForgotPasswordInput } from './forgotPasswordInput';

export type {
  ILoginResponse,
  IUserDAO,
  CreateAdminInput,
  RegisterInput,
  UpdateUserInput,
  ChangePasswordInput,
  ForgotPasswordInput,
};
