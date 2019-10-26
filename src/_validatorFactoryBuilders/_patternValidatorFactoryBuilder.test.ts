import { ValidationResult } from '../_validator';
import { createPatternValidatorFactory } from './_patternValidatorFactoryBuilder';

describe('createPatternValidatorFactory()', () => {
  it('should return validator which works correctly', () => {
    const validate = createPatternValidatorFactory(() => '')(/-hoge-/);

    const invalidValues = ['', 'hoge', '-hoge', 'hoge-', 'fuga'];
    invalidValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Failed);
    });

    const validValues = ['-hoge-', 'aaa-hoge-bbb', '-hoge--'];
    validValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Succeeded);
    });
  });
});
