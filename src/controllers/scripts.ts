import { AuthUser, User } from '../entities';
import { IRequest, IUseCase } from '../interfaces';

export default class ScriptsController {
  constructor(protected createUser: IUseCase<User>) { }

  async createAdmin(request: IRequest): Promise<User> {
    const { email, password, firstName, lastName } = request.body as Pick<
      AuthUser,
      'email' | 'password' | 'firstName' | 'lastName'
    >;

    return this.createUser.call({
      email,
      password,
      firstName,
      lastName,
      role: 'admin',
    });
  }
}
