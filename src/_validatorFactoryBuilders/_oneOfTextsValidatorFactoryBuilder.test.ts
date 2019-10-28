import { ValidationResult } from '../_validator';
import { createOneOfTextsValidatorBuilder } from './_oneOfTextsValidatorFactoryBuilder';

describe('createOneOfTextsValidatorBuilder()', () => {
  const oneOfTexts = createOneOfTextsValidatorBuilder(() => '');

  it('should return validator which works correctly', () => {
    const validate = oneOfTexts('foo', 'bar');

    const invalidValues = ['', 'fo', 'ar'];
    invalidValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Failed);
    });

    const validValues = [undefined, 'foo', 'bar'];
    validValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Passed);
    });
  });
});
