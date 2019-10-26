import { createValidatorFactoryBuilder } from './_validatorFactoryBuilder';

export const rangeValidatorFactoryBuilder = createValidatorFactoryBuilder<
  readonly [number, number],
  number | undefined
>((value, [min, max]) => {
  if (value == null) {
    return true;
  }

  return min <= value && value <= max;
});
