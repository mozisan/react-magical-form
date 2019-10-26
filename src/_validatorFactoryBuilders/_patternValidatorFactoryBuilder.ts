import { createValidatorFactoryBuilder } from './_validatorFactoryBuilder';

export const patternValidatorFactoryBuilder = createValidatorFactoryBuilder<
  readonly [RegExp],
  string
>((value, [pattern]) => pattern.test(value));
