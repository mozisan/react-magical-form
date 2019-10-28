import { createExactValidatorBuilder } from '../../_validatorFactoryBuilders';

export const exact = createExactValidatorBuilder(
  (value) => `should be \`${value}\``,
);
