import { act, renderHook } from '@testing-library/react-hooks';

import { string } from '../../_fieldFactories';
import { useForm } from '../../_useForm';
import { pattern } from './_pattern';

describe('ja', () => {
  describe('pattern()', () => {
    it('should format message in Japanese', () => {
      const { result } = renderHook(() =>
        useForm({
          fields: {
            foo: string({
              validators: [pattern(/^bar$/)],
            }),
          },
        }),
      );

      act(() => {
        result.current.validate();
      });

      expect(result.current.errors).toEqual({
        foo: ['`/^bar$/`にマッチしません。'],
      });
    });
  });
});
