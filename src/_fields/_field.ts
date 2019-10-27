import { ApplyRefinement, Refinement, ValidationResult } from '../_validator';

export type InputElements =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

export type Field<
  TValue,
  TRefinement extends Refinement.Factory<TValue, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  TElement extends InputElements = InputElements
> = {
  readonly name: string;
  readonly bindToElement: (ref: TElement | null) => void;
  readonly getValue: () => TValue;
  readonly setValue: (value: TValue) => void;
  readonly validate: () => ValidationResult<TValue, TRefinement>;
  readonly focus: () => void;
  readonly reset: () => void;
  readonly clear: () => void;
  readonly dangerouslyGetRefinedValue: () => ApplyRefinement<
    TRefinement,
    TValue
  >;
};
