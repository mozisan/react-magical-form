import { createMaxLengthValidatorBuilder } from '../../_validatorFactoryBuilders';

export const maxLength = createMaxLengthValidatorBuilder(
  (limit) => `最大長は${limit}です。`,
);
