// PLAN
// parse the stacks
// identify that it is a stack by
// verifying that the the index 2 of the line is not a number
// iterate through the string by steps of 4
// add the character to the corresponding ship stack
// parse the command
// partition the command into the 3 parts
// execute the command

// get file input.txt contents
const fs = require("fs");
const path = require("path");
const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const lines = input.split("\n");

const buildShip = (lines) => {
  const ship = {};
  let lineIdx = 0;
  while (lines[lineIdx].slice(0, 2) !== " 1") {
    for (let i = 0; i < lines[lineIdx].length; i += 4) {
      if (lines[lineIdx][i + 1] !== " ") {
        if (!ship[Math.floor(i / 4)]) {
          ship[Math.floor(i / 4)] = [];
        }
        ship[Math.floor(i / 4)].push(lines[lineIdx][i + 1]);
      }
    }
    lineIdx++;
  }
  return ship;
};
const executeCommandPart1 = (command, ship) => {
  const splitCommand = command.split(" ");
  const amt = parseInt(splitCommand[1]);
  const from = parseInt(splitCommand[3]) - 1;
  const to = parseInt(splitCommand[5]) - 1;
  for (let i = 0; i < amt; i++) {
    // console.log(command, ship, 1);
    ship[to].unshift(ship[from].shift());
  }
};

const tops = (ship) => {
  let topsStr = "";
  for (let i = 0; i < Object.keys(ship).length; i++) {
    topsStr += ship[i][0];
  }
  return topsStr;
};

const pipeline = (lines) => {
  let ship = buildShip(lines);
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].slice(0, 4) === "move") {
      // console.log(lines[i]);
      // executeCommandPart1(lines[i], ship);
      executeCommandPart2(lines[i], ship);
    }
  }
  const topsStr = tops(ship);
  return topsStr;
};

// ^^^^^PART_ONE^^^^^

const executeCommandPart2 = (command, ship) => {
  const splitCommand = command.split(" ");
  const amt = parseInt(splitCommand[1]);
  const from = parseInt(splitCommand[3]) - 1;
  const to = parseInt(splitCommand[5]) - 1;
  const fromSlice = ship[from].slice(0, amt);
  ship[from] = ship[from].slice(amt);
  ship[to] = fromSlice.concat(ship[to]);
};

console.log(pipeline(lines));
