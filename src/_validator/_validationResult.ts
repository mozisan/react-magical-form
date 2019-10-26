import { Refinement } from './_refinement';
import { ValidationError } from './_validationError';

type ValidationResultContract<
  TValue,
  TRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
> = {
  readonly type: string;
  readonly isPassed: boolean;
  readonly isFailed: boolean;
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
  | ValidationResult.Passed<TValue, TRefinement>
  | ValidationResult.Failed<TValue, TRefinement>;

declare const ValueBrand: unique symbol;
declare const RefinementBrand: unique symbol;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ValidationResult {
  export class Passed<
    TValue,
    TRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  > implements ValidationResultContract<TValue, TRefinement> {
    public readonly [ValueBrand]: TValue;
    public readonly [RefinementBrand]: TRefinement;
    public readonly type = 'passed';
    public readonly isPassed = true;
    public readonly isFailed = false;

    public concat<
      TAnotherRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
    >(
      other: ValidationResult<TValue, TAnotherRefinement>,
    ): ValidationResult<TValue, TRefinement | TAnotherRefinement> {
      switch (other.type) {
        case 'passed': {
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

    public getError(): undefined {
      return;
    }
  }

  export class Failed<
    TValue,
    TRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
  > implements ValidationResultContract<TValue, TRefinement> {
    public readonly [ValueBrand]: TValue;
    public readonly [RefinementBrand]: TRefinement;
    public readonly type = 'failed';
    public readonly isPassed = false;
    public readonly isFailed = true;
    private readonly error: ValidationError;

    public constructor(...errorMessages: readonly string[]) {
      this.error = new ValidationError(...errorMessages);
    }

    public concat<
      TAnotherRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
    >(
      other: ValidationResult<TValue, TAnotherRefinement>,
    ): ValidationResult<TValue, TRefinement | TAnotherRefinement> {
      switch (other.type) {
        case 'passed': {
          return this;
        }
        case 'failed': {
          return new Failed(...this.error.concat(other.error).messages);
        }
      }
    }

    public getError(): ValidationError {
      return this.error;
    }
  }
}
