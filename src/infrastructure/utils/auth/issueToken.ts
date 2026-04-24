// src/infrastructure/utils/auth/issueToken.ts

import * as jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { app } from '../../../config';
import { User } from '../../../entities';

export default (payload: Partial<User>, expiresIn?: SignOptions['expiresIn']): string => {
  const jwtToken = jwt.sign(
    payload,
    app.jwtSecret as string,
    expiresIn ? { expiresIn } : undefined,
  );

  return jwtToken;
};
