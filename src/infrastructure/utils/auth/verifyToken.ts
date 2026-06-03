// src/infrastructure/utils/auth/verifyToken.ts

import * as jwt from 'jsonwebtoken';
import { app } from '../../../config';
import { User } from '../../../entities';
import { UnauthorizedError } from '../../../errors';

export default <T = User>(token: string): T => {
  try {
    const user = jwt.verify(token, app.jwtSecret as string) as unknown as T;
    return user;
  } catch (err) {
    console.error(err);
    throw new UnauthorizedError('Your token is invalid or expired');
  }
};
