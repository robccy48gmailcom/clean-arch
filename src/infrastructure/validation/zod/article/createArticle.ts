import { z } from 'zod';
import ZodValidator from '../validator';
import { CreateArticleInput } from '../../../../interfaces/article';

const createArticleSchema: z.ZodType<CreateArticleInput> = z.object({
  title: z.string(),
  description: z.string(),
  content: z.string(),
  isPublished: z.boolean(),
});

export default new ZodValidator(createArticleSchema);
