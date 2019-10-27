export type IsAny<T> = any extends T ? true : false; // eslint-disable-line @typescript-eslint/no-explicit-any
export type IsNever<T> = readonly [T] extends readonly [never] ? true : false;
export type IsUnknown<T> = unknown extends T ? true : false;

export type CoerceNever<A, B> = IsNever<A> extends true ? B : A;
export type CoerceUnknown<A, B> = IsUnknown<A> extends true ? B : A;

export type UnionToIntersection<T> = (T extends any // eslint-disable-line @typescript-eslint/no-explicit-any
  ? (t: T) => void
  : never) extends ((i: infer I) => void)
  ? I
  : never;

declare const BoxedBrand: unique symbol;
export type Boxed<T> = { readonly [BoxedBrand]: T };
export type BoxedValueOf<T> = T extends Boxed<infer U> ? U : never;

type TupleToBoxedTuple<T> = { [K in keyof T]: Boxed<T[K]> };
type TupleToBoxedUnion<T> = TupleToBoxedTuple<T>[Extract<keyof T, number>];
export type TupleToUnion<T> = BoxedValueOf<TupleToBoxedUnion<T>>;
export type TupleToIntersection<T> = BoxedValueOf<
  UnionToIntersection<TupleToBoxedUnion<T>>
>;
