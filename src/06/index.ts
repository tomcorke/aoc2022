import { readFileSeparated, toNumber, expect, readFile } from "../helpers";
import { Solution } from "..";

const DAY = "06";

type Input = string;
const parse = (value: string): Input => value.trim();

const getInput = readFile(DAY, "input").then(parse);

const getIndex = (input: string[], size: number) => {
  const buffer: string[] = [];
  for (let i = 0; i < input.length; i++) {
    buffer.push(input[i]);
    if (buffer.length > size) {
      buffer.shift();
    }
    if (new Set(buffer).size === size) {
      return i + 1;
    }
  }
  return NaN;
};

const processPartOne = (input: Input): number => {
  return getIndex(input.split(""), 4);
};

const processPartTwo = (input: Input): number => {
  return getIndex(input.split(""), 14);
};

const solution: Solution = async () => {
  const input = await getInput;
  return processPartOne(input);
};

solution.tests = async () => {
  await expect(() => processPartOne("mjqjpqmgbljsphdztnvjfqwrcgsmlb"), 7);
  await expect(() => processPartOne("bvwbjplbgvbhsrlpgdmjqwftvncz"), 5);
  await expect(() => processPartOne("nppdvjthqldpwncqszvftbrmjlhg"), 6);
  await expect(() => processPartOne("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"), 10);
  await expect(() => processPartOne("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"), 11);
  await expect(() => processPartTwo("mjqjpqmgbljsphdztnvjfqwrcgsmlb"), 19);
  await expect(() => processPartTwo("bvwbjplbgvbhsrlpgdmjqwftvncz"), 23);
  await expect(() => processPartTwo("nppdvjthqldpwncqszvftbrmjlhg"), 23);
  await expect(() => processPartTwo("nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg"), 29);
  await expect(() => processPartTwo("zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw"), 26);
};

solution.partTwo = async () => {
  const input = await getInput;
  return processPartTwo(input);
};

solution.inputs = [getInput];

export default solution;
