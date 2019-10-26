import { createMaxValidatorFactory } from '../../_validatorFactoryBuilders';

export const max = createMaxValidatorFactory(
  (limit) => `should be smaller then or equal to ${limit}.`,
);
