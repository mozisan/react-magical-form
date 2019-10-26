import { act, renderHook } from '@testing-library/react-hooks';

import { number } from '../../_fieldFactories';
import { useForm } from '../../_formHooks';
import { range } from './_range';

describe('en', () => {
  describe('range()', () => {
    it('should format message in English', () => {
      const { result } = renderHook(() =>
        useForm({
          fields: {
            foo: number({
              initial: 0,
              spec: range(1, 10),
            }),
          },
        }),
      );

      act(() => {
        result.current.validate();
      });

      expect(result.current.errors).toEqual({
        foo: ['should be between 1 and 10.'],
      });
    });
  });
});
