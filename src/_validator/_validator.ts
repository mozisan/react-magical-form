import { TupleToIntersection, TupleToUnion } from '../_utils';
import { Refinement } from './_refinement';
import { ValidationResult } from './_validationResult';

export type Validator<
  TValue,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRefinement extends Refinement<any, any>
> = (value: TValue) => ValidationResult<TValue, TRefinement>;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Validator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export const Noop: Validator<any, never> = () =>
    new ValidationResult.Passed();
}

export type ValueIntersectionOf<
  TValidators extends readonly Validator<any, any>[] // eslint-disable-line @typescript-eslint/no-explicit-any
> = TupleToIntersection<
  {
    readonly [K in keyof TValidators]: TValidators[K] extends Validator<
      infer TValue,
      any // eslint-disable-line @typescript-eslint/no-explicit-any
    >
      ? TValue
      : unknown;
  }
>;

export type RefinementUnionOf<
  TValidators extends readonly Validator<any, any>[] // eslint-disable-line @typescript-eslint/no-explicit-any
> = Extract<
  TupleToUnion<
    {
      readonly [K in keyof TValidators]: TValidators[K] extends Validator<
        any, // eslint-disable-line @typescript-eslint/no-explicit-any
        infer TRefinement
      >
        ? TRefinement
        : never;
    }
  >,
  Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
>;
