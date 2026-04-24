// src/infrastructure/utils/auth/verifyToken.ts

import * as jwt from 'jsonwebtoken';
import { app } from '../../../config';
import { User } from '../../../entities';
import { UnauthorizedError } from '../../../errors';

export default <T = User>(token: string): T => {
  try {
    const userq = jwt.verify(token, app.jwtSecret as string);
    console.log("userq:", userq)
    const user = jwt.verify(token, app.jwtSecret as string) as unknown as T;
    console.log("user:", user)
    return user
  } catch (err) {
    console.error(err);
    throw new UnauthorizedError('Your token is invalid or expired');
  }
};
