import { Refinement, ValidationError, ValidationResult } from '../_validator';
import { ValidatorFactory } from '../_validatorFactories';

type ErrorFormatter<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TParams extends readonly any[]
> = (...params: TParams) => string;

export type ValidatorFactoryBuilder<
  TValue,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TParams extends readonly any[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRefinement extends Refinement<any, any> = never
> = {
  readonly toValidatorFactory: (
    errorFormatter: ErrorFormatter<TParams>,
  ) => ValidatorFactory<TValue, TParams, TRefinement>;
};

export const createValidatorFactoryBuilder = <
  TValue,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TParams extends readonly any[] = readonly [],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRefinement extends Refinement<any, any> = never
>(
  validate: (
    value: TValue,
    params: TParams,
  ) => boolean | ValidationResult.Refined<TValue, TRefinement>,
): ValidatorFactoryBuilder<TValue, TParams, TRefinement> => ({
  toValidatorFactory: (formatError: ErrorFormatter<TParams>) => (...params) => (
    value,
  ) => {
    const resultOrRefined = validate(value, params);
    if (resultOrRefined instanceof ValidationResult.Refined) {
      return resultOrRefined;
    }

    return resultOrRefined
      ? new ValidationResult.None<TValue, TRefinement>()
      : new ValidationResult.ErrorDetected<TValue, TRefinement>(
          new ValidationError(formatError(...params)),
        );
  },
});
