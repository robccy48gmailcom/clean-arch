import { z } from 'zod';
import { IValidator } from '../../../interfaces';
import { IValidationResult } from '../../../interfaces/validator';

export default class ZodValidator<T> implements IValidator<T> {
    constructor(protected schema: z.ZodType<T>) { }

    public validate(data: Partial<T>): IValidationResult<T> {
        const result = this.schema.safeParse(data);

        if (result.success) {
            return { data: result.data, errors: [] };
        }

        const errors = result.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));

        return { data: data as T, errors };
    }
}
