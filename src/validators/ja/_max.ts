import { maxValidatorFactoryBuilder } from '../../_validatorFactoryBuilders';

export const max = maxValidatorFactoryBuilder.toValidatorFactory(
  (limit) => `${limit}以下の値を指定してください。`,
);
