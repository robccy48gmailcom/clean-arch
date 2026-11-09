import { IUseCase } from '../../interfaces';
import { IUserDAO } from '../../interfaces/user';
import { User } from '../../entities';
import { UnauthorizedError } from '../../errors';

type EmailVerifyPayload = { id: number; email: string; purpose?: string };

export default class VerifyEmail implements IUseCase<boolean> {
  constructor(
    protected userDAO: IUserDAO,
    protected verifyToken: <T = User>(token: string) => T,
  ) {}
  async call(token: string): Promise<boolean> {
    const payload = this.verifyToken<EmailVerifyPayload>(token);
    console.log('payload', payload);
    if (payload.purpose !== 'email-verify') {
      throw new UnauthorizedError('Your token is invalid or expired');
    }

    const user = await this.userDAO.findOneBy({ id: payload.id });
    if (!user) {
      throw new UnauthorizedError('Your token is invalid or expired');
    }

    if (user.emailVerified) {
      return true;
    }
    return this.userDAO.update(user.id, { emailVerified: true });
  }
}
