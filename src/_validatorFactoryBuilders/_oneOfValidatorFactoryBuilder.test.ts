import { ValidationResult } from '../_validator';
import { createOneOfValidatorBuilder } from './_oneOfValidatorFactoryBuilder';

describe('createOneOfValidatorBuilder()', () => {
  it('should return validator which works correctly', () => {
    const validate = createOneOfValidatorBuilder(() => '')(1, 2, 3);

    const invalidValues = [0, 4, 5];
    invalidValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Failed);
    });

    const validValues = [undefined, 1, 2, 3];
    validValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Passed);
    });
  });
});
