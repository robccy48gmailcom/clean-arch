import { AuthUser } from '../../entities'

export type CreateAdminInput = Pick<AuthUser, 'email' | 'password' | 'firstName' | 'lastName' | 'role'>;