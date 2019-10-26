import {
  Refinement,
  ValidationError,
  ValidationResult,
  Validator,
} from '../_validator';

export const createOneOfValidator = (
  errorFormatter: (values: readonly string[]) => string,
) => <T extends string>(
  ...values: readonly [T, ...readonly T[]]
): Validator<
  string | undefined,
  Refinement.Factory<string | undefined, T | undefined>
> => (value) => {
  if (value == null) {
    new ValidationResult.Succeeded();
  }

  if (values.find((item) => item === value) != null) {
    return new ValidationResult.Succeeded<
      T,
      Refinement.Factory<string | undefined, T | undefined>
    >();
  }

  return new ValidationResult.Failed(
    new ValidationError(errorFormatter(values)),
  );
};
