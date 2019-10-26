import { createStaticValidatorFactoryBuilder } from '../_validatorFactory';

export const createMinValidatorFactory = createStaticValidatorFactoryBuilder<
  readonly [number],
  number | undefined
>((value, [min]) => {
  if (value == null) {
    return true;
  }

  return value >= min;
});
