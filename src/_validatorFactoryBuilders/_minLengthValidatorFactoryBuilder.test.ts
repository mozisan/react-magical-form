import { ValidationResult } from '../_validator';
import { createMinLengthValidatorBuilder } from './_minLengthValidatorFactoryBuilder';

describe('createMinLengthValidatorBuilder()', () => {
  it('should return validator which works correctly', () => {
    const validate = createMinLengthValidatorBuilder(() => '')(2);

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
