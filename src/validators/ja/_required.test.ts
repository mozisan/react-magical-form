import { act, renderHook } from '@testing-library/react-hooks';

import { checkbox, number, text } from '../../_fieldFactories';
import { useForm } from '../../_useForm';
import { required } from './_required';

describe('ja', () => {
  describe('required()', () => {
    it('should format message in Japanese', () => {
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
        foo: ['値は必須です。'],
        bar: ['値は必須です。'],
        baz: ['値は必須です。'],
      });
    });
  });
});
