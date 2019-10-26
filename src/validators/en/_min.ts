import { createMinValidatorFactory } from '../../_validatorFactoryBuilders';

export const min = createMinValidatorFactory(
  (limit) => `should be greater then or equal to ${limit}.`,
);
