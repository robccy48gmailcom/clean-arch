// src/interfaces/validator.ts

export interface ValidationError {
  field: string;
  message: string;
}

export interface IValidationResult<T> {
  errors?: ValidationError[];
  data: T;
}

export default interface IValidator<T> {
  validate(body: Partial<T>): IValidationResult<T>;
}
