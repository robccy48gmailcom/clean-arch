// src/use-cases/user/login.ts

import { User } from '../../entities';
import type { SignOptions } from 'jsonwebtoken';
import { UnauthorizedError, ValidationError } from '../../errors';
import { IUseCase } from '../../interfaces';
import { ILoginResponse, IUserDAO } from '../../interfaces/user';

export default class LoginUser implements IUseCase<ILoginResponse> {
  constructor(
    protected userDAO: IUserDAO,
    protected comparePasswords: (
      input: string,
      encrypted: string,
    ) => Promise<boolean>,
    protected issueToken: (
      payload: Partial<User>,
      expiresIn?: SignOptions['expiresIn'],
    ) => string,
  ) {}

  async call(emailPayload: string, password: string): Promise<ILoginResponse> {
    await new Promise((r) => setTimeout(r, 2000));
    if (!emailPayload || !password) {
      throw new ValidationError('Email and Password are required');
    }
    const user = await this.userDAO.findForAuth(emailPayload);
    const passwordsMatch = user
      ? await this.comparePasswords(password, user.password)
      : false;

    if (!user || !passwordsMatch) {
      throw new UnauthorizedError('Invalid login or password');
    }
    if (!user.emailVerified) {
      throw new UnauthorizedError('account email not verified');
    }

    const { id, firstName, lastName, email, role } = user;
    return {
      user: { id, firstName, lastName, email, role },
      token: this.issueToken({ id, firstName, lastName, email }, '2d'),
    };
  }
}
