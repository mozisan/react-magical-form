type IsNever<T> = readonly [T] extends readonly [never] ? true : false;
type NeverToUnknown<T> = IsNever<T> extends true ? unknown : T;

export type ApplyRefinement<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRefinement,
  T
> = NeverToUnknown<TRefinement> extends Refinement<infer U, infer V>
  ? T extends U
    ? V extends T
      ? any extends V // eslint-disable-line @typescript-eslint/no-explicit-any
        ? T
        : V
      : never
    : T
  : T;

declare const A: unique symbol;
declare const B: unique symbol;

export type Refinement<A, B extends A> = {
  readonly [A]: A;
  readonly [B]: B;
};
