const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const lines = input.split("\n");

// iterate through each line

const headPos = [0, 0];
const tailPos = [0, 0];
const visited = new Set();
// add a tuple to visited
const addVisited = (pos) => {
  visited.add(pos.join(","));
};
addVisited(headPos);

const headMovement = (dir) => {
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
};
const tailMovement = () => {
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
  addVisited(tailPos);
};

const pipeline1 = (lines) => {
  for (let i = 0; i < lines.length; i++) {
    let [dir, steps] = lines[i].split(" ");
    steps = parseInt(steps);
    // can be optimized to not iterate throgh each step
    for (let j = 0; j < steps; j++) {
      headMovement(dir);
      tailMovement();
    }
  }
};

// PART 2: each number is the head of the next number

const fullMovement;

console.log(visited.size);
