import { ValidationResult } from '../_validator';
import { createMinLengthValidatorBuilder } from './_minLengthValidatorFactoryBuilder';

describe('createMinLengthValidatorBuilder()', () => {
  const minLength = createMinLengthValidatorBuilder(() => '');

  it('should return validator which works correctly', () => {
    const validate = minLength(2);

    const invalidValues = ['', 'a', [], [0], ['']];
    invalidValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Failed);
    });

    const validValues = [undefined, 'aa', [0, 1], ['', '']];
    validValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Passed);
    });
  });
});
