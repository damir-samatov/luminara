import { useCallback, useState } from "react";

export const useServerAction = <
  T extends (...ars: Parameters<T>) => Promise<Awaited<ReturnType<T>>>,
>(
  serverAction: T,
  onSuccess: (res: Awaited<ReturnType<T>>) => void,
  onError: () => void
): [(...ars: Parameters<T>) => void, boolean] => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const action = useCallback(
    async (...args: Parameters<T>) => {
      setIsLoading(true);
      try {
        const res = await serverAction(...args);
        onSuccess(res);
      } catch (error) {
        console.error("useServerAction", error);
        onError();
      } finally {
        setIsLoading(false);
      }
    },
    [serverAction, onSuccess, onError]
  );

  return [action, isLoading];
};
