import { useRef } from 'react';

export const useLatestRef = <T>(
  value: T,
): {
  readonly current: T;
} => {
  const latestRef = useRef(value);
  latestRef.current = value;

  return latestRef;
};
