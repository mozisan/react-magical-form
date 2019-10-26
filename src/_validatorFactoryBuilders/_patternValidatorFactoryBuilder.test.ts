import { ValidationResult } from '../_validator';
import { patternValidatorFactoryBuilder } from './_patternValidatorFactoryBuilder';

describe('patternValidatorFactoryBuilder', () => {
  it('should return validator which works correctly', () => {
    const validate = patternValidatorFactoryBuilder.toValidatorFactory(
      () => 'error',
    )(/-hoge-/);

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
