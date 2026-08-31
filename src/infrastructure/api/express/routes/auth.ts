// src/infrastructure/api/express/routes/auth.ts

import express, { NextFunction, Request, Response, Router } from 'express';
import { services } from '../../../../config';
import { AuthController } from '../../../../controllers';
import {
  AuthorizeUser,
  LoginUser,
  RegisterUser,
  UpdateUser,
  ChangePassword,
} from '../../../../use-cases/user';
import { UserArticlesList } from '../../../../use-cases/article';

const userDAO = new services.user.DAO();
const articleDAO = new services.article.DAO();

const controller = new AuthController(
  new RegisterUser(
    services.user.zodValidators.register,
    userDAO,
    services.utils.encryptPassword,
    services.utils.issueToken,
  ),
  new LoginUser(
    userDAO,
    services.utils.passwordsMatch,
    services.utils.issueToken,
  ),
  new AuthorizeUser(userDAO, services.utils.verifyToken),
  new UserArticlesList(articleDAO),
  new UpdateUser(services.user.zodValidators.userUpdate, userDAO),
  new ChangePassword(
    services.user.zodValidators.changePassword,
    userDAO,
    services.utils.encryptPassword,
  ),
);

const router: Router = express.Router();

router.post(
  '/register',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, firstName, lastName, password, confirmPassword } =
        req.body;
      const result = await controller.register({
        body: { email, firstName, lastName, password, confirmPassword },
      });
      res.send(result);
    } catch (err) {
      return next(err);
    }
  },
);

router.post(
  '/login',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await controller.login({ body: { email, password } });
      res.send(result);
      console.log('Login successful');
    } catch (err) {
      return next(err);
    }
  },
);

router.get(
  '/profile',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, perPage } = req.query as unknown as {
        page: number;
        perPage: number;
      };
      const token = req.headers['authorization']?.split(' ').pop() || '';
      const result = await controller.profile({
        token,
        params: { page, perPage },
      });
      res.send(result);
    } catch (err) {
      return next(err);
    }
  },
);

router.put(
  '/profile',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers['authorization']?.split(' ').pop() || '';
      const body = req.body;

      const success = await controller.update({
        token,
        body,
      });
      res.send({ success });
    } catch (err) {
      return next(err);
    }
  },
);

router.put(
  '/password',
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ').pop() || '';
    const body = req.body;

    controller
      .updatePassword({ token, body })
      .then((success) => {
        res.send({ success });
      })
      .catch((err) => next(err));
    // try {
    //   const token = req.headers['authorization']?.split(' ').pop() || '';
    //   const body = req.body;

    //   const success = await controller.updatePassword({
    //     token,
    //     body,
    //   });
    //   res.send({ success });
    // } catch (err) {
    //   return next(err);
    // }
  },
);

export default router;
