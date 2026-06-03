// app/src/entities/index.ts

import ILoginResponse from './loginResponse';
import IUserDAO from './userDAO';
import { CreateAdminInput } from './createAdminInput';
import { RegisterInput } from './registerInput';
import { UpdateUserInput } from './updateUserInput';
import { ChangePasswordInput } from './changePasswordInput';

export type {
  ILoginResponse,
  IUserDAO,
  CreateAdminInput,
  RegisterInput,
  UpdateUserInput,
  ChangePasswordInput,
};
