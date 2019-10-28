import { createExactValidatorBuilder } from '../../_validatorFactoryBuilders';

export const confirmationOf = createExactValidatorBuilder(
  () => '値が一致しません。',
);
