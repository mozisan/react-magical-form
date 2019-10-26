import { createStaticValidatorFactoryBuilder } from '../_validatorFactory';

export const createMaxValidatorFactory = createStaticValidatorFactoryBuilder<
  readonly [number],
  number | undefined
>((value, [max]) => {
  if (value == null) {
    return true;
  }

  return value <= max;
});
