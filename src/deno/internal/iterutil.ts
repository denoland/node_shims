export function* map<T, U>(iter: Iterable<T>, f: (t: T) => U): Iterable<U> {
  for (const i of iter) {
    yield f(i);
  }
}

export async function* mapAsync<T, U>(
  iter: AsyncIterable<T>,
  f: (t: T) => U
): AsyncIterable<U> {
  for await (const i of iter) {
    yield f(i);
  }
}

export async function* merge<T>(iterables: AsyncIterable<T>[]) {
  const racers = new Map<AsyncIterator<T>, Promise<IteratorResult<T>>>(
    map(
      map(iterables, (iter) => iter[Symbol.asyncIterator]()),
      (iter) => [iter, iter.next()]
    )
  );

  while (racers.size > 0) {
    const winner = await Promise.race(
      map(racers.entries(), ([iter, prom]) =>
        prom.then((result) => ({ result, iter }))
      )
    );

    if (winner.result.done) {
      racers.delete(winner.iter);
    } else {
      yield await winner.result.value;
      racers.set(winner.iter, winner.iter.next());
    }
  }
}
