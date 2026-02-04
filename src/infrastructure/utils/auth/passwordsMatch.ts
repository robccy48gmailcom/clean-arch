// src/infrastructure/utils/auth/passwordsMatch.ts

import * as bcrypt from "bcrypt";

export default async (
  password: string,
  encryptedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, encryptedPassword);
};
