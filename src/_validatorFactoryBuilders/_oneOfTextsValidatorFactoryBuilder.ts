import {
  Refinement,
  validationError,
  ValidationResult,
  Validator,
} from '../_validator';

type Refinements<T extends string> = Refinement.Factory<
  string | undefined,
  T | undefined
>;

export const createOneOfTextsValidatorBuilder = (
  errorFormatter: (values: readonly string[]) => string,
) => <T extends string>(
  ...values: readonly [T, ...readonly T[]]
): // eslint-disable-next-line @typescript-eslint/no-explicit-any
Validator<string | undefined, Refinements<T>> => (value) => {
  if (value == null) {
    return new ValidationResult.Passed();
  }

  if (values.find((item) => item === value) != null) {
    return new ValidationResult.Passed();
  }

  return new ValidationResult.Failed(validationError(errorFormatter(values)));
};
