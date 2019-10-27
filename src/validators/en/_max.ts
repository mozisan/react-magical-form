import { createMaxValidatorFactory } from '../../_validatorFactoryBuilders';

export const max = createMaxValidatorFactory(
  (limit) => `should be smaller than or equal to ${limit}.`,
);
