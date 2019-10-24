import { Refinement } from './_refinement';
import { ValidationResult } from './_validationResult';
import { Validator } from './_validator';

export const composeValidators = <
  TValue,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRefinement extends Refinement<any, any> = never
>(
  validators: readonly Validator<TValue, TRefinement>[],
): Validator<TValue, TRefinement> => (value) =>
  validators.reduce<ValidationResult<TValue, TRefinement>>(
    (result, validate) => result.concat(validate(value)),
    new ValidationResult.None(),
  );
