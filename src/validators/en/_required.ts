import { createRequiredValidator } from '../../_validatorFactories';

export const required = createRequiredValidator(() => 'required.');
