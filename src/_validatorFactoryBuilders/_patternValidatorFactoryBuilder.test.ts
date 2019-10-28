import { ValidationResult } from '../_validator';
import { createPatternValidatorFactory } from './_patternValidatorFactoryBuilder';

describe('createPatternValidatorFactory()', () => {
  const pattern = createPatternValidatorFactory(() => '');

  it('should return validator which works correctly', () => {
    const validate = pattern(/-hoge-/);

    const invalidValues = ['', 'hoge', '-hoge', 'hoge-', 'fuga'];
    invalidValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Failed);
    });

    const validValues = [undefined, '-hoge-', 'aaa-hoge-bbb', '-hoge--'];
    validValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Passed);
    });
  });
});
