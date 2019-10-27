import { createOneOfTextsValidatorBuilder } from '../../_validatorFactoryBuilders';

export const oneOfTexts = createOneOfTextsValidatorBuilder(
  (values) => `should be one of ${values.join(', ')}.`,
);
