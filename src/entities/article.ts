// app/src/entities/article.ts

import Entity from './entity';
import User from './user';
//extend is for class inheritance
export default class Article extends Entity<Article> {
  id!: number;
  isPublished!: boolean;
  title!: string;
  description?: string;
  content!: string;
  author?: User;
  authorID!: number;
}
