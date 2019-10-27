import { ValidationResult } from './_validationResult';
import {
  RefinementUnionOf,
  Validator,
  ValueIntersectionOf,
} from './_validator';

export const compose = <
  TValidators extends readonly [
    Validator<any, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    ...readonly Validator<any, any>[], // eslint-disable-line @typescript-eslint/no-explicit-any
  ]
>(
  ...validators: TValidators
): Validator<
  ValueIntersectionOf<TValidators>,
  RefinementUnionOf<TValidators>
> => (value) =>
  validators.reduce<
    ValidationResult<
      ValueIntersectionOf<TValidators>,
      RefinementUnionOf<TValidators>
    >
  >(
    (result, validate) => result.concat(validate(value)),
    new ValidationResult.Passed(),
  );
