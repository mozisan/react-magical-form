import {
  Boxed,
  BoxedValueOf,
  CoerceUnknown,
  IsAny,
  IsNever,
  UnionToIntersection,
} from '../_utils';

type Extends<A, B> = Boxed<A> extends Boxed<B> ? true : false;

declare const RefinementBrand: unique symbol;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Refinement<A extends Boxed<any>, B extends Boxed<any>> = {
  readonly [RefinementBrand]: readonly [A, B];
};

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Refinement {
  export type Factory<A, B extends A> = Refinement<Boxed<A>, Boxed<B>>;
}

export type ApplyRefinement<TRefinement, T> = IsNever<TRefinement> extends true
  ? T
  : CoerceUnknown<
      BoxedValueOf<
        UnionToIntersection<
          TRefinement extends Refinement<Boxed<infer U>, Boxed<infer V>>
            ? IsNever<U> extends true
              ? Boxed<unknown>
              : IsNever<V> extends true
              ? Boxed<unknown>
              : IsAny<V> extends true
              ? Boxed<unknown>
              : Extends<T, U> extends true
              ? Extends<T, readonly any[]> extends true // eslint-disable-line @typescript-eslint/no-explicit-any
                ? Boxed<V>
                : Boxed<T & V>
              : Boxed<unknown>
            : Boxed<unknown>
        >
      >,
      T
    >;
