import { createRequiredValidatorBuilder } from '../../_validatorFactoryBuilders';

export const required = createRequiredValidatorBuilder(() => 'required.');
