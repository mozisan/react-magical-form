import { createOneOfValidatorBuilder } from '../../_validatorFactoryBuilders';

export const oneOf = createOneOfValidatorBuilder(
  (values) => `should be one of ${values.join(', ')}.`,
);
