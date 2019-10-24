import { patternValidatorFactoryBuilder } from '../../_validatorFactoryBuilders';

export const pattern = patternValidatorFactoryBuilder.toValidatorFactory(
  (patternRegExp) => `should match to \`${patternRegExp}\`.`,
);
