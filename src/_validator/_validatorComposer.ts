import { ValidationResult } from './_validationResult';
import { ComposedRefinementOf, ComposedValueOf, Validator } from './_validator';

export const compose = <
  TValidators extends readonly [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Validator<any, any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...readonly Validator<any, any>[],
  ]
>(
  ...validators: TValidators
): Validator<
  ComposedValueOf<TValidators>,
  ComposedRefinementOf<TValidators>
> => (value) =>
  validators.reduce<
    ValidationResult<
      ComposedValueOf<TValidators>,
      ComposedRefinementOf<TValidators>
    >
  >(
    (result, validate) => result.concat(validate(value)),
    new ValidationResult.Succeeded(),
  );
