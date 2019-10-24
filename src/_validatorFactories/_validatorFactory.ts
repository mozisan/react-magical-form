import { Refinement, Validator } from '../_validator';

export type ValidatorFactory<
  TValue,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TParams extends readonly any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRefinement extends Refinement<any, any> = never
> = (...params: TParams) => Validator<TValue, TRefinement>;
