import { AuthUser } from '../../entities'

export type RegisterInput = Pick<AuthUser, 'email' | 'firstName' | 'lastName' | 'password' | 'confirmPassword'>;