import { validationError, ValidationResult, Validator } from '../_validator';

type AcceptableValue =
  | string
  | readonly number[]
  | readonly string[]
  | readonly File[];

export const createMaxLengthValidatorBuilder = (
  errorFormatter: (limit: number) => string,
) => (limit: number): Validator<AcceptableValue | undefined, never> => (
  fieldValue,
) => {
  if (fieldValue == null) {
    return new ValidationResult.Passed();
  }

  if (fieldValue.length <= limit) {
    return new ValidationResult.Passed();
  }

  return new ValidationResult.Failed(validationError(errorFormatter(limit)));
};
