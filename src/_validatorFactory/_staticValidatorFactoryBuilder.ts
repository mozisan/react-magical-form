import { ValidationResult } from '../_validator';
import { ValidatorFactory } from './_validatorFactory';

type ErrorFormatter<
  TParams extends readonly any[] // eslint-disable-line @typescript-eslint/no-explicit-any
> = (...params: TParams) => string;

type ValidatorFactoryBuilder<
  TParams extends readonly any[], // eslint-disable-line @typescript-eslint/no-explicit-any
  TValue
> = (
  errorFormatter: ErrorFormatter<TParams>,
) => ValidatorFactory<TParams, TValue, readonly []>;

export const createStaticValidatorFactoryBuilder = <
  TParams extends readonly any[], // eslint-disable-line @typescript-eslint/no-explicit-any
  TValue
>(
  validate: (value: TValue, params: TParams) => boolean,
): ValidatorFactoryBuilder<TParams, TValue> => (
  formatError: ErrorFormatter<TParams>,
) => (...params) => (value) =>
  validate(value, params)
    ? new ValidationResult.Passed()
    : new ValidationResult.Failed(formatError(...params));
