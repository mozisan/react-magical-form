import { ComposedValidators, Validator } from '../_validator';

export type ValidatorFactory<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TParams extends readonly any[],
  TValue,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TValidators extends readonly Validator<TValue, any>[]
> = (...params: TParams) => ComposedValidators<TValue, TValidators>;
