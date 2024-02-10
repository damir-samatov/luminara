export type PollingOptions<T> = {
  attempts: number;
  interval: number;
  callback: () => Promise<T>;
  successCallback: (data: T) => boolean;
};

export const sleep = async (time: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

export const poll = async <T>({
  attempts,
  callback,
  interval,
  successCallback,
}: PollingOptions<T>): Promise<T | null> => {
  try {
    for (let i = 0; i < attempts; i++) {
      const result = await callback();
      if (successCallback(result)) return result;
      await sleep(interval);
    }
  } catch (error) {
    console.error("poll", error);
    return null;
  }

  return null;
};
