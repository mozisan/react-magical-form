import { ValidationResult } from '../_validator';
import { createOneOfNumbersValidatorBuilder } from './_oneOfNumbersValidatorFactoryBuilder';

describe('createOneOfNumbersValidatorBuilder()', () => {
  const oneOfNumbers = createOneOfNumbersValidatorBuilder(() => '');

  it('should return validator which works correctly', () => {
    const validate = oneOfNumbers(1, 2);

    const invalidValues = [0, 3, 4, 5];
    invalidValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Failed);
    });

    const validValues = [undefined, 1, 2];
    validValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Passed);
    });
  });
});
