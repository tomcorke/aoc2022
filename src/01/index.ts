import { readFileSeparated, toNumber, expect } from "../helpers";
import { Solution } from "..";
import { sum } from "lodash";

const DAY = "01";

type Input = number[][];
const parseInput = (values: string[]): Input =>
  values.map((value) => value.split("\n").map((n) => Number(n)));

const getInput = readFileSeparated("\n\n", DAY, "input").then(parseInput);
const getTestInput = readFileSeparated("\n\n", DAY, "testInput").then(
  parseInput
);

const processPartOne = (input: Input): number => {
  return Math.max(...input.map((elf) => sum(elf)));
};

const processPartTwo = (input: Input): number => {
  const totals = input.map((elf) => sum(elf));
  const topThree = totals.sort((a, b) => b - a).slice(0, 3);
  console.log(topThree);
  return sum(topThree);
};

const solution: Solution = async () => {
  const input = await getInput;
  return processPartOne(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  await expect(() => processPartOne(testInput), 24000);
  await expect(() => processPartTwo(testInput), 45000);
};

solution.partTwo = async () => {
  const input = await getInput;
  return processPartTwo(input);
};

solution.inputs = [getInput];

export default solution;
