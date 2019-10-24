import { rangeValidatorFactoryBuilder } from '../../_validatorFactoryBuilders';

export const range = rangeValidatorFactoryBuilder.toValidatorFactory(
  (min, max) => `should be between ${min} and ${max}.`,
);
