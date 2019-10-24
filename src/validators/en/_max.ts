import { maxValidatorFactoryBuilder } from '../../_validatorFactoryBuilders';

export const max = maxValidatorFactoryBuilder.toValidatorFactory(
  (limit) => `should be smaller then or equal to ${limit}.`,
);
