import { IUseCase, IValidator } from '../../interfaces';
import { ChangePasswordInput, IUserDAO } from '../../interfaces/user';
import { ValidationError } from '../../errors';
export default class ChangePassword implements IUseCase<boolean> {
  constructor(
    protected validator: IValidator<ChangePasswordInput>,
    protected userDAO: IUserDAO,
    protected encryptPassword: (
      password: string,
    ) => Promise<{ password: string; salt: string }>,
  ) {}
  async call(id: number, payload: ChangePasswordInput) {
    const { data, errors } = this.validator.validate(payload);
    console.log('errors:', errors);
    if (errors && errors.length > 0) {
      throw new ValidationError('Data is invalid', errors);
    }

    // const p = new Promise<boolean>((resolve, reject) => {
    //   this.encryptPassword(data.password)
    //     .then(({ password, salt }) => {
    //       resolve(this.userDAO.update(id, { password, salt }));
    //     })
    //     .catch(reject);
    // });
    // return p;
    const { password, salt } = await this.encryptPassword(data.password);
    return this.userDAO.update(id, { password, salt });
  }
}
