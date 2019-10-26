type ExactEqual<A, B> = readonly [A] extends readonly [B]
  ? readonly [B] extends readonly [A]
    ? true
    : false
  : false;

export const expectType = <A>() => ({
  as: <B>(): ExactEqual<A, B> extends true
    ? { readonly assert: () => void } // eslint-disable-next-line @typescript-eslint/no-explicit-any
    : never => ({ assert: () => undefined } as any),
});
