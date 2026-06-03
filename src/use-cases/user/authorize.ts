// src/use-cases/user/authorize.ts

import { User } from '../../entities';
import { IUserDAO } from '../../interfaces/user';
import { IUseCase } from '../../interfaces';
import { UnauthorizedError } from '../../errors';

export default class AuthorizeUser implements IUseCase<User> {
  constructor(
    protected userDAO: IUserDAO,
    protected verifyToken: (token: string) => User,
  ) {}

  async callOri(token: string): Promise<User> {
    if (!token) {
      throw new UnauthorizedError('You`re not authorized');
    }
    const { id } = this.verifyToken(token);
    const user = await this.userDAO.findOneBy({ id });
    if (!user) {
      throw new UnauthorizedError('You`re not authorized');
    }

    return user;
  }

  call(token: string): Promise<User> {
    if (!token) {
      throw new UnauthorizedError('You`re not authorized');
    }
    const { id } = this.verifyToken(token);

    const p = new Promise<User>((resolve, reject) => {
      this.userDAO
        .findOneBy({ id })
        .then((user) => {
          if (!user) {
            throw new UnauthorizedError('You`re not authorized');
          }
          resolve(user);
        })
        .catch(reject);
    });
    return p;
  }
}
