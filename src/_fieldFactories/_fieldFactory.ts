import { Field, InputElements } from '../_fields';
import { Refinement } from '../_validator';

export type FieldFactoryOf<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TField extends Field<any, any, any>
> = TField extends Field<infer TValue, infer TRefinement, infer TElement>
  ? FieldFactory<TValue, TRefinement, TElement>
  : never;

export type FieldFactory<
  TValue,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRefinement extends Refinement<any, any>,
  TElement extends InputElements = InputElements
> = (name: string) => Field<TValue, TRefinement, TElement>;
