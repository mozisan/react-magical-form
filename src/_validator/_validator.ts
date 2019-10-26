import { TupleToIntersection, TupleToUnion } from '../_utils';
import { ApplyRefinement, Refinement } from './_refinement';
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
    new ValidationResult.Succeeded();
}

export type ComposedValueOf<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TValidators extends readonly Validator<any, any>[]
> = TupleToIntersection<
  {
    readonly [K in keyof TValidators]: TValidators[K] extends Validator<
      infer TValue,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any
    >
      ? TValue
      : unknown;
  }
>;

export type ComposedRefinementOf<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TValidators extends readonly Validator<any, any>[]
> = Extract<
  TupleToUnion<
    {
      readonly [K in keyof TValidators]: TValidators[K] extends Validator<
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any,
        infer TRefinement
      >
        ? TRefinement
        : never;
    }
  >,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Refinement<any, any>
>;

export type ComposedValidators<
  TValue,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TValidators extends readonly Validator<TValue, any>[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
> = Validator<TValue, ComposedRefinementOf<TValidators>>;

export type ApplyValidators<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TValidators extends readonly Validator<TValue, any>[],
  TValue
> = TupleToIntersection<
  {
    [K in keyof TValidators]: TValidators[K] extends Validator<
      TValue,
      infer TRefinement
    >
      ? ApplyRefinement<TRefinement, TValue>
      : never;
  }
>;
