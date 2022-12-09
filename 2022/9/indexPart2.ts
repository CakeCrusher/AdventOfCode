const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const lines = input.split("\n");

// iterate through each line

const headMovement = (dir: string, headPos: number[]): number[] => {
  switch (dir) {
    case "U":
      headPos[1]++;
      break;
    case "D":
      headPos[1]--;
      break;
    case "L":
      headPos[0]--;
      break;
    case "R":
      headPos[0]++;
      break;
  }
  return headPos;
};
const tailMovement = (
  headPos: number[],
  tailPos: number[],
  visited: Set<string>,
  markVisited: boolean = false
): {
  headPos: number[];
  tailPos: number[];
  visited: Set<string>;
} => {
  const tailToHead = [headPos[0] - tailPos[0], headPos[1] - tailPos[1]];

  // check if it is diagonal
  if (tailToHead[0] !== 0 && tailToHead[1] !== 0) {
    // check if it needs to move
    if (Math.abs(tailToHead[0]) != 1 || Math.abs(tailToHead[1]) != 1) {
      tailPos[0] += Math.sign(tailToHead[0]);
      tailPos[1] += Math.sign(tailToHead[1]);
    }
  }
  // check if it is horizontal
  else if (tailToHead[0] !== 0) {
    // check if it needs to move
    if (Math.abs(tailToHead[0]) != 1) {
      tailPos[0] += Math.sign(tailToHead[0]);
    }
  }
  // check if it is vertical
  else if (tailToHead[1] !== 0) {
    // check if it needs to move
    if (Math.abs(tailToHead[1]) != 1) {
      tailPos[1] += Math.sign(tailToHead[1]);
    }
  }

  if (markVisited) visited.add(tailPos.join(","));

  return { headPos, tailPos, visited };
};

const pipeline1 = (lines) => {
  console.log("start!!");
  const knots: number[][] = new Array(10).fill([0, 0]);
  let visited = new Set();
  visited.add(knots[0].join(","));

  for (let i = 0; i < lines.length; i++) {
    let [dir, steps] = lines[i].split(" ");
    steps = parseInt(steps);
    // can be optimized to not iterate throgh each step
    for (let j = 0; j < steps; j++) {
      const newHead = headMovement(dir, [...knots[0]]);
      knots[0] = newHead;
      // iterate through each knot
      for (let k = 0; k < knots.length - 1; k++) {
        const markVisited = k + 1 == knots.length - 1;
        const res = tailMovement(
          [...knots[k]],
          [...knots[k + 1]],
          visited,
          markVisited
        );
        // console.log(k, res)
        knots[k] = res.headPos;
        knots[k + 1] = res.tailPos;
        visited = res.visited;
      }
    }
    // if (i == 0) break;
  }
  console.log(visited.size);
};

pipeline1(lines);
