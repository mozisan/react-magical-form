import { createIntegerValidatorFactory } from '../../_validatorFactoryBuilders';

export const integer = createIntegerValidatorFactory(
  () => 'should be an integer.',
);
