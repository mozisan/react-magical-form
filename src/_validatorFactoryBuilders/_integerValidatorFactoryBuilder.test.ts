import { ValidationResult } from '../_validator';
import { createIntegerValidatorFactory } from './_integerValidatorFactoryBuilder';

describe('createIntegerValidatorFactory()', () => {
  const integer = createIntegerValidatorFactory(() => '');

  it('should return validator which works correctly', () => {
    const validate = integer();

    const invalidValues = [-100.1, -10.1, -1.1, 0.1, 1.1, 10.1, 100.1];
    invalidValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Failed);
    });

    const validValues = [undefined, -100, -10, -1, 0, 1, 10, 100];
    validValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Passed);
    });
  });
});
