// src/use-cases/user/create.ts

import { AuthUser, User } from '../../entities';
import { IUserDAO } from '../../interfaces/user';
import { IUseCase, IValidator } from '../../interfaces';
import { ValidationError } from '../../errors';
// implements is for interface implementation ,meaning must have all the methods of the interface
//implement meaning must have the body of the methods of interface
export default class CreateUser implements IUseCase<User> {
  constructor(
    protected validator: IValidator<AuthUser>,
    protected userDAO: IUserDAO,
    protected encryptPassword: (
      password: string,
    ) => Promise<{ password: string; salt: string }>,
  ) { }

  async call(
    payload: Pick<
      AuthUser,
      'email' | 'firstName' | 'lastName' | 'role' | 'password'
    >,
  ): Promise<User> {
    const { data, errors } = this.validator.validate(payload);
    console.log('data:', data);
    console.log('errors:', errors);
    if (errors && errors.length > 0) {
      throw new ValidationError('The data is invalid', errors);
    }
    const { password, salt } = await this.encryptPassword(data.password);
    console.log('salt:', salt);
    Object.assign(data, {
      password,
      salt,
    });
    return this.userDAO.create(data);
  }
}
