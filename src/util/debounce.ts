export const debounce = (callback: (...args: any[]) => void, timeout = 300) => {
  let timer: ReturnType<typeof setTimeout> | null;

  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      timer = null;
      callback(...args);
    }, timeout);
  };
};
