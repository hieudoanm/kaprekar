import { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const KAPREKAR_CONSTANT_3: number = 495;
const KAPREKAR_CONSTANT_4: number = 6174;
const IGNORE_NUMBERS_3: Set<number> = new Set([
  111, 222, 333, 444, 555, 666, 777, 888, 999,
]);
const IGNORE_NUMBERS_4: Set<number> = new Set([
  1111, 2222, 3333, 4444, 5555, 6666, 7777, 8888, 9999,
]);

type Routine = { descending: number; ascending: number; result: number };

type KaprekarRoutineOptions = {
  count: number;
  length: number;
};

const kaprekarRoutine = (
  number: number,
  numbers: Routine[] = [],
  { count = 0, length = 4 }: KaprekarRoutineOptions = { count: 0, length: 4 },
): Routine[] => {
  if (
    IGNORE_NUMBERS_3.has(number) ||
    IGNORE_NUMBERS_4.has(number) ||
    number === KAPREKAR_CONSTANT_3 ||
    number === KAPREKAR_CONSTANT_4 ||
    count >= 8
  ) {
    return numbers;
  }

  const digits: number[] = number.toString().split('').map(Number);
  digits.sort((a, b) => a - b);
  const ascending: string = digits.join('');
  const reverse: number[] = digits.toReversed();
  const descending: string =
    digits.length < length ? `${reverse.join('')}0` : reverse.join('');
  const result: number = Number(descending) - Number(ascending);
  return kaprekarRoutine(
    result,
    [
      ...numbers,
      { descending: Number(descending), ascending: Number(ascending), result },
    ],
    { count: count + 1, length },
  );
};

const HomePage: NextPage = () => {
  const [number, setNumber] = useState(KAPREKAR_CONSTANT_4);

  const numbers: Routine[] = kaprekarRoutine(number, [], {
    count: 0,
    length: number.toString().length,
  });

  const showNumbers =
    IGNORE_NUMBERS_3.has(number) ||
    IGNORE_NUMBERS_4.has(number) ||
    number < 100 ||
    number > 9999;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
        setNumber((prev) => prev + 1);
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
        setNumber((prev) => prev - 1);
      } else if (e.key === ' ') {
        setNumber(KAPREKAR_CONSTANT_4);
      }
    };
    globalThis.addEventListener('keydown', handleKeyDown);
    return () => {
      globalThis.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden p-4 md:p-8">
      <div className="flex flex-col gap-y-4 md:gap-y-8">
        <h1 className="text-center text-lg font-black">
          Kaprekar&apos;s{' '}
          <Link
            href="https://en.wikipedia.org/wiki/Kaprekar%27s_routine"
            target="_blank"
            rel="noopener noreferrer"
            className="underline">
            Routine
          </Link>{' '}
          and{' '}
          <Link
            href="https://en.wikipedia.org/wiki/6174"
            target="_blank"
            rel="noopener noreferrer"
            className="underline">
            Constant
          </Link>
        </h1>
        <form className="flex flex-col gap-y-2">
          <label htmlFor="number" className="text-center text-sm">
            Input number from 100 to 9999
          </label>
          <div className="join">
            <button
              type="button"
              className="btn join-item"
              onClick={() => setNumber((prev) => prev - 1)}>
              -
            </button>
            <input
              type="number"
              id="number"
              name="number"
              placeholder="Number"
              className="join-item input w-full max-w-sm appearance-none text-center"
              min={100}
              max={9999}
              value={number}
              onChange={(e) => setNumber(Number(e.target.value))}
            />
            <button
              type="button"
              className="btn join-item"
              onClick={() => setNumber((prev) => prev + 1)}>
              +
            </button>
          </div>
        </form>
        <div className="flex h-54 flex-col gap-y-2">
          {number === KAPREKAR_CONSTANT_3 && (
            <div className="text-center text-sm">
              <p>{KAPREKAR_CONSTANT_3} is the Kaprekar’s Constant</p>
              <p>for 3 digits</p>
            </div>
          )}
          {number === KAPREKAR_CONSTANT_4 && (
            <div className="text-center text-sm">
              <p>{KAPREKAR_CONSTANT_4} is the Kaprekar’s Constant</p>
              <p>for 4 digits</p>
            </div>
          )}
          {(IGNORE_NUMBERS_3.has(number) || IGNORE_NUMBERS_4.has(number)) && (
            <div className="text-center text-sm">
              <p>Please enter a number that </p>
              <p>has at least two different digits</p>
            </div>
          )}
          {!showNumbers &&
            numbers.map(
              ({ descending, ascending, result }: Routine, index: number) => {
                return (
                  <div
                    key={`${number}-${descending}-${ascending}=${result}`}
                    className="flex items-center justify-center gap-x-2">
                    <pre>{index + 1}.</pre>
                    <pre className="w-10 text-right">{descending}</pre>
                    <pre> - </pre>
                    <pre className="w-10 text-right">{ascending}</pre>
                    <pre> = </pre>
                    {(result === KAPREKAR_CONSTANT_3 ||
                      result === KAPREKAR_CONSTANT_4) && (
                      <pre className="text-primary w-10 text-right">
                        {result}
                      </pre>
                    )}
                    {result !== KAPREKAR_CONSTANT_3 &&
                      result !== KAPREKAR_CONSTANT_4 && (
                        <pre className="w-10 text-right">{result}</pre>
                      )}
                  </div>
                );
              },
            )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
