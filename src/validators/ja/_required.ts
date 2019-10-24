import { requiredValidatorFactoryBuilder } from '../../_validatorFactoryBuilders';

export const required = requiredValidatorFactoryBuilder.toValidatorFactory(
  () => `値は必須です。`,
);
