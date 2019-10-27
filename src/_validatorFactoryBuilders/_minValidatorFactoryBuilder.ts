import { createStaticValidatorFactoryBuilder } from '../_validator';

export const createMinValidatorFactory = createStaticValidatorFactoryBuilder<
  readonly [number],
  number | undefined
>((value, [limit]) => {
  if (value == null) {
    return true;
  }

  return value >= limit;
});
