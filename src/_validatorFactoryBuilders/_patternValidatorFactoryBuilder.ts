import { createStaticValidatorFactoryBuilder } from '../_validatorFactory';

export const createPatternValidatorFactory = createStaticValidatorFactoryBuilder<
  readonly [RegExp],
  string
>((value, [pattern]) => pattern.test(value));
