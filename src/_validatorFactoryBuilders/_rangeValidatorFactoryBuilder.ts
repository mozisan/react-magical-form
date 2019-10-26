import { createStaticValidatorFactoryBuilder } from '../_validatorFactory';

export const createRangeValidatorFactory = createStaticValidatorFactoryBuilder<
  readonly [number, number],
  number | undefined
>((value, [min, max]) => {
  if (value == null) {
    return true;
  }

  return min <= value && value <= max;
});
