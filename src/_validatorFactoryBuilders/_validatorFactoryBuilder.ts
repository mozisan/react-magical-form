import { ValidationError, ValidationResult } from '../_validator';
import { ValidatorFactory } from '../_validatorFactory';

type ErrorFormatter<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TParams extends readonly any[]
> = (...params: TParams) => string;

export type ValidatorFactoryBuilder<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TParams extends readonly any[],
  TValue
> = {
  readonly toValidatorFactory: (
    errorFormatter: ErrorFormatter<TParams>,
  ) => ValidatorFactory<TParams, TValue, readonly []>;
};

export const createValidatorFactoryBuilder = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TParams extends readonly any[],
  TValue
>(
  validate: (
    value: TValue,
    params: TParams,
  ) => boolean | ValidationResult.Refined<TValue, never>,
): ValidatorFactoryBuilder<TParams, TValue> => ({
  toValidatorFactory: (formatError: ErrorFormatter<TParams>) => (...params) => (
    value,
  ) => {
    const resultOrRefined = validate(value, params);
    if (resultOrRefined instanceof ValidationResult.Refined) {
      return resultOrRefined;
    }

    return resultOrRefined
      ? new ValidationResult.None<TValue, never>()
      : new ValidationResult.ErrorDetected<TValue, never>(
          new ValidationError(formatError(...params)),
        );
  },
});
