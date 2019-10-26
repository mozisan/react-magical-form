import { createOneOfValidator } from '../../_validatorFactories';

export const oneOf = createOneOfValidator(
  (values) => `${values.join(', ')}のどれかを指定してください。`,
);
