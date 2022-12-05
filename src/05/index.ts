import { readFileSeparated, toNumber, expect, readFile } from "../helpers";
import { Solution } from "..";

const DAY = "05";

type Input = {
  buckets: Record<string, string[]>;
  instructions: { from: string; to: string; count: number }[];
};

// move 1 from 2 to 3
const toInstruction = (raw: string) => {
  const regex = /^move (\d+) from (\d+) to (\d+)$/;
  const m = regex.exec(raw);
  if (!m) {
    throw Error(`No match for string "${raw}"`);
  }
  return { from: m[2], to: m[3], count: Number(m[1]) };
};

const toBuckets = (raw: string) => {
  const rows = raw
    .split("\n")
    .filter((row) => row)
    .reverse();
  const b = rows[0];
  const bc = (b.length + 1) / 4;
  const buckets: Record<string, string[]> = {};
  for (let i = 1; i <= bc; i++) {
    buckets[i] = [];
  }
  for (const r of rows.slice(1)) {
    for (let i = 1; i <= bc; i++) {
      const crate = r.substring((i - 1) * 4 + 1, (i - 1) * 4 + 2);
      if (crate && crate !== " ") {
        buckets[i].push(crate);
      }
    }
  }
  return buckets;
};

const parseInput = (raw: string): Input => {
  const [rawBuckets, rawInstructions] = raw.split("\n\n");
  const instructions = rawInstructions
    .split("\n")
    .filter((row) => row)
    .map(toInstruction);
  const buckets = toBuckets(rawBuckets);
  return { buckets, instructions };
};

const getInput = readFile(DAY, "input").then(parseInput);
const getTestInput = readFile(DAY, "testInput").then(parseInput);

class Machine {
  buckets: Record<string, string[]>;

  constructor(buckets: Record<string, string[]>) {
    this.buckets = {};
    for (const [k, v] of Object.entries(buckets)) {
      this.buckets[k] = [...v];
    }
  }

  move(from: string, to: string, count: number) {
    for (let i = 0; i < count; i++) {
      const c = this.buckets[from].pop();
      if (c) {
        this.buckets[to].push(c);
      }
    }
  }

  moveStack(from: string, to: string, count: number) {
    let stack: string[] = [];
    for (let i = 0; i < count; i++) {
      const c = this.buckets[from].pop();
      if (c) {
        stack.unshift(c);
      }
    }
    for (const c of stack) {
      this.buckets[to].push(c);
    }
  }

  tops() {
    return Object.values(this.buckets)
      .map((v) => v[v.length - 1])
      .join("");
  }
}

const processPartOne = (input: Input): string => {
  const m = new Machine(input.buckets);
  for (const { from, to, count } of input.instructions) {
    m.move(from, to, count);
  }
  return m.tops();
};

const processPartTwo = (input: Input): string => {
  const m = new Machine(input.buckets);
  for (const { from, to, count } of input.instructions) {
    m.moveStack(from, to, count);
  }
  return m.tops();
};

const solution: Solution = async () => {
  const input = await getInput;
  return processPartOne(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  await expect(() => processPartOne(testInput), "CMZ");
  await expect(() => processPartTwo(testInput), "MCD");
};

solution.partTwo = async () => {
  const input = await getInput;
  return processPartTwo(input);
};

solution.inputs = [getInput];

export default solution;
