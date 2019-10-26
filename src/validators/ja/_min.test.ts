import { act, renderHook } from '@testing-library/react-hooks';

import { number } from '../../_fieldFactories';
import { useForm } from '../../_formHooks';
import { min } from './_min';

describe('ja', () => {
  describe('min()', () => {
    it('should format message in Japanese', () => {
      const { result } = renderHook(() =>
        useForm({
          fields: {
            foo: number({
              initial: 0,
              spec: min(1),
            }),
          },
        }),
      );

      act(() => {
        result.current.validate();
      });

      expect(result.current.errors).toEqual({
        foo: ['1以上の値を指定してください。'],
      });
    });
  });
});
