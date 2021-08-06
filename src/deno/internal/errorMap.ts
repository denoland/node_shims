import * as errors from "../stable/variables/errors.js";

type Class<T> = new (...params: any[]) => T;

type ClassOrT<T> = T extends Class<infer U> ? U : T;

const mapper = (Ctor: typeof errors[keyof typeof errors]) =>
  (err: Error) =>
    Object.assign(new Ctor(err.message), {
      stack: err.stack,
    }) as ClassOrT<typeof Ctor>;

const map: Record<string, ReturnType<typeof mapper>> = {
  ENOENT: mapper(errors.NotFound),
};

const isNodeErr = (e: any): e is Error & { code: string } => {
  return e instanceof Error && "code" in e;
};

export default function mapError<E>(e: E) {
  if (!isNodeErr(e)) return e;
  return map[e.code]?.(e) || e;
}
