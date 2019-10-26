import { act, renderHook } from '@testing-library/react-hooks';

import { number } from '../../_fieldFactories';
import { useForm } from '../../_useForm';
import { min } from './_min';

describe('en', () => {
  describe('min()', () => {
    it('should format message in English', () => {
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
        foo: ['should be greater then or equal to 1.'],
      });
    });
  });
});
