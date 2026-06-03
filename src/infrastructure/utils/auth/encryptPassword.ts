// src/infrastructure/utils/auth/encryptPassword.ts

import * as bcrypt from 'bcrypt';

// export default async (
//   rawPassword: string,
// ): Promise<{ password: string; salt: string }> => {
//   const salt = await bcrypt.genSalt(10);
//   const password = await bcrypt.hash(rawPassword, salt);

//   return { password, salt };
// };

export default (
  rawPassword: string,
): Promise<{ password: string; salt: string }> => {
  //const salt = await bcrypt.genSalt(10);
  //const password = await bcrypt.hash(rawPassword, salt);
  const p = new Promise<{ password: string; salt: string }>(
    (resolve, reject) => {
      let generatedSalt = '';
      bcrypt
        .genSalt(10)
        .then((salt) => {
          generatedSalt = salt;
          return bcrypt.hash(rawPassword, salt);
        })
        .then((password) => {
          resolve({ password, salt: generatedSalt });
        })
        .catch(reject);
    },
  );
  return p;
};
