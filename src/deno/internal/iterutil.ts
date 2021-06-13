const convert = <T>(iter: AsyncIterator<T>, i: number) =>
  iter.next().then((result) => ({ result, i }));

export async function* merge<T>(iterables: AsyncIterable<T>[]) {
  const iterators = iterables.map((iter) => iter[Symbol.asyncIterator]());
  const racers = iterators.map(convert);

  while (racers.length) {
    const winner = await Promise.race(racers);
    if (winner.result.done) {
      iterators.splice(winner.i, 1);
      racers.splice(
        winner.i,
        Infinity,
        ...racers
          .slice(winner.i + 1)
          .map((racer) => racer.then(({ result, i }) => ({ result, i: i - 1 })))
      );
    } else {
      yield await winner.result.value;
      racers[winner.i] = convert(iterators[winner.i], winner.i);
    }
  }
}

export async function* map<T, U>(
  iter: AsyncIterable<T>,
  f: (t: T) => U
): AsyncIterable<U> {
  for await (const i of iter) {
    yield f(i);
  }
}
