import { ValidationResult } from '../_validator';
import { createMaxValidatorFactory } from './_maxValidatorFactoryBuilder';

describe('createMaxValidatorFactory()', () => {
  const max = createMaxValidatorFactory(() => '');

  it('should return validator which works correctly', () => {
    const validate = max(10);

    const invalidValues = [11, 100, 1000];
    invalidValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Failed);
    });

    const validValues = [undefined, -100, -10, -1, 0, 1, 10];
    validValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Passed);
    });
  });
});
