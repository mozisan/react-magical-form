import { validationError } from './_validationError';
import { ValidationResult } from './_validationResult';
import { Validator } from './_validator';

type ErrorFormatter<
  TParams extends readonly any[] // eslint-disable-line @typescript-eslint/no-explicit-any
> = (...params: TParams) => string;

type ValidatorFactoryBuilder<
  TParams extends readonly any[], // eslint-disable-line @typescript-eslint/no-explicit-any
  TValue
> = (
  errorFormatter: ErrorFormatter<TParams>,
) => (...params: TParams) => Validator<TValue, never>;

export const createStaticValidatorFactoryBuilder = <
  TParams extends readonly any[], // eslint-disable-line @typescript-eslint/no-explicit-any
  TValue
>(
  validate: (value: TValue, params: TParams) => boolean,
): ValidatorFactoryBuilder<TParams, TValue> => (
  formatError: ErrorFormatter<TParams>,
) => (...params) => (fieldValue) =>
  validate(fieldValue, params)
    ? new ValidationResult.Passed()
    : new ValidationResult.Failed(validationError(formatError(...params)));
