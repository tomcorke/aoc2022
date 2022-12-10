import { readFileSeparated, toNumber, expect } from "../helpers";
import { Solution } from "..";
import { min, sum } from "lodash";

const DAY = "07";

type Input = string[];
const parseInput = (values: string[]): Input =>
  values.filter((v) => v !== "").map((v) => v);

const getInput = readFileSeparated("\n", DAY, "input").then(parseInput);
const getTestInput = readFileSeparated("\n", DAY, "testInput").then(parseInput);

type Dir = {
  type: "dir";
  files: FileTree;
  parent: Dir | undefined;
  size: number;
};
type File = {
  type: "file";
  size: number;
};
type FileTree = Record<string, Dir | File>;

class Terminal {
  root: Dir;
  cwd: Dir;

  constructor() {
    this.root = { type: "dir", files: {}, parent: undefined, size: 0 };
    this.cwd = this.root;
  }

  parse(line: string) {
    if (line.startsWith("$")) {
      return this.parseCommand(line);
    }
    return this.parseResult(line);
  }

  parseCommand(line: string) {
    const cmd = line.substring(2);
    if (cmd.startsWith("cd")) {
      const path = cmd.substring(3);
      if (path === "/") {
        this.goToRoot();
      } else {
        this.goToDir(path);
      }
    } else if (cmd === "ls") {
    }
  }

  goToRoot() {
    this.cwd = this.root;
  }

  goToDir(path: string) {
    let p = path.split("/");
    while (p.length > 0) {
      const d = p.shift();
      if (d) {
        if (d === ".." && this.cwd.parent) {
          this.cwd = this.cwd.parent;
        } else {
          const dest = this.cwd.files[d];
          if (dest && dest.type === "dir") {
            this.cwd = dest;
          }
        }
      }
    }
  }

  parseResult(line: string) {
    if (line.startsWith("dir")) {
      return this.mkdir(line.substring(4));
    }
    const [sizeString, name] = line.split(" ");
    return this.mkfile(Number(sizeString), name);
  }

  mkdir(name: string) {
    this.cwd.files[name] = {
      type: "dir",
      files: {},
      parent: this.cwd,
      size: 0,
    };
  }

  mkfile(size: number, name: string) {
    this.cwd.files[name] = { type: "file", size };
    this.cwd.size += size;
    let parent = this.cwd.parent;
    while (parent) {
      parent.size += size;
      parent = parent.parent;
    }
  }

  print() {
    console.log("- / (dir)");
    this.printTree(this.root);
  }

  private printTree(dir: Dir, level: number = 1) {
    Object.entries(dir.files).forEach((f) => {
      if (f[1].type === "dir") {
        console.log(`${"  ".repeat(level)}- ${f[0]} (dir)`);
        this.printTree(f[1], level + 1);
      } else {
        console.log(`${"  ".repeat(level)}- ${f[0]} (file, size=${f[1].size})`);
      }
    });
  }

  getSize(dir: Dir): number {
    // return Object.values(dir.files).reduce((sum, f) => {
    //   if (f.type === "file") {
    //     return sum + f.size;
    //   }
    //   return sum + this.getSize(f);
    // }, 0);
    return dir.size;
  }

  getRootSize() {
    return this.root.size;
  }

  getDirSizes() {
    let queue: { name: string; dir: Dir }[] = [{ name: "/", dir: this.root }];
    let results: { name: string; size: number }[] = [];
    while (queue.length > 0) {
      const d = queue.shift();
      if (d) {
        results.push({ name: d.name, size: d.dir.size });
        const subdirs = Object.entries(d.dir.files).filter(
          (f) => f[1].type === "dir"
        ) as [string, Dir][];
        queue.push(...subdirs.map((d) => ({ name: d[0], dir: d[1] })));
      }
    }
    return results;
  }
}

const processPartOne = (input: Input): number => {
  const terminal = new Terminal();
  for (const line of input) {
    terminal.parse(line);
  }
  const dirSizes = terminal.getDirSizes();
  return sum(dirSizes.filter((d) => d.size <= 100000).map((d) => d.size));
};

const processPartTwo = (input: Input): number => {
  const terminal = new Terminal();
  for (const line of input) {
    terminal.parse(line);
  }
  const dirSizes = terminal.getDirSizes();

  const MAX_SPACE = 70000000;
  const DESIRED_FREE_SPACE = 30000000;
  const CURRENT_FREE_SPACE = MAX_SPACE - terminal.getRootSize();
  const NEEDED_FREE_SPACE = DESIRED_FREE_SPACE - CURRENT_FREE_SPACE;

  const suitableDirs = dirSizes.filter((d) => d.size >= NEEDED_FREE_SPACE);
  const minDirSize = min(suitableDirs.map((d) => d.size));
  if (minDirSize) {
    return minDirSize;
  }
  return 0;
};

const solution: Solution = async () => {
  const input = await getInput;
  return processPartOne(input);
};

solution.tests = async () => {
  const testInput = await getTestInput;
  await expect(() => processPartOne(testInput), 95437);
  await expect(() => processPartTwo(testInput), 24933642);
};

solution.partTwo = async () => {
  const input = await getInput;
  return processPartTwo(input);
};

solution.inputs = [getInput];

export default solution;
