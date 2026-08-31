import { IUseCase } from '../../interfaces';
import { IUserDAO } from '../../interfaces/user';

export default class VerifyEmail implements IUseCase<boolean> {
  constructor(protected userDAO: IUserDAO) {}
  async call() {
    return true;
  }
}
