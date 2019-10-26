import { createMinValidatorFactory } from '../../_validatorFactoryBuilders';

export const min = createMinValidatorFactory(
  (limit) => `${limit}以上の値を指定してください。`,
);
