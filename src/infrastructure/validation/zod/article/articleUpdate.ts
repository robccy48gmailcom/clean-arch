import { z } from 'zod';
import ZodValidator from '../validator';
import { UpdateArticleInput } from '../../../../interfaces/article';

const updateArticleSchema: z.ZodType<UpdateArticleInput> = z
  .object({
    content: z.string(),
    description: z.string(),
    title: z.string(),
    isPublished: z.boolean(),
  })
  .partial()
  .transform((data): UpdateArticleInput => {
    const output: UpdateArticleInput = {};
    if (data.content !== undefined) output.content = data.content;
    if (data.isPublished !== undefined) output.isPublished = data.isPublished;
    if (data.title !== undefined) output.title = data.title;
    if (data.description !== undefined) output.description = data.description;
    return output;
  });

export default new ZodValidator(updateArticleSchema);
