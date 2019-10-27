import { createRequiredValidatorBuilder } from '../../_validatorFactoryBuilders';

export const required = createRequiredValidatorBuilder(() => `必須です。`);
