export const debounce = <F extends (...args: never[]) => unknown>(
  fn: F,
  ms = 300
): F => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (...args: Parameters<F>): void {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  } as F;
};
