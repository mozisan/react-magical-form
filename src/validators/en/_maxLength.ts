import { createMaxLengthValidatorBuilder } from '../../_validatorFactoryBuilders';

export const maxLength = createMaxLengthValidatorBuilder(
  (limit) => `should have length smaller than or equal to ${limit}.`,
);
