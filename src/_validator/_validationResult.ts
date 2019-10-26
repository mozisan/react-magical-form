import { Refinement } from './_refinement';
import { ValidationError } from './_validationError';
import { ComposedRefinementOf, ComposedValueOf, Validator } from './_validator';

type ValidationResultContract<
  TValue,
  TRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
> = {
  readonly type: 'succeeded' | 'failed';
  readonly concat: <
    TAnotherRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  >(
    other: ValidationResult<TValue, TAnotherRefinement>,
  ) => ValidationResult<TValue, TRefinement | TAnotherRefinement>;
  readonly getError: () => ValidationError | undefined;
};

export type ValidationResult<
  TValue,
  TRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
> =
  | ValidationResult.Succeeded<TValue, TRefinement>
  | ValidationResult.Failed<TValue, TRefinement>;

export type ValidationResultOf<
  TValidators extends readonly Validator<any, any>[] // eslint-disable-line @typescript-eslint/no-explicit-any
> = ValidationResult<
  ComposedValueOf<TValidators>,
  ComposedRefinementOf<TValidators>
>;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ValidationResult {
  export class Succeeded<
    TValue,
    TRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  > implements ValidationResultContract<TValue, TRefinement> {
    public readonly type = 'succeeded';

    public concat<
      TAnotherRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
    >(
      other: ValidationResult<TValue, TAnotherRefinement>,
    ): ValidationResult<TValue, TRefinement | TAnotherRefinement> {
      switch (other.type) {
        case 'succeeded': {
          return other as ValidationResult<
            TValue,
            TRefinement | TAnotherRefinement
          >;
        }
        case 'failed': {
          return other;
        }
      }
    }

    public getError(): ValidationError | undefined {
      return;
    }
  }

  export class Failed<
    TValue,
    TRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  > implements ValidationResultContract<TValue, TRefinement> {
    public readonly type = 'failed';
    private readonly error: ValidationError;

    public constructor(error: ValidationError) {
      this.error = error;
    }

    public concat<
      TAnotherRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
    >(
      other: ValidationResult<TValue, TAnotherRefinement>,
    ): ValidationResult<TValue, TRefinement | TAnotherRefinement> {
      switch (other.type) {
        case 'succeeded': {
          return this;
        }
        case 'failed': {
          return new Failed(this.error.concat(other.error));
        }
      }
    }

    public getError(): ValidationError | undefined {
      return this.error;
    }
  }
}
