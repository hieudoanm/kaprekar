import { NextPage } from 'next';
import { useEffect, useState } from 'react';

const KAPREKAR_CONSTANT_3: number = 495;
const KAPREKAR_CONSTANT_4: number = 6174;
const IGNORE_NUMBERS_3: number[] = [
  111, 222, 333, 444, 555, 666, 777, 888, 999,
];
const IGNORE_NUMBERS_4: number[] = [
  1111, 2222, 3333, 4444, 5555, 6666, 7777, 8888, 9999,
];

type Routine = { descending: number; ascending: number; result: number };

const kaprekarRoutine = (
  number: number,
  numbers: Routine[] = [],
  { count = 0, length = 4 } = { count: 0, length: 4 },
): Routine[] => {
  if (
    IGNORE_NUMBERS_3.includes(number) ||
    IGNORE_NUMBERS_4.includes(number) ||
    number === KAPREKAR_CONSTANT_3 ||
    number === KAPREKAR_CONSTANT_4 ||
    count >= 8
  ) {
    return numbers;
  }

  const digits: number[] = number.toString().split('').map(Number).sort();
  const ascending: string = digits.join('');
  const descending: string =
    digits.length < length
      ? `${digits.reverse().join('')}0`
      : digits.reverse().join('');
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

  const hideNumbers =
    IGNORE_NUMBERS_3.includes(number) &&
    IGNORE_NUMBERS_4.includes(number) &&
    number < 100 &&
    number > 9999;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setNumber((prev) => prev + 1);
      } else if (e.key === 'ArrowDown') {
        setNumber((prev) => prev - 1);
      } else if (e.key === ' ') {
        setNumber(KAPREKAR_CONSTANT_4);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden p-4 md:p-8">
      <div className="flex flex-col gap-y-4 md:gap-y-8">
        <h1 className="text-center text-lg font-black">
          Kaprekar&apos;s Routine and Constant
        </h1>
        <form className="flex flex-col gap-y-2">
          <label htmlFor="number" className="text-center text-sm">
            Input number from 100 to 9999
          </label>
          <input
            type="number"
            id="number"
            name="number"
            placeholder="Number"
            className="input w-xs appearance-none text-center"
            min={100}
            max={9999}
            value={number}
            onChange={(e) => setNumber(Number(e.target.value))}
          />
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
          {(IGNORE_NUMBERS_3.includes(number) ||
            IGNORE_NUMBERS_4.includes(number)) && (
            <div className="text-center text-sm">
              <p>Please enter a number that </p>
              <p>has at least two different digits</p>
            </div>
          )}
          {!hideNumbers &&
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
