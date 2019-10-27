import {
  Refinement,
  validationError,
  ValidationResult,
  Validator,
} from '../_validator';

type Refinements =
  | Refinement.Factory<boolean | undefined, true>
  | Refinement.Factory<number | undefined, number>
  | Refinement.Factory<
      readonly number[],
      readonly [number, ...readonly number[]]
    >
  | Refinement.Factory<string | undefined, string>
  | Refinement.Factory<
      readonly string[],
      readonly [string, ...readonly string[]]
    >
  | Refinement.Factory<File | undefined, File>
  | Refinement.Factory<readonly File[], readonly [File, ...readonly File[]]>;

const isFalse = (value: unknown): boolean => value === false;

const isEmptyString = (value: unknown): boolean => value === '';

const isEmptyArray = (value: unknown): boolean =>
  Array.isArray(value) && value.length === 0;

export const createRequiredValidatorBuilder = (
  errorFormatter: () => string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
) => (): Validator<any, Refinements> => (value) => {
  if (value == null) {
    return new ValidationResult.Failed(validationError(errorFormatter()));
  }

  if (isFalse(value) || isEmptyString(value) || isEmptyArray(value)) {
    return new ValidationResult.Failed(validationError(errorFormatter()));
  }

  return new ValidationResult.Passed();
};
