import { rangeValidatorFactoryBuilder } from '../../_validatorFactoryBuilders';

export const range = rangeValidatorFactoryBuilder.toValidatorFactory(
  (min, max) => `${min}以上${max}以下の値を指定してください。`,
);
