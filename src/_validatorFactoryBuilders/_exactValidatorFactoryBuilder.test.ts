import { renderHook } from '@testing-library/react-hooks';

import { number, text, textChoice } from '../_fieldFactories';
import { useForm } from '../_formHooks';
import { expectType } from '../_utils';
import { compose, ValidationResult } from '../_validator';
import { createExactValidatorBuilder } from './_exactValidatorFactoryBuilder';
import { createRequiredValidatorBuilder } from './_requiredValidatorFactoryBuilder';

describe('createExactValidatorBuilder()', () => {
  const exact = createExactValidatorBuilder(() => '');
  const required = createRequiredValidatorBuilder(() => '');

  it('should return validator which works correctly', () => {
    const validate = exact(10);

    const invalidValues = [0, 1, 11, 100];
    invalidValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Failed);
    });

    const validValues = [undefined, 10];
    validValues.forEach((value) => {
      expect(validate(value)).toBeInstanceOf(ValidationResult.Passed);
    });
  });

  describe('refinement', () => {
    it('should refine types correctly', () => {
      const { result } = renderHook(() =>
        useForm({
          foo: text({
            spec: exact('foo'),
          }),
          bar: textChoice({
            spec: exact('bar'),
          }),
          baz: number({
            spec: exact(1),
          }),
        }),
      );

      const values = result.current.getValues();
      expectType<typeof values>()
        .as<{
          readonly foo: string;
          readonly bar: string | undefined;
          readonly baz: number | undefined;
        }>()
        .assert();

      result.current.handleSubmit((refinedValues) => {
        expectType<typeof refinedValues>()
          .as<{
            readonly foo: 'foo';
            readonly bar: 'bar' | undefined;
            readonly baz: 1 | undefined;
          }>()
          .assert();
      });
    });

    it('should be able to use with required()', () => {
      const { result } = renderHook(() =>
        useForm({
          foo: text({
            spec: exact('foo'),
          }),
          bar: textChoice({
            spec: compose(
              required(),
              exact('bar'),
            ),
          }),
          baz: number({
            spec: compose(
              required(),
              exact(1),
            ),
          }),
        }),
      );

      const values = result.current.getValues();
      expectType<typeof values>()
        .as<{
          readonly foo: string;
          readonly bar: string | undefined;
          readonly baz: number | undefined;
        }>()
        .assert();

      result.current.handleSubmit((refinedValues) => {
        expectType<typeof refinedValues>()
          .as<{
            readonly foo: 'foo';
            readonly bar: 'bar';
            readonly baz: 1;
          }>()
          .assert();
      });
    });
  });
});
