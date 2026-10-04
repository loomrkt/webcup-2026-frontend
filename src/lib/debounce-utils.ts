//debounce
export const debounce = <T extends unknown[]>(
  fn: (...args: T) => void,
  timeout: number = 400,
) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: T) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), timeout);
  };
};