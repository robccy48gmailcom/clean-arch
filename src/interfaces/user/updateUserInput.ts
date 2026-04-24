import { AuthUser } from '../../entities';

export type UpdateUserInput = {
    firstName?: string;
    lastName?: string;
    email?: string;
}