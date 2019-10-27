import {
  Refinement,
  validationError,
  ValidationResult,
  Validator,
} from '../_validator';

type Refinements<T> = Refinement.Factory<any, T | undefined>; // eslint-disable-line @typescript-eslint/no-explicit-any

export const createExactValidatorBuilder = (
  errorFormatter: (value: string | number) => string, // eslint-disable-line @typescript-eslint/no-explicit-any
) => <T extends string | number>(
  exactValue: T,
  compare: (a: any, b: any) => boolean = (a, b) => a === b, // eslint-disable-line @typescript-eslint/no-explicit-any
): // eslint-disable-next-line @typescript-eslint/no-explicit-any
Validator<any, Refinements<T>> => (value) => {
  if (value == null || compare(value, exactValue)) {
    return new ValidationResult.Passed();
  }

  return new ValidationResult.Failed(
    validationError(errorFormatter(exactValue)),
  );
};
