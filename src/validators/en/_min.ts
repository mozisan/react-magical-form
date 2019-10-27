import { createMinValidatorFactory } from '../../_validatorFactoryBuilders';

export const min = createMinValidatorFactory(
  (limit) => `should be greater than or equal to ${limit}.`,
);
