import { createValidatorFactoryBuilder } from './_validatorFactoryBuilder';

export const maxValidatorFactoryBuilder = createValidatorFactoryBuilder<
  number | undefined,
  readonly [number]
>((value, [max]) => {
  if (value == null) {
    return true;
  }

  return value <= max;
});
