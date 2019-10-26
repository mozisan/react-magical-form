import { act, renderHook } from '@testing-library/react-hooks';

import { number } from '../../_fieldFactories';
import { useForm } from '../../_formHooks';
import { max } from './_max';

describe('ja', () => {
  describe('max()', () => {
    it('should format message in Japanese', () => {
      const { result } = renderHook(() =>
        useForm({
          fields: {
            foo: number({
              initial: 2,
              spec: max(1),
            }),
          },
        }),
      );

      act(() => {
        result.current.validate();
      });

      expect(result.current.errors).toEqual({
        foo: ['1以下の値を指定してください。'],
      });
    });
  });
});
