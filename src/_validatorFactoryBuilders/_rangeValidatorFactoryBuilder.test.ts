import { ValidationResult } from '../_validator';
import { createRangeValidatorFactory } from './_rangeValidatorFactoryBuilder';

describe('createRangeValidatorFactory()', () => {
  const range = createRangeValidatorFactory(() => '');

  it('should return validator which works correctly', () => {
    const validate = range(1, 10);

    const invalidValues = [-1, 0, 11, 100];
    invalidValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Failed);
    });

    const validValues = [undefined, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    validValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Passed);
    });
  });
});
