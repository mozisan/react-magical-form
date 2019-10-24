import { Field, InputElements } from '../_fields';
import { Refinement } from '../_validator';

export type FieldFactoryOf<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TField extends Field<any, any, any>
> = TField extends Field<infer TValue, infer TElement, infer TRefinement>
  ? FieldFactory<TValue, TElement, TRefinement>
  : never;

export type FieldFactory<
  TValue,
  TElement extends InputElements = InputElements,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRefinement extends Refinement<any, any> = never
> = (name: string) => Field<TValue, TElement, TRefinement>;
