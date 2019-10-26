import { ValidationResult } from '../_validator';
import { createMinValidatorFactory } from './_minValidatorFactoryBuilder';

describe('createMinValidatorFactory()', () => {
  it('should return validator which works correctly', () => {
    const validate = createMinValidatorFactory(() => '')(0);

    const invalidValues = [-100, -10, -1];
    invalidValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Failed);
    });

    const validValues = [0, 1, 10, 100];
    validValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Passed);
    });
  });
});
