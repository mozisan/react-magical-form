import {
  Boxed,
  BoxedValueOf,
  CoerceUnknown,
  IsAny,
  IsNever,
  UnionToIntersection,
} from '../_utils';

declare const RefinementBrand: unique symbol;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Refinement<A extends Boxed<any>, B extends Boxed<any>> = {
  readonly [RefinementBrand]: readonly [A, B];
};

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Refinement {
  export type Factory<A, B> = Refinement<Boxed<A>, Boxed<B>>;
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
              : Boxed<T> extends Boxed<U>
              ? Boxed<T & V>
              : Boxed<unknown>
            : Boxed<unknown>
        >
      >,
      T
    >;
