import { Field, InputElements } from '../_fields';
import { Refinement } from '../_validator';

export type FieldFactoryOf<
  TField extends Field<any, any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
> = TField extends Field<infer TValue, infer TRefinement, infer TElement>
  ? FieldFactory<TValue, TRefinement, TElement>
  : never;

export type FieldFactory<
  TValue,
  TRefinement extends Refinement<any, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  TElement extends InputElements = InputElements
> = (name: string) => Field<TValue, TRefinement, TElement>;
