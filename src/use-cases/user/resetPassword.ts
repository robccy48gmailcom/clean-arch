import { IUseCase } from '../../interfaces';

export default class ResetPassword implements IUseCase<boolean> {
  async call() {
    return true;
  }
}
