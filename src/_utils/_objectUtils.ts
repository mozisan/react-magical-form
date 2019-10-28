export type KeyOf<T extends object> = Extract<keyof T, string>;

export const keys = <T extends object>(value: T): readonly (KeyOf<T>)[] =>
  (Object.keys(value) as unknown) as readonly (KeyOf<T>)[];

export const values = <T extends object, V>(value: T): readonly T[KeyOf<T>][] =>
  Object.values(value);

type ValueMapped<T extends object, V> = {
  readonly [K in KeyOf<T>]: V;
};

export const mapValues = <T extends object, V>(
  value: T,
  f: <K extends KeyOf<T>>(value: T[K], key: K) => V,
): ValueMapped<T, V> =>
  keys(value)
    .map((key) => [key, f(value[key], key)] as const)
    .reduce(
      (mapped, [key, mappedValue]) => ({
        ...mapped,
        [key]: mappedValue,
      }),
      {} as ValueMapped<T, V>,
    );

export const someValue = <T extends object, V>(
  value: T,
  f: <K extends KeyOf<T>>(value: T[K], key: K) => boolean,
): boolean => keys(value).some((key) => f(value[key], key));

export const mapObject = <T extends object, U>(
  value: T,
  transform: (value: T) => U,
): U => transform(value);
