// src/use-cases/article/update.ts

import { Article, User } from '../../entities';
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../../errors';
import { IUseCase, IValidator } from '../../interfaces';
import { IArticleDAO, UpdateArticleInput } from '../../interfaces/article';

export default class UpdateArticle implements IUseCase<Article> {
  constructor(
    protected validator: IValidator<UpdateArticleInput>,
    protected articleDAO: IArticleDAO,
  ) {}

  async call(
    id: number,
    user: Pick<User, 'id' | 'role'>,
    payload: UpdateArticleInput,
  ): Promise<Article> {
    const { data, errors } = this.validator.validate(payload);
    if (errors && errors.length > 0) {
      throw new ValidationError('Data is invalid', errors);
    }
    const article = await this.articleDAO.findOne(id);
    if (!article) {
      throw new NotFoundError('Article not found');
    }
    if (article.authorID !== user.id && user.role !== 'admin') {
      throw new UnauthorizedError('You are not allowed to update this article');
    }

    return this.articleDAO.update(id, data);
  }
}
