import { readFileSeparated, toNumber, expect } from "../helpers";
import { Solution } from "..";

const DAY = "04";

type Range = [number, number];
type Input = Range[][];
const toInput = (raw: string): Range => {
  const [a, b] = raw.split("-").map((s) => Number(s));
  return [a, b];
};
const parseInput = (values: string[]): Input =>
  values.filter((v) => v !== "").map((v) => v.split(",").map(toInput));

const getInput = readFileSeparated("\n", DAY, "input").then(parseInput);
const getTestInput = readFileSeparated("\n", DAY, "testInput").then(parseInput);

const hasFullOverlap = (a: Range, b: Range) => {
  return (a[0] >= b[0] && a[1] <= b[1]) || (b[0] >= a[0] && b[1] <= a[1]);
};

const hasAnyOverlap = (a: Range, b: Range) => {
  return !(a[1] < b[0] || b[1] < a[0]);
};

const processPartOne = (input: Input): number => {
  return input.filter((row) => hasFullOverlap(row[0], row[1])).length;
};

const processPartTwo = (input: Input): number => {
  return input.filter((row) => hasAnyOverlap(row[0], row[1])).length;
};

const solution: Solution = async () => {
  const input = await getInput;
  return processPartOne(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  await expect(() => processPartOne(testInput), 2);
  await expect(() => processPartTwo(testInput), 4);
};

solution.partTwo = async () => {
  const input = await getInput;
  return processPartTwo(input);
};

solution.inputs = [getInput];

export default solution;
