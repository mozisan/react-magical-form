import { createValidatorFactoryBuilder } from './_validatorFactoryBuilder';

export const patternValidatorFactoryBuilder = createValidatorFactoryBuilder<
  string,
  readonly [RegExp]
>((value, [pattern]) => pattern.test(value));
