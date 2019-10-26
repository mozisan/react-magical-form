import {
  Refinement,
  ValidationError,
  ValidationResult,
  Validator,
} from '../_validator';

type Refinements =
  | Refinement.Factory<boolean | undefined, true>
  | Refinement.Factory<number | undefined, number>
  | Refinement.Factory<string | undefined, string>;

const isEmptyString = (value: unknown): boolean =>
  typeof value === 'string' && value === '';

const isFalse = (value: unknown): boolean =>
  typeof value === 'boolean' && !value;

export const createRequiredValidatorBuilder = (
  errorFormatter: () => string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => (): Validator<any, Refinements> => (value) => {
  if (value == null) {
    return new ValidationResult.Failed(new ValidationError(errorFormatter()));
  }

  if (isEmptyString(value) || isFalse(value)) {
    return new ValidationResult.Failed(new ValidationError(errorFormatter()));
  }

  return new ValidationResult.Passed();
};
