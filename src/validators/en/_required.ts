import { requiredValidatorFactoryBuilder } from '../../_validatorFactoryBuilders';

export const required = requiredValidatorFactoryBuilder.toValidatorFactory(
  () => 'required.',
);
