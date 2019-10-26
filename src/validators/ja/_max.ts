import { createMaxValidatorFactory } from '../../_validatorFactoryBuilders';

export const max = createMaxValidatorFactory(
  (limit) => `${limit}以下の値を指定してください。`,
);
