import {
  Refinement,
  validationError,
  ValidationResult,
  Validator,
} from '../_validator';

type AcceptableValue = number | string;

type Refinements<T extends AcceptableValue> =
  | Refinement.Factory<number | undefined, Extract<T, number> | undefined>
  | Refinement.Factory<string | undefined, Extract<T, string> | undefined>;

export const createOneOfValidatorBuilder = (
  errorFormatter: (values: readonly AcceptableValue[]) => string,
) => <T extends AcceptableValue>(
  ...values: readonly [T, ...readonly T[]]
): Validator<AcceptableValue | undefined, Refinements<T>> => (value) => {
  if (value == null) {
    return new ValidationResult.Passed();
  }

  if (values.find((item) => item === value) != null) {
    return new ValidationResult.Passed();
  }

  return new ValidationResult.Failed(validationError(errorFormatter(values)));
};
