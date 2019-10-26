import {
  CheckboxField,
  CheckboxFieldOptions,
  NumberField,
  NumberFieldOptions,
  RadioboxField,
  RadioboxFieldOptions,
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

export const radio = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRefinement extends Refinement<any, any>
>(
  options: Omit<RadioboxFieldOptions<TRefinement>, 'name'> = {},
): FieldFactoryOf<RadioboxField<TRefinement>> => (name) =>
  new RadioboxField<TRefinement>({ ...options, name });

export const text = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TRefinement extends Refinement<any, any>
>(
  options: Omit<TextFieldOptions<TRefinement>, 'name'> = {},
): FieldFactoryOf<TextField<TRefinement>> => (name) =>
  new TextField<TRefinement>({ ...options, name });
