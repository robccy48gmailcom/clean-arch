// src/interfaces/error.ts

export default interface IError {
  name: string;
  message: string;
  httpStatus: number;
  details?: unknown;
}
