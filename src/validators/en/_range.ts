import { createRangeValidatorFactory } from '../../_validatorFactoryBuilders';

export const range = createRangeValidatorFactory(
  (min, max) => `should be between ${min} and ${max}.`,
);
