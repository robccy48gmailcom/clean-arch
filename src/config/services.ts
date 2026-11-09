import {
  MySQLArticleDAO,
  MySQLUserDAO,
} from '../infrastructure/data-access/mysql';
import {
  encryptPassword,
  issueToken,
  passwordsMatch,
  verifyToken,
  sendVerificationEmail,
  resetPasswordEmail,
} from '../infrastructure/utils';
import * as validators from '../infrastructure/validation/joi';
import * as zodValidators from '../infrastructure/validation/zod';
export default {
  user: {
    validators: validators.user,
    DAO: MySQLUserDAO,
    zodValidators: zodValidators.user,
  },
  article: {
    validators: validators.article,
    DAO: MySQLArticleDAO,
    zodValidators: zodValidators.article,
  },
  utils: {
    encryptPassword,
    issueToken,
    verifyToken,
    passwordsMatch,
    sendVerificationEmail,
    resetPasswordEmail,
  },
};
