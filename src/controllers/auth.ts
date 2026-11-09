// src/controllers/auth.ts

import { IRequest, IUseCase } from '../interfaces';
import { Article, User } from '../entities';
import { ILoginResponse } from '../interfaces/user';

export default class AuthController {
  constructor(
    protected registerUser: IUseCase<User>,
    protected loginUser: IUseCase<ILoginResponse>,
    protected authorizeUser: IUseCase<User>,
    protected userArticles: IUseCase<
      Pick<Article, 'id' | 'title' | 'description' | 'isPublished'>[]
    >,
    protected updateProfile: IUseCase<boolean>,
    protected changePassword: IUseCase<boolean>,
    protected verifyEmail: IUseCase<boolean>,
    protected sendResetPasswordEmail: IUseCase<boolean>,
    protected passwordReset: IUseCase<boolean>,
  ) {}

  async register(request: IRequest): Promise<{ success: boolean }> {
    const userPayload = request.body;
    const user = await this.registerUser.call(userPayload);
    return { success: !!user.id };
  }

  async login(request: IRequest): Promise<ILoginResponse> {
    //await new Promise((r) => setTimeout(r, 5000));
    const { email, password } = request.body as {
      email: string;
      password: string;
    };
    return this.loginUser.call(email, password);
  }

  async profile(request: IRequest): Promise<User> {
    //await new Promise((r) => setTimeout(r, 5000));
    const user = await this.authorizeUser.call(request.token);
    const page = parseInt(request.params?.page as string) || 1;
    const perPage = parseInt(request.params?.perPage as string) || 10;
    const articles = await this.userArticles.call(
      user.id,
      false,
      page,
      perPage,
    );
    Object.assign(user, { articles });
    return user;
  }

  async update(request: IRequest): Promise<boolean> {
    const user = await this.authorizeUser.call(request.token);
    return this.updateProfile.call(user.id, request.body);
  }

  updatePasswordPromise(request: IRequest): Promise<boolean> {
    const p = new Promise<boolean>((resolve, reject) => {
      this.authorizeUser
        .call(request.token)
        .then((user) => this.changePassword.call(user.id, request.body))
        .then((success) => {
          resolve(success);
        })
        .catch(reject);
    });
    return p;
  }

  async updatePassword(request: IRequest): Promise<boolean> {
    const user = await this.authorizeUser.call(request.token);
    return this.changePassword.call(user.id, request.body);
  }

  async verifyEmailAddress(request: IRequest): Promise<boolean> {
    return this.verifyEmail.call(request.token);
  }

  async sendPasswordResetEmail(request: IRequest) {
    const payloadBody = request.body;
    return this.sendResetPasswordEmail.call(payloadBody);
  }

  async resetPassword(request: IRequest) {
    return true;
  }
}
