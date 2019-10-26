import {
  CheckboxField,
  CheckboxFieldOptions,
  NumberChoiceField,
  NumberChoiceFieldOptions,
  NumberField,
  NumberFieldOptions,
  TextChoiceField,
  TextChoiceFieldOptions,
  TextField,
  TextFieldOptions,
} from '../_fields';
import { Refinement } from '../_validator';
import { FieldFactoryOf } from './_fieldFactory';

export const checkbox = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRefinement extends Refinement<any, any>
>(
  options: Omit<CheckboxFieldOptions<TRefinement>, 'name'> = {},
): FieldFactoryOf<CheckboxField<TRefinement>> => (name) =>
  new CheckboxField<TRefinement>({ ...options, name });

export const number = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRefinement extends Refinement<any, any>
>(
  options: Omit<NumberFieldOptions<TRefinement>, 'name'> = {},
): FieldFactoryOf<NumberField<TRefinement>> => (name) =>
  new NumberField<TRefinement>({ ...options, name });

export const numberChoice = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRefinement extends Refinement<any, any>
>(
  options: Omit<NumberChoiceFieldOptions<TRefinement>, 'name'> = {},
): FieldFactoryOf<NumberChoiceField<TRefinement>> => (name) =>
  new NumberChoiceField<TRefinement>({ ...options, name });

export const text = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRefinement extends Refinement<any, any>
>(
  options: Omit<TextFieldOptions<TRefinement>, 'name'> = {},
): FieldFactoryOf<TextField<TRefinement>> => (name) =>
  new TextField<TRefinement>({ ...options, name });

export const textChoice = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRefinement extends Refinement<any, any>
>(
  options: Omit<TextChoiceFieldOptions<TRefinement>, 'name'> = {},
): FieldFactoryOf<TextChoiceField<TRefinement>> => (name) =>
  new TextChoiceField<TRefinement>({ ...options, name });
