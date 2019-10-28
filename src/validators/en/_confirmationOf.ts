import { createExactValidatorBuilder } from '../../_validatorFactoryBuilders';

export const confirmationOf = createExactValidatorBuilder(
  () => 'does not match.',
);
