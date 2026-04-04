// src/infrastructure/api/express/routes/users.ts

import * as express from 'express';
import { NextFunction, Request, Response } from 'express';

import { services } from '../../../../config';
import { UserController } from '../../../../controllers';
import { UserProfile } from '../../../../use-cases/user';

const router = express.Router();

const controller = new UserController(
  new UserProfile(new services.user.DAO(), new services.article.DAO()),
);

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let result = null;
    if (req.params.id) {
      const id = parseInt(req.params?.id);
      const { page, perPage } = req.query as unknown as {
        page: number;
        perPage: number;
      };
      result = await controller.profile({
        params: { id, page, perPage },
      });
    }
    res.send(result);
  } catch (err) {
    next(err);
  }
});
// router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     let result = null;
//     if (req.params.id) {
//       const id = parseInt(req.params.id, 10);
//       const { page, perPage } = req.query as {
//         page?: string;
//         perPage?: string;
//       };

//       result = await controller.profile({
//         params: {
//           id,
//           page: page ? parseInt(page, 10) : 1,
//           perPage: perPage ? parseInt(perPage, 10) : 10,
//         },
//       });
//     }

//     res.send(result);
//   } catch (err) {
//     next(err);
//   }
// });
export default router;
