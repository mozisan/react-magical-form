import { ValidationResult } from '../_validator';
import { createMaxLengthValidatorBuilder } from './_maxLengthValidatorFactoryBuilder';

describe('createMaxLengthValidatorBuilder()', () => {
  const maxLength = createMaxLengthValidatorBuilder(() => '');

  it('should return validator which works correctly', () => {
    const validate = maxLength(1);

    const invalidValues = ['aa', [0, 1], ['', '']];
    invalidValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Failed);
    });

    const validValues = [undefined, 'a', [], [1], ['']];
    validValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Passed);
    });
  });
});
