import { createExactValidatorBuilder } from '../../_validatorFactoryBuilders';

export const exact = createExactValidatorBuilder(
  (value) => `\`${value}\`と一致しません。`,
);
