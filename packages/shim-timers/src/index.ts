const originalSetTimeout = globalThis.setTimeout;
export function setTimeout(
  cb: (...args: any[]) => void,
  delay?: number,
  ...args: any[]
): number {
  const result = originalSetTimeout(cb, delay, ...args);
  // node may return a Timeout object, but return the primitive instead
  return typeof result === "number"
    ? result
    : (result as any)[Symbol.toPrimitive]();
}

const originalSetInterval = globalThis.setInterval;
export function setInterval(
  cb: (...args: any[]) => void,
  delay?: number,
  ...args: any[]
): number {
  const result = originalSetInterval(cb, delay, ...args);
  // node may return a Timeout object, but return the primitive instead
  return typeof result === "number"
    ? result
    : (result as any)[Symbol.toPrimitive]();
}
