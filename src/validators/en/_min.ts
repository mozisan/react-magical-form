import { minValidatorFactoryBuilder } from '../../_validatorFactoryBuilders';

export const min = minValidatorFactoryBuilder.toValidatorFactory(
  (limit) => `should be greater then or equal to ${limit}.`,
);
