import { createOneOfValidator } from '../../_validatorFactories';

export const oneOf = createOneOfValidator(
  (values) => `should be one of ${values.join(', ')}.`,
);
