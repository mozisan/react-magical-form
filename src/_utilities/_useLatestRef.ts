import { RefObject, useRef } from 'react';

export const useLatestRef = <T>(value: T): RefObject<T> => {
  const latestRef = useRef(value);
  latestRef.current = value;

  return latestRef;
};
