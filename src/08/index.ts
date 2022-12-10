import { readFileSeparated, toNumber, expect } from "../helpers";
import { Solution } from "..";
import chalk from "chalk";
import { max, sum } from "lodash";

const DAY = "08";

type Input = number[][];
const parseInput = (values: string[]): Input =>
  values.filter((v) => v !== "").map((v) => v.split("").map((n) => Number(n)));

const getInput = readFileSeparated("\n", DAY, "input").then(parseInput);
const getTestInput = readFileSeparated("\n", DAY, "testInput").then(parseInput);

const processPartOne = (input: Input): number => {
  const width = input[0].length;
  const height = input.length;

  const visibleInnerTrees = new Set<number>();

  const seen = (x: number, y: number) => {
    visibleInnerTrees.add(x * height + y);
  };

  const isSeen = (x: number, y: number) =>
    visibleInnerTrees.has(x * height + y);

  const test = (x: number, y: number, maxT: number) => {
    const t = input[y][x];
    if (t > maxT) {
      seen(x, y);
      return t;
    }
    return maxT;
  };

  // scan down then up
  for (let x = 0; x < width; x++) {
    let maxT = -1;
    for (let y = 0; y < height - 1; y++) {
      maxT = test(x, y, maxT);
      if (maxT === 9) {
        break;
      }
    }
    maxT = -1;
    for (let y = height - 1; y > 0; y--) {
      maxT = test(x, y, maxT);
      if (maxT === 9) {
        break;
      }
    }
  }
  // scan ltr & rtl
  for (let y = 0; y < height; y++) {
    let maxT = -1;
    for (let x = 0; x < width - 1; x++) {
      maxT = test(x, y, maxT);
      if (maxT === 9) {
        break;
      }
    }
    maxT = -1;
    for (let x = width - 1; x > 0; x--) {
      maxT = test(x, y, maxT);
      if (maxT === 9) {
        break;
      }
    }
  }

  // for (let y = 0; y < height; y++) {
  //   const line: string[] = [];
  //   for (let x = 0; x < width; x++) {
  //     const s = isSeen(x, y);
  //     line.push(s ? chalk.yellowBright(input[y][x]) : input[y][x].toString());
  //   }
  //   console.log(line.join(" "));
  // }

  const visible = visibleInnerTrees.size;

  return visible;
};

const processPartTwo = (input: Input): number => {
  const width = input[0].length;
  const height = input.length;

  const dists: number[] = [];
  let maxDist = -1;

  const seen = (x: number, y: number, dist: number) => {
    const hash = x * height + y;
    const newDist = (dists[hash] || 1) * dist;
    if (newDist > maxDist) {
      maxDist = newDist;
    }
    dists[hash] = newDist;
  };

  const sights: number[] = [];
  const resetSights = () => {
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((n) => (sights[n] = 0));
  };
  const incrementSights = (max: number) => {
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach((n) => {
      if (n <= max) {
        sights[n] = 1;
      } else {
        sights[n] = sights[n] + 1;
      }
    });
  };

  const test = (x: number, y: number) => {
    const t = input[y][x];
    seen(x, y, sights[t]);
    incrementSights(t);
  };

  // scan down then up
  for (let x = 0; x < width; x++) {
    resetSights();
    for (let y = 0; y < height - 1; y++) {
      test(x, y);
    }
    resetSights();
    for (let y = height - 1; y > 0; y--) {
      test(x, y);
    }
  }
  // scan ltr & rtl
  for (let y = 0; y < height; y++) {
    resetSights();
    for (let x = 0; x < width - 1; x++) {
      test(x, y);
    }
    resetSights();
    for (let x = width - 1; x > 0; x--) {
      test(x, y);
    }
  }

  return maxDist;
};

const solution: Solution = async () => {
  const input = await getInput;
  return processPartOne(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  await expect(() => processPartOne(testInput), 21);
  await expect(() => processPartTwo(testInput), 8);
};

solution.partTwo = async () => {
  const input = await getInput;
  return processPartTwo(input);
};

solution.inputs = [getInput];

export default solution;
