import { ValidationResult } from '../_validator';
import { createRequiredValidatorBuilder } from './_requiredValidatorFactoryBuilder';

describe('createRequiredValidatorBuilder()', () => {
  const required = createRequiredValidatorBuilder(() => '');

  it('should return validator which works correctly', () => {
    const validate = required();

    const invalidValues = [undefined, false, '', []];
    invalidValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Failed);
    });

    const validValues = [true, 'foo', [1], ['foo']];
    validValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Passed);
    });
  });
});
