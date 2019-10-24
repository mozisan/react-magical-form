import { minValidatorFactoryBuilder } from '../../_validatorFactoryBuilders';

export const min = minValidatorFactoryBuilder.toValidatorFactory(
  (limit) => `${limit}以上の値を指定してください。`,
);
