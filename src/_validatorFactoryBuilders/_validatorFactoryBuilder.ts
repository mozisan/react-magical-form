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
  validate: (value: TValue, params: TParams) => boolean,
): ValidatorFactoryBuilder<TParams, TValue> => ({
  toValidatorFactory: (formatError: ErrorFormatter<TParams>) => (...params) => (
    value,
  ) =>
    validate(value, params)
      ? new ValidationResult.Succeeded<TValue, never>()
      : new ValidationResult.Failed<TValue, never>(
          new ValidationError(formatError(...params)),
        ),
});
