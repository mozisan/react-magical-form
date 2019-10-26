import { act, renderHook } from '@testing-library/react-hooks';

import { text } from '../../_fieldFactories';
import { useForm } from '../../_formHooks';
import { pattern } from './_pattern';

describe('en', () => {
  describe('pattern()', () => {
    it('should format message in English', () => {
      const { result } = renderHook(() =>
        useForm({
          fields: {
            foo: text({
              spec: pattern(/^bar$/),
            }),
          },
        }),
      );

      act(() => {
        result.current.validate();
      });

      expect(result.current.errors).toEqual({
        foo: ['should match to `/^bar$/`.'],
      });
    });
  });
});
