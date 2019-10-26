import { act, renderHook } from '@testing-library/react-hooks';

import { checkbox, number, text } from '../../_fieldFactories';
import { useForm } from '../../_useForm';
import { required } from './_required';

describe('en', () => {
  describe('required()', () => {
    it('should format message in English', () => {
      const { result } = renderHook(() =>
        useForm({
          fields: {
            foo: number({
              spec: required(),
            }),
            bar: text({
              initial: '',
              spec: required(),
            }),
            baz: checkbox({
              spec: required(),
            }),
          },
        }),
      );

      act(() => {
        result.current.validate();
      });

      expect(result.current.errors).toEqual({
        foo: ['required.'],
        bar: ['required.'],
        baz: ['required.'],
      });
    });
  });
});
