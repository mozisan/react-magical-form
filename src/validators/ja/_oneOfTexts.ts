import { createOneOfTextsValidatorBuilder } from '../../_validatorFactoryBuilders';

export const oneOfTexts = createOneOfTextsValidatorBuilder(
  (values) => `${values.join(', ')}のどれかを指定してください。`,
);
