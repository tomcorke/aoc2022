import { readFileSeparated, toNumber, expect } from "../helpers";
import { Solution } from "..";

const DAY = "10";

type Input = [string, number | undefined][];
const parseInput = (values: string[]): Input =>
  values
    .filter((v) => v !== "")
    .map((v) => {
      const [a, b] = v.split(" ");
      return [a, b ? Number(b) : undefined];
    });

const getInput = readFileSeparated("\n", DAY, "input").then(parseInput);
const getTestInput = readFileSeparated("\n", DAY, "testInput").then(parseInput);
const getTestInput2 = readFileSeparated("\n", DAY, "testInput2").then(
  parseInput
);

const processPartOne = (input: Input): number => {
  let result = 0;
  let x = 1;

  input
    .flatMap((i) => {
      if (i[0] === "addx") {
        return [0, i[1] as number];
      } else {
        return [0];
      }
    })
    .forEach((n, i) => {
      const cycle = i + 1;
      if (cycle % 40 === 20) {
        console.log(cycle, x, x * cycle);
        result += x * cycle;
      }
      x += n;
    });

  return result;
};

const processPartTwo = (input: Input): number => {
  let x = 1;

  const output: string[] = [];
  input
    .flatMap((i) => {
      if (i[0] === "addx") {
        return [0, i[1] as number];
      } else {
        return [0];
      }
    })
    .forEach((n, i) => {
      if (i % 40 == 0) {
        output.push("\n");
      }
      if ([x - 1, x, x + 1].some((y) => y === i % 40)) {
        output.push("██");
      } else {
        output.push(". ");
      }
      x += n;
    });

  console.log(output.join(""));
  return NaN;
};

const solution: Solution = async () => {
  const input = await getInput;
  return processPartOne(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  const testInput2 = await getTestInput2;
  // await expect(() => processPartOne(testInput), 3.141592653589793);
  await expect(() => processPartOne(testInput2), 13140);
  // await expect(() => processPartTwo(testInput), 3.141592653589793);
};

solution.partTwo = async () => {
  const input = await getInput;
  return processPartTwo(input);
};

solution.inputs = [getInput];

export default solution;
