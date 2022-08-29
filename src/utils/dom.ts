export const addEventListeners: <
  T extends HTMLElement,
  E extends keyof HTMLElementEventMap
>(
  target: T,
  events: readonly E[],
  handler: (this: T, event: HTMLElementEventMap[E]) => void
) => void = (target, events, handler) => {
  events.forEach((event) => target.addEventListener(event, handler as any));
};

export const isTouchDevice = navigator.maxTouchPoints > 0;
