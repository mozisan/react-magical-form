import { validationError, ValidationResult, Validator } from '../_validator';

type AcceptableValue =
  | string
  | readonly number[]
  | readonly string[]
  | readonly File[];

export const createMinLengthValidatorBuilder = (
  errorFormatter: (limit: number) => string,
) => (limit: number): Validator<AcceptableValue | undefined, never> => (
  value,
) => {
  if (value == null) {
    return new ValidationResult.Passed();
  }

  if (value.length >= limit) {
    return new ValidationResult.Passed();
  }

  return new ValidationResult.Failed(validationError(errorFormatter(limit)));
};
