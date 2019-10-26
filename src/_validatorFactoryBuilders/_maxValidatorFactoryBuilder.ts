import { createValidatorFactoryBuilder } from './_validatorFactoryBuilder';

export const maxValidatorFactoryBuilder = createValidatorFactoryBuilder<
  readonly [number],
  number | undefined
>((value, [max]) => {
  if (value == null) {
    return true;
  }

  return value <= max;
});
