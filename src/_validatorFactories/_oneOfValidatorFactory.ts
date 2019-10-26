import {
  Refinement,
  ValidationError,
  ValidationResult,
  Validator,
} from '../_validator';

export const createOneOfValidator = (
  errorFormatter: (values: readonly (number | string)[]) => string,
) => <T extends number | string>(
  ...values: readonly [T, ...readonly T[]]
): Validator<
  number | string | undefined,
  | Refinement.Factory<number | undefined, Extract<T, number> | undefined>
  | Refinement.Factory<string | undefined, Extract<T, string> | undefined>
> => (value) => {
  if (value == null) {
    new ValidationResult.Succeeded();
  }

  if (values.find((item) => item === value) != null) {
    return new ValidationResult.Succeeded<
      number | string | undefined,
      | Refinement.Factory<number | undefined, Extract<T, number> | undefined>
      | Refinement.Factory<string | undefined, Extract<T, string> | undefined>
    >();
  }

  return new ValidationResult.Failed(
    new ValidationError(errorFormatter(values)),
  );
};
