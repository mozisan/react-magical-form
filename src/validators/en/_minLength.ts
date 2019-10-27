import { createMinLengthValidatorBuilder } from '../../_validatorFactoryBuilders';

export const minLength = createMinLengthValidatorBuilder(
  (limit) => `should have length greater than or equal to ${limit}.`,
);
