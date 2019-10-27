import { createOneOfNumbersValidatorBuilder } from '../../_validatorFactoryBuilders';

export const oneOfNumbers = createOneOfNumbersValidatorBuilder(
  (values) => `should be one of ${values.join(', ')}.`,
);
