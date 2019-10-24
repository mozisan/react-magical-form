import { createValidatorFactoryBuilder } from './_validatorFactoryBuilder';

export const minValidatorFactoryBuilder = createValidatorFactoryBuilder<
  number | undefined,
  readonly [number]
>((value, [min]) => {
  if (value == null) {
    return true;
  }

  return value >= min;
});
