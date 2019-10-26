import { KeyOf, keys } from './_keys';

type ValueMapped<T extends object, V> = {
  readonly [K in KeyOf<T>]: V;
};

export const mapValues = <T extends object, V>(
  value: T,
  f: <K extends KeyOf<T>>(value: T[K], key: K) => V,
): ValueMapped<T, V> => {
  return keys(value)
    .map((key) => [key, f(value[key], key)] as const)
    .reduce(
      (mapped, [key, mappedValue]) => ({
        ...mapped,
        [key]: mappedValue,
      }),
      {} as ValueMapped<T, V>,
    );
};
