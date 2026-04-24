// src/use-cases/user/register.ts

import { IUseCase, IValidator } from '../../interfaces';
import { IUserDAO, RegisterInput } from '../../interfaces/user';
import { User } from '../../entities';
import { ValidationError } from '../../errors';

export default class RegisterUser implements IUseCase<User> {
  constructor(
    protected validator: IValidator<RegisterInput>,
    protected userDAO: IUserDAO,
    protected encryptPassword: (
      password: string,
    ) => Promise<{ password: string; salt: string }>,
  ) { }

  async call(payload: Partial<RegisterInput>): Promise<User> {
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
