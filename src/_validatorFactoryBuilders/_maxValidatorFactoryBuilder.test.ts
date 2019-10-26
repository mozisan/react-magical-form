import { ValidationResult } from '../_validator';
import { maxValidatorFactoryBuilder } from './_maxValidatorFactoryBuilder';

describe('maxValidatorFactoryBuilder', () => {
  it('should return validator which works correctly', () => {
    const validate = maxValidatorFactoryBuilder.toValidatorFactory(
      () => 'error',
    )(10);

    const invalidValues = [11, 100, 1000];
    invalidValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Failed);
    });

    const validValues = [-100, -10, -1, 0, 1, 10];
    validValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Succeeded);
    });
  });
});
