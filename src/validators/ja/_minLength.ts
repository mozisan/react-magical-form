import { createMinLengthValidatorBuilder } from '../../_validatorFactoryBuilders';

export const minLength = createMinLengthValidatorBuilder(
  (limit) => `最小長は${limit}です。`,
);
