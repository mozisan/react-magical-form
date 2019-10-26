import { createRequiredValidator } from '../../_validatorFactories';

export const required = createRequiredValidator(() => `値は必須です。`);
