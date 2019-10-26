import { ComposedValidators, Validator } from '../_validator';

export type ValidatorFactory<
  TParams extends readonly any[], // eslint-disable-line @typescript-eslint/no-explicit-any
  TValue,
  TValidators extends readonly Validator<TValue, any>[] // eslint-disable-line @typescript-eslint/no-explicit-any
> = (...params: TParams) => ComposedValidators<TValue, TValidators>;
