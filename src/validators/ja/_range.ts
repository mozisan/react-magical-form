import { createRangeValidatorFactory } from '../../_validatorFactoryBuilders';

export const range = createRangeValidatorFactory(
  (min, max) => `${min}以上${max}以下の値を指定してください。`,
);
