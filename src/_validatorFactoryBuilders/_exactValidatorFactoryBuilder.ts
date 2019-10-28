import {
  Refinement,
  validationError,
  ValidationResult,
  Validator,
} from '../_validator';

type Refinements<T> = Refinement.Factory<any, T | undefined>; // eslint-disable-line @typescript-eslint/no-explicit-any

export const createExactValidatorBuilder = (
  errorFormatter: (value: number | string) => string, // eslint-disable-line @typescript-eslint/no-explicit-any
) => <T extends string | number>(
  value: T,
  compare: (a: any, b: any) => boolean = (a, b) => a === b, // eslint-disable-line @typescript-eslint/no-explicit-any
): // eslint-disable-next-line @typescript-eslint/no-explicit-any
Validator<any, Refinements<T>> => (fieldValue) => {
  if (fieldValue == null || compare(fieldValue, value)) {
    return new ValidationResult.Passed();
  }

  return new ValidationResult.Failed(validationError(errorFormatter(value)));
};
