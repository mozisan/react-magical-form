import { Refinement } from './_refinement';
import { ValidationResult } from './_validationResult';

export type Validator<
  TValue,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRefinement extends Refinement<any, any> = never
> = (value: TValue) => ValidationResult<TValue, TRefinement>;
