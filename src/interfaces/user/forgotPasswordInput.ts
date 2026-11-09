import { AuthUser } from '../../entities';

export type ForgotPasswordInput = Pick<AuthUser, 'email'>;
