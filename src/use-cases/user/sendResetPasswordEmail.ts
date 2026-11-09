import { IUseCase, IValidator } from '../../interfaces';
import { ForgotPasswordInput } from '../../interfaces/user';
import { ValidationError } from '../../errors';
import { IUserDAO } from '../../interfaces/user';
import { TokenPayload } from '../../infrastructure/utils';
import type { SignOptions } from 'jsonwebtoken';
import type { resetPasswordEmailArgs } from '../../infrastructure/utils/email';
export default class SendResetPasswordEmail implements IUseCase<boolean> {
  constructor(
    protected validator: IValidator<ForgotPasswordInput>,
    protected resetPasswordEmail: (
      args: resetPasswordEmailArgs,
    ) => Promise<void>,
    protected userDAO: IUserDAO,
    protected issueToken: (
      payload: TokenPayload,
      expiresIn?: SignOptions['expiresIn'],
    ) => string,
  ) {}
  async call(payload: ForgotPasswordInput): Promise<boolean> {
    console.log('payload', payload);
    const { data, errors } = this.validator.validate(payload);
    if (errors && errors.length > 0) {
      console.error('errors in forgot password', errors);
      throw new ValidationError('The data is invalid', errors);
    }
    const email = data.email;
    const user = await this.userDAO.findOneBy({ email });
    if (!user) return true;

    const verifyToken = this.issueToken(
      { id: user.id, purpose: 'password-reset' },
      '1d',
    );
    await this.resetPasswordEmail({ email, verifyToken });
    return true;
  }
}
