import { createValidatorFactoryBuilder } from './_validatorFactoryBuilder';

export const rangeValidatorFactoryBuilder = createValidatorFactoryBuilder<
  number | undefined,
  readonly [number, number]
>((value, [min, max]) => {
  if (value == null) {
    return true;
  }

  return min <= value && value <= max;
});
