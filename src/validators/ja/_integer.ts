import { createIntegerValidatorFactory } from '../../_validatorFactoryBuilders';

export const integer = createIntegerValidatorFactory(
  () => '整数を指定してください。',
);
