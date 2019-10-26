import { createValidatorFactoryBuilder } from './_validatorFactoryBuilder';

export const minValidatorFactoryBuilder = createValidatorFactoryBuilder<
  readonly [number],
  number | undefined
>((value, [min]) => {
  if (value == null) {
    return true;
  }

  return value >= min;
});
