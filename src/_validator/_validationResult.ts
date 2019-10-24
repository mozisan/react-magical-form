import { Refinement } from './_refinement';
import { ValidationError } from './_validationError';

type ValidationResultContract<
  TValue,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRefinement extends Refinement<any, any> = never
> = {
  readonly type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly concat: <TAnotherRefinement extends Refinement<any, any>>(
    other: ValidationResult<TValue, TAnotherRefinement>,
  ) => ValidationResult<TValue, TRefinement & TAnotherRefinement>;
  readonly getError: () => ValidationError | undefined;
};

export type ValidationResult<
  TValue,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRefinement extends Refinement<any, any> = never
> =
  | ValidationResult.Refined<TValue, TRefinement>
  | ValidationResult.ErrorDetected<TValue, TRefinement>
  | ValidationResult.None<TValue, TRefinement>;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ValidationResult {
  export class Refined<
    TValue,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TRefinement extends Refinement<any, any> = never
  > implements ValidationResultContract<TValue, TRefinement> {
    public readonly type = 'refined';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public concat<TAnotherRefinement extends Refinement<any, any>>(
      other: ValidationResult<TValue, TAnotherRefinement>,
    ): ValidationResult<TValue, TRefinement & TAnotherRefinement> {
      switch (other.type) {
        case 'refined': {
          return other as ValidationResult<
            TValue,
            TRefinement & TAnotherRefinement
          >;
        }
        case 'error': {
          return other;
        }
        case 'none': {
          return other;
        }
      }
    }

    public getError(): ValidationError | undefined {
      return;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export class ErrorDetected<
    TValue,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TRefinement extends Refinement<any, any> = never
  > implements ValidationResultContract<TValue, TRefinement> {
    public readonly type = 'error';
    private readonly error: ValidationError;

    public constructor(error: ValidationError) {
      this.error = error;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public concat<TAnotherRefinement extends Refinement<any, any>>(
      other: ValidationResult<TValue, TAnotherRefinement>,
    ): ValidationResult<TValue, TRefinement & TAnotherRefinement> {
      switch (other.type) {
        case 'refined': {
          return this;
        }
        case 'error': {
          return new ErrorDetected(this.error.concat(other.error));
        }
        case 'none': {
          return this;
        }
      }
    }

    public getError(): ValidationError | undefined {
      return this.error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export class None<
    TValue,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TRefinement extends Refinement<any, any> = never
  > implements ValidationResultContract<TValue, TRefinement> {
    public readonly type = 'none';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public concat<TAnotherRefinement extends Refinement<any, any>>(
      other: ValidationResult<TValue, TAnotherRefinement>,
    ): ValidationResult<TValue, TRefinement & TAnotherRefinement> {
      switch (other.type) {
        case 'refined': {
          return other;
        }
        case 'error': {
          return other;
        }
        case 'none': {
          return this;
        }
      }
    }

    public getError(): ValidationError | undefined {
      return;
    }
  }
}
