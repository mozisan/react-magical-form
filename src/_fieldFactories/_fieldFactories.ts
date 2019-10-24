import {
  BooleanField,
  BooleanFieldOptions,
  NumberField,
  NumberFieldOptions,
  StringField,
  StringFieldOptions,
} from '../_fields';
import { Refinement } from '../_validator';
import { FieldFactoryOf } from './_fieldFactory';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const boolean = <TRefinement extends Refinement<any, any> = never>(
  options: Omit<BooleanFieldOptions<TRefinement>, 'name'> = {},
): FieldFactoryOf<BooleanField<TRefinement>> => (name: string) =>
  new BooleanField({ ...options, name });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const number = <TRefinement extends Refinement<any, any> = never>(
  options: Omit<NumberFieldOptions<TRefinement>, 'name'> = {},
): FieldFactoryOf<NumberField<TRefinement>> => (name: string) =>
  new NumberField({ ...options, name });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const string = <TRefinement extends Refinement<any, any> = never>(
  options: Omit<StringFieldOptions<TRefinement>, 'name'> = {},
): FieldFactoryOf<StringField<TRefinement>> => (name: string) =>
  new StringField({ ...options, name });
