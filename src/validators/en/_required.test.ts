import { act, renderHook } from '@testing-library/react-hooks';

import { boolean, number, string } from '../../_fieldFactories';
import { useForm } from '../../_useForm';
import { required } from './_required';

describe('en', () => {
  describe('required()', () => {
    it('should format message in English', () => {
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
        foo: ['required.'],
        bar: ['required.'],
        baz: ['required.'],
      });
    });
  });
});
