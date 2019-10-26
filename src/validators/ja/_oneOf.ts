import { createOneOfValidatorBuilder } from '../../_validatorFactoryBuilders';

export const oneOf = createOneOfValidatorBuilder(
  (values) => `${values.join(', ')}のどれかを指定してください。`,
);
