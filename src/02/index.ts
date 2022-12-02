import { readFileSeparated, toNumber, expect } from "../helpers";
import { Solution } from "..";
import { sum } from "lodash";

const DAY = "02";

const ROCK = "R";
const PAPER = "P";
const SCISSORS = "S";

const MOVES = {
  A: ROCK,
  B: PAPER,
  C: SCISSORS,
  X: ROCK,
  Y: PAPER,
  Z: SCISSORS,
} as const;
type MOVE = typeof MOVES[keyof typeof MOVES];

const MOVE_SCORES: Record<MOVE, number> = {
  [ROCK]: 1,
  [PAPER]: 2,
  [SCISSORS]: 3,
};
const MOVE_BEATS: Record<MOVE, MOVE> = {
  [ROCK]: SCISSORS,
  [PAPER]: ROCK,
  [SCISSORS]: PAPER,
};
const MOVE_LOSES: Record<MOVE, MOVE> = {
  [ROCK]: PAPER,
  [PAPER]: SCISSORS,
  [SCISSORS]: ROCK,
};

const RESULTS = { WIN: 6, DRAW: 3, LOSE: 0 } as const;
type RESULT = typeof RESULTS[keyof typeof RESULTS];

const RESULTS_MAP = {
  X: RESULTS.LOSE,
  Y: RESULTS.DRAW,
  Z: RESULTS.WIN,
} as const;

const mapToMove = (input: string): MOVE => {
  return MOVES[input as keyof typeof MOVES];
};

const mapToResult = (input: string): RESULT => {
  return RESULTS_MAP[input as keyof typeof RESULTS_MAP];
};

type Input = [MOVE, MOVE][];
const parseInput = (values: string[]): Input =>
  values
    .filter((row) => row)
    .map((value) => {
      const [a, b] = value.split(" ").map((v) => mapToMove(v));
      return [a, b];
    });

type Input2 = [MOVE, RESULT][];
const parseInput2 = (values: string[]): Input2 =>
  values
    .filter((row) => row)
    .map((value) => {
      const [a, b] = value.split(" ");
      return [mapToMove(a), mapToResult(b)];
    });

const getInput = readFileSeparated("\n", DAY, "input").then(parseInput);
const getTestInput = readFileSeparated("\n", DAY, "testInput").then(parseInput);

const getInput2 = readFileSeparated("\n", DAY, "input").then(parseInput2);
const getTestInput2 = readFileSeparated("\n", DAY, "testInput").then(
  parseInput2
);

const getScore = (a: MOVE, b: MOVE) => {
  let score = MOVE_SCORES[b];
  if (a === b) {
    return score + 3;
  }
  if (MOVE_BEATS[b] === a) {
    return score + 6;
  }
  return score;
};

const processPartOne = (input: Input): number => {
  return sum(input.map(([a, b]) => getScore(a, b)));
};

const getScore2 = (a: MOVE, b: RESULT) => {
  let m: MOVE = a;
  if (b === RESULTS.WIN) {
    m = MOVE_LOSES[a];
  }
  if (b === RESULTS.LOSE) {
    m = MOVE_BEATS[a];
  }
  return getScore(a, m);
};

const processPartTwo = (input: Input2): number => {
  return sum(input.map(([a, b]) => getScore2(a, b)));
};

const solution: Solution = async () => {
  const input = await getInput;
  return processPartOne(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  const testInput2 = await getTestInput2;
  await expect(() => processPartOne(testInput), 15);
  await expect(() => processPartTwo(testInput2), 12);
};

solution.partTwo = async () => {
  const input = await getInput2;
  return processPartTwo(input);
};

solution.inputs = [getInput];

export default solution;
