import { createOneOfNumbersValidatorBuilder } from '../../_validatorFactoryBuilders';

export const oneOfNumbers = createOneOfNumbersValidatorBuilder(
  (values) => `${values.join(', ')}のどれかを指定してください。`,
);
