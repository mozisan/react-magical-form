import {
  Refinement,
  validationError,
  ValidationResult,
  Validator,
} from '../_validator';

type Refinements<T extends number> = Refinement.Factory<
  number | undefined,
  T | undefined
>;

export const createOneOfNumbersValidatorBuilder = (
  errorFormatter: (values: readonly number[]) => string,
) => <T extends number>(
  ...values: readonly [T, ...readonly T[]]
): // eslint-disable-next-line @typescript-eslint/no-explicit-any
Validator<number | undefined, Refinements<T>> => (value) => {
  if (value == null) {
    return new ValidationResult.Passed();
  }

  if (values.find((item) => item === value) != null) {
    return new ValidationResult.Passed();
  }

  return new ValidationResult.Failed(validationError(errorFormatter(values)));
};
