import { ApplyRefinement, Refinement, ValidationResult } from '../_validator';

export type InputElements =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

export type Field<
  TValue,
  TElement extends InputElements = InputElements,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRefinement extends Refinement<any, any> = never
> = {
  readonly name: string;
  readonly bindToElement: (ref: TElement | null) => void;
  readonly getValue: () => TValue;
  readonly setValue: (value: TValue) => void;
  readonly validate: () => ValidationResult<TValue, TRefinement>;
  readonly focus: () => void;
  readonly dangerouslyGetRefinedValue: () => ApplyRefinement<
    TRefinement,
    TValue
  >;
};
