import { ValidationResult } from '../_validator';
import { requiredValidatorFactoryBuilder } from './_requiredValidatorFactoryBuidler';

describe('requiredValidatorFactoryBuilder', () => {
  it('should return validator which works correctly', () => {
    const validate = requiredValidatorFactoryBuilder.toValidatorFactory(
      () => 'error',
    )();

    const invalidValues = [undefined, null, false, ''];
    invalidValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.ErrorDetected);
    });

    const validValues = [true, 0, 1, 'foo'];
    validValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Refined);
    });
  });
});
