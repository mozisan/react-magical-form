import { KeyOf } from './_keys';

export const values = <T extends object, V>(value: T): readonly T[KeyOf<T>][] =>
  Object.values(value);
