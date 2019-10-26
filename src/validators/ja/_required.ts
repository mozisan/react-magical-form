import { createRequiredValidatorBuilder } from '../../_validatorFactoryBuilders';

export const required = createRequiredValidatorBuilder(() => `値は必須です。`);
