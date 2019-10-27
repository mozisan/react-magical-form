import { createStaticValidatorFactoryBuilder } from '../_validator';

export const createPatternValidatorFactory = createStaticValidatorFactoryBuilder<
  readonly [RegExp],
  string | undefined
>((value, [pattern]) => {
  if (value == null) {
    return true;
  }

  return pattern.test(value);
});
