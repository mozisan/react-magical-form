import { createStaticValidatorFactoryBuilder } from '../_validator';

export const createIntegerValidatorFactory = createStaticValidatorFactoryBuilder<
  readonly [],
  number | undefined
>((value) => {
  if (value == null) {
    return true;
  }

  return Number.isInteger(value);
});
