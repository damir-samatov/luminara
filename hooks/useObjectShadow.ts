import { useEffect, useRef, useState } from "react";
import { debounce } from "ts-debounce";
import deepEqual from "fast-deep-equal";

export const useObjectShadow = <T extends Record<string, unknown>>(
  state: T
) => {
  const [prevState, setPrevState] = useState<T>({ ...state });

  const [changeDetected, setChangeDetected] = useState(false);

  const debounced = useRef(
    debounce((prev: T, cur: T) => {
      setChangeDetected(!deepEqual(prev, cur));
    }, 200)
  );

  useEffect(() => {
    debounced.current(prevState, state);
  }, [state, prevState]);

  return {
    prevState,
    setPrevState,
    changeDetected,
  };
};
