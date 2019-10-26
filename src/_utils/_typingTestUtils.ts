import { MutableRefObject, Ref } from 'react';

type ExactEqual<A, B> = readonly [A] extends readonly [B]
  ? readonly [B] extends readonly [A]
    ? true
    : false
  : false;

export const expectType = <A>() => ({
  as: <B>(): ExactEqual<A, B> extends true
    ? { readonly assert: () => void }
    : never => ({ assert: () => undefined } as any), // eslint-disable-line @typescript-eslint/no-explicit-any
});

export const combineRefs = <T>(...refs: readonly Ref<T>[]): Ref<T> => (
  target: T | null,
) => {
  refs.forEach((ref) => {
    if (typeof ref === 'function') {
      ref(target);
    } else {
      ((ref as unknown) as MutableRefObject<T | null>).current = target; // eslint-disable-line functional/immutable-data
    }
  });
};
