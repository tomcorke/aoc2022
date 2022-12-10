import { readFileSeparated, toNumber, expect } from "../helpers";
import { Solution } from "..";
import chalk from "chalk";

const DAY = "09";

type Input = [string, number][];
const parseInput = (values: string[]): Input =>
  values
    .filter((v) => v !== "")
    .map((v) => {
      const [d, a] = v.split(" ");
      return [d, Number(a)];
    });

const getInput = readFileSeparated("\n", DAY, "input").then(parseInput);
const getTestInput = readFileSeparated("\n", DAY, "testInput").then(parseInput);
const getTestInput2 = readFileSeparated("\n", DAY, "testInput2").then(
  parseInput
);

let IS_TEST = false;
const DEBUG = false;

class Snake {
  length: number;

  x: number[] = [];
  y: number[] = [];

  maxX: number = 0;
  maxY: number = 0;
  minX: number = 0;
  minY: number = 0;

  tailVisited: Set<number> = new Set<number>();

  constructor(tailLength: number) {
    this.length = tailLength + 1;
    for (let i = 0; i < tailLength + 1; i++) {
      this.x[i] = 0;
      this.y[i] = 0;
    }
    this.visitTail();
  }

  hash(x: number, y: number) {
    return x * 10000 + y;
  }

  visitTail() {
    const x = this.x[this.length - 1];
    const y = this.y[this.length - 1];
    this.maxX = Math.max(this.maxX, x);
    this.minX = Math.min(this.minX, x);
    this.maxY = Math.max(this.maxY, y);
    this.minY = Math.min(this.minY, y);
    const hash = this.hash(x, y);
    this.tailVisited.add(hash);
  }

  move(direction: string, amount: number) {
    let newX = this.x[0];
    let newY = this.y[0];
    let vector: [number, number];
    switch (direction) {
      case "R":
        vector = [1, 0];
        break;
      case "L":
        vector = [-1, 0];
        break;
      case "U":
        vector = [0, -1];
        break;
      case "D":
        vector = [0, 1];
        break;
      default:
        throw Error("Unknown move");
    }

    for (let i = 0; i < amount; i++) {
      // Move head
      newX += vector[0];
      newY += vector[1];

      this.x[0] = newX;
      this.y[0] = newY;

      for (let i = 1; i < this.length; i++) {
        const dX = this.x[i - 1] - this.x[i];
        const dY = this.y[i - 1] - this.y[i];
        const aDX = Math.abs(dX);
        const aDY = Math.abs(dY);
        if (aDX > 1 || aDY > 1) {
          if (dX === 0) {
            this.y[i] += dY / 2;
          } else if (dY === 0) {
            this.x[i] += dX / 2;
          } else {
            if (aDX > 1 && aDY > 1) {
              this.x[i] += dX / 2;
              this.y[i] += dY / 2;
            } else if (aDX > 1) {
              this.x[i] += dX / 2;
              this.y[i] += dY;
            } else {
              this.x[i] += dX;
              this.y[i] += dY / 2;
            }
          }
        } else {
          break;
        }
      }

      this.visitTail();

      if (IS_TEST && DEBUG) {
        this.draw();
      }
    }
  }

  draw() {
    console.log("");
    const minX = Math.min(0, this.minX, ...this.x);
    const maxX = Math.max(0, this.maxX, ...this.x);
    const minY = Math.min(0, this.minY, ...this.y);
    const maxY = Math.max(0, this.maxY, ...this.y);

    for (let y = minY; y <= maxY; y++) {
      let line: string[] = [];
      for (let x = minX; x <= maxX; x++) {
        let char = ".";
        if (this.tailVisited.has(this.hash(x, y))) {
          char = "#";
        }
        if (x === 0 && y === 0) {
          char = chalk.greenBright("s");
        }
        for (let i = 0; i < this.length; i++) {
          if (this.x[i] === x && this.y[i] === y) {
            char = chalk.yellowBright(i.toString());
            if (i === 0) {
              char = chalk.redBright("H");
            }
            break;
          }
        }
        line.push(char);
      }
      console.log(line.join(""));
    }
  }
}

const processPartOne = (input: Input): number => {
  const s = new Snake(1);
  for (const move of input) {
    s.move(move[0], move[1]);
  }
  return s.tailVisited.size;
};

const processPartTwo = (input: Input): number => {
  const s = new Snake(9);
  for (const move of input) {
    s.move(move[0], move[1]);
  }
  // s.draw();
  return s.tailVisited.size;
};

const solution: Solution = async () => {
  const input = await getInput;
  return processPartOne(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  const testInput2 = await getTestInput2;
  IS_TEST = true;
  await expect(() => processPartOne(testInput), 13);
  await expect(() => processPartTwo(testInput), 1);
  await expect(() => processPartTwo(testInput2), 36);
  IS_TEST = false;
};

solution.partTwo = async () => {
  const input = await getInput;
  return processPartTwo(input);
};

solution.inputs = [getInput];

export default solution;
