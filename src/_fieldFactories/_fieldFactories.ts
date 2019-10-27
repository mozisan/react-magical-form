import {
  CheckboxField,
  CheckboxFieldOptions,
  FileField,
  FileFieldOptions,
  FilesField,
  FilesFieldOptions,
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
  TRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
>(
  options: Omit<CheckboxFieldOptions<TRefinement>, 'name'> = {},
): FieldFactoryOf<CheckboxField<TRefinement>> => (name) =>
  new CheckboxField<TRefinement>({ ...options, name });

export const file = <
  TRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
>(
  options: Omit<FileFieldOptions<TRefinement>, 'name'> = {},
): FieldFactoryOf<FileField<TRefinement>> => (name) =>
  new FileField<TRefinement>({ ...options, name });

export const files = <
  TRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
>(
  options: Omit<FilesFieldOptions<TRefinement>, 'name'> = {},
): FieldFactoryOf<FilesField<TRefinement>> => (name) =>
  new FilesField<TRefinement>({ ...options, name });

export const number = <
  TRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
>(
  options: Omit<NumberFieldOptions<TRefinement>, 'name'> = {},
): FieldFactoryOf<NumberField<TRefinement>> => (name) =>
  new NumberField<TRefinement>({ ...options, name });

export const numberChoice = <
  TRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
>(
  options: Omit<NumberChoiceFieldOptions<TRefinement>, 'name'> = {},
): FieldFactoryOf<NumberChoiceField<TRefinement>> => (name) =>
  new NumberChoiceField<TRefinement>({ ...options, name });

export const text = <
  TRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
>(
  options: Omit<TextFieldOptions<TRefinement>, 'name'> = {},
): FieldFactoryOf<TextField<TRefinement>> => (name) =>
  new TextField<TRefinement>({ ...options, name });

export const textChoice = <
  TRefinement extends Refinement<any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
>(
  options: Omit<TextChoiceFieldOptions<TRefinement>, 'name'> = {},
): FieldFactoryOf<TextChoiceField<TRefinement>> => (name) =>
  new TextChoiceField<TRefinement>({ ...options, name });
