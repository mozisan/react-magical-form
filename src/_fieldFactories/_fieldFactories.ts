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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkbox = <TRefinement extends Refinement<any, any> = never>(
  options: Omit<CheckboxFieldOptions<TRefinement>, 'name'> = {},
): FieldFactoryOf<CheckboxField<TRefinement>> => (name) =>
  new CheckboxField<TRefinement>({ ...options, name });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const number = <TRefinement extends Refinement<any, any> = never>(
  options: Omit<NumberFieldOptions<TRefinement>, 'name'> = {},
): FieldFactoryOf<NumberField<TRefinement>> => (name) =>
  new NumberField<TRefinement>({ ...options, name });

type A = FieldFactoryOf<RadioboxField<never>>;
const a: A = (name) => new RadioboxField<never>({ name });
a;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const radio = <TRefinement extends Refinement<any, any> = never>(
  options: Omit<RadioboxFieldOptions<TRefinement>, 'name'> = {},
): FieldFactoryOf<RadioboxField<TRefinement>> => (name) =>
  new RadioboxField<TRefinement>({ ...options, name });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const text = <TRefinement extends Refinement<any, any> = never>(
  options: Omit<TextFieldOptions<TRefinement>, 'name'> = {},
): FieldFactoryOf<TextField<TRefinement>> => (name) =>
  new TextField<TRefinement>({ ...options, name });
