// src/use-cases/user/register.ts

import { IUseCase, IValidator } from '../../interfaces';
import { IUserDAO } from '../../interfaces/user';
import { AuthUser, User } from '../../entities';
import { ValidationError } from '../../errors';

type RegisterPayload = Pick<AuthUser, 'email' | 'firstName' | 'lastName' | 'password' | 'confirmPassword'>;

export default class RegisterUser implements IUseCase<User> {
  constructor(
    protected validator: IValidator<RegisterPayload>,
    protected userDAO: IUserDAO,
    protected encryptPassword: (
      password: string,
    ) => Promise<{ password: string; salt: string }>,
  ) { }

  async call(payload: Partial<RegisterPayload>): Promise<User> {
    const { data, errors } = this.validator.validate(payload);
    console.log("data in register user", data);
    if (errors && errors.length > 0) {
      console.error("errors in register user", errors);
      throw new ValidationError('The data is invalid', errors);
    }
    delete data.confirmPassword;

    const { password, salt } = await this.encryptPassword(data.password);
    Object.assign(data, {
      role: 'user',
      password,
      salt,
    });

    return this.userDAO.create(data);
  }
}
