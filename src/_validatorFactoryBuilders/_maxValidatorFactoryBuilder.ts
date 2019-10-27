import { createStaticValidatorFactoryBuilder } from '../_validator';

export const createMaxValidatorFactory = createStaticValidatorFactoryBuilder<
  readonly [number],
  number | undefined
>((value, [limit]) => {
  if (value == null) {
    return true;
  }

  return value <= limit;
});
