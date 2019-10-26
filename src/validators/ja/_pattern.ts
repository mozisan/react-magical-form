import { createPatternValidatorFactory } from '../../_validatorFactoryBuilders';

export const pattern = createPatternValidatorFactory(
  (patternRegExp) => `\`${patternRegExp}\`にマッチしません。`,
);
