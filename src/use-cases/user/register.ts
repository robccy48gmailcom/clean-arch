// src/use-cases/user/register.ts

import { IUseCase, IValidator } from '../../interfaces';
import { IUserDAO, RegisterInput } from '../../interfaces/user';
import { User } from '../../entities';
import { ValidationError } from '../../errors';
import type { SignOptions } from 'jsonwebtoken';
import { TokenPayload } from '../../infrastructure/utils';

export default class RegisterUser implements IUseCase<User> {
  constructor(
    protected validator: IValidator<RegisterInput>,
    protected userDAO: IUserDAO,
    protected encryptPassword: (
      password: string,
    ) => Promise<{ password: string; salt: string }>,
    protected issueToken: (
      payload: TokenPayload,
      expiresIn?: SignOptions['expiresIn'],
    ) => string,
    protected sendVerificationEmail: (to: string, token: string) => void,
  ) {}

  async call(payload: Partial<RegisterInput>): Promise<User> {
    const { data, errors } = this.validator.validate(payload);
    console.log('data in register user', data);
    if (errors && errors.length > 0) {
      console.error('errors in register user', errors);
      throw new ValidationError('The data is invalid', errors);
    }
    delete data.confirmPassword;

    const { password, salt } = await this.encryptPassword(data.password);
    Object.assign(data, {
      role: 'user',
      password,
      salt,
    });

    const user = await this.userDAO.create(data);

    const verifyToken = this.issueToken(
      { id: user.id, email: user.email, purpose: 'email-verify' },
      '1d',
    );
    await this.sendVerificationEmail(user.email, verifyToken);
    return user;
  }
}
