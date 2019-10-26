import { createPatternValidatorFactory } from '../../_validatorFactoryBuilders';

export const pattern = createPatternValidatorFactory(
  (patternRegExp) => `should match to \`${patternRegExp}\`.`,
);
