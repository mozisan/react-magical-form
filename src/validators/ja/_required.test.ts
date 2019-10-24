import { act, renderHook } from '@testing-library/react-hooks';

import { boolean, number, string } from '../../_fieldFactories';
import { useForm } from '../../_useForm';
import { required } from './_required';

describe('ja', () => {
  describe('required()', () => {
    it('should format message in Japanese', () => {
      const { result } = renderHook(() =>
        useForm({
          fields: {
            foo: number({
              validators: [required()],
            }),
            bar: string({
              initial: '',
              validators: [required()],
            }),
            baz: boolean({
              validators: [required()],
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
