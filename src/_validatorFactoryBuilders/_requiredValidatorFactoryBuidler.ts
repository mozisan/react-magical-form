import { Refinement, ValidationResult } from '../_validator';
import { createValidatorFactoryBuilder } from './_validatorFactoryBuilder';

type Refinements =
  | Refinement<string | undefined, string>
  | Refinement<number | undefined, number>
  | Refinement<boolean | undefined, true>;

const isEmptyString = (value: unknown): boolean =>
  typeof value === 'string' && value === '';

const isFalse = (value: unknown): boolean =>
  typeof value === 'boolean' && !value;

export const requiredValidatorFactoryBuilder = createValidatorFactoryBuilder<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  readonly [],
  Refinements
>((value) => {
  if (value == null) {
    return false;
  }

  if (isEmptyString(value) || isFalse(value)) {
    return false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new ValidationResult.Refined<any, Refinements>();
});
