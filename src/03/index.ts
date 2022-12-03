import { readFileSeparated, toNumber, expect } from "../helpers";
import { Solution } from "..";
import { split, sum } from "lodash";

const DAY = "03";

type Input = string[];
const parseInput = (values: string[]): Input =>
  values.filter((v) => v !== "").map((v) => v);

const getInput = readFileSeparated("\n", DAY, "input").then(parseInput);
const getTestInput = readFileSeparated("\n", DAY, "testInput").then(parseInput);

const findCommon = (...buckets: string[]) => {
  const s = new Set<string>();
  const l = Math.min(...buckets.map((b) => b.length));
  const shortest = buckets.find((b) => b.length === l);
  const others = buckets.filter((b) => b !== shortest);
  for (let i = 0; i < l; i++) {
    const char = shortest![i];
    if (others.every((b) => b.includes(char))) {
      s.add(char);
    }
  }
  return s;
};

const mapToScores = (s: Iterable<string>) =>
  [...s].map((c) => {
    let v = c.charCodeAt(0) - 96;
    if (v <= 0) {
      v += 58;
    }
    return v;
  });

const processPartOne = (input: Input): number => {
  const rucksacks = input.map((i) => [
    i.slice(0, i.length / 2),
    i.slice(i.length / 2),
  ]);
  const shared = rucksacks.map((r) => findCommon(r[0], r[1]));
  const scores = shared.flatMap((s) => mapToScores(s));
  return sum(scores);
};

const processPartTwo = (input: Input): number => {
  let shared: Set<string>[] = [];
  for (let i = 0; i < input.length; i += 3) {
    shared.push(findCommon(...input.slice(i, i + 3)));
  }
  const scores = shared.flatMap((s) => mapToScores(s));
  return sum(scores);
};

const solution: Solution = async () => {
  const input = await getInput;
  return processPartOne(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  await expect(() => processPartOne(testInput), 157);
  await expect(() => processPartTwo(testInput), 70);
};

solution.partTwo = async () => {
  const input = await getInput;
  return processPartTwo(input);
};

solution.inputs = [getInput];

export default solution;
