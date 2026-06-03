// src/interfaces/useCase.ts

export default interface IUseCase<T> {
  call(...args: unknown[]): Promise<T>;
}
