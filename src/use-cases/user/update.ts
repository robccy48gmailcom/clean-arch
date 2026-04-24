// src/use-cases/user/update.ts

import { ValidationError } from '../../errors';
import { IUseCase, IValidator } from '../../interfaces';
import { IUserDAO, UpdateUserInput } from '../../interfaces/user';

export default class UpdateUser implements IUseCase<boolean> {
  constructor(
    protected validator: IValidator<UpdateUserInput>,
    protected userDAO: IUserDAO,
    protected encryptPassword: (
      password: string,
    ) => Promise<{ password: string; salt: string }>,
  ) { }

  async call(
    id: number,
    payload: UpdateUserInput,
  ): Promise<boolean> {
    const { data, errors } = this.validator.validate(payload);
    if (errors && errors.length > 0) {
      throw new ValidationError('Data is invalid', errors);
    }

    return this.userDAO.update(id, data);
  }
}
