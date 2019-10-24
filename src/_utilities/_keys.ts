export type KeyOf<T extends object> = Extract<keyof T, string>;

export const keys = <T extends object>(value: T): readonly (KeyOf<T>)[] =>
  (Object.keys(value) as unknown) as readonly (KeyOf<T>)[];
