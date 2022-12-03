const fs = require("fs");
const path = require("path");

let input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
// input = `A Y
// B X
// C Z`;
const lines = input.split("\n");
const SHAPE_SCORE = {
  X: 1,
  Y: 2,
  Z: 3,
};
const OUTCOME_SCORE = {
  W: 6,
  T: 3,
  L: 0,
};
const ONE_KEY = {
  A: "X", // rock
  B: "Y", // paper
  C: "Z", // scissors
};

const outcome = (theirMove, myMove) => {
  theirMove = ONE_KEY[theirMove];
  if (theirMove === myMove) {
    return "T";
  } else if (
    (theirMove === "X" && myMove === "Y") ||
    (theirMove === "Y" && myMove === "Z") ||
    (theirMove === "Z" && myMove === "X")
  ) {
    return "W";
  } else {
    return "L";
  }
};

const score = lines.reduce((acc, line) => {
  if (!line || line.length < 3) return acc;
  const [theirMove, myMove] = line.split(" ");
  const currScore =
    SHAPE_SCORE[myMove] + OUTCOME_SCORE[outcome(theirMove, myMove)];
  return acc + currScore;
}, 0);
// ^^^^^^^^^ PART_ONE ^^^^^^^^^

const MY_MOVE_TO_OUTCOME = {
  X: "L",
  Y: "T",
  Z: "W",
};
const moveToOutcome = (theirMove, oc) => {
  theirMove = ONE_KEY[theirMove];
  if (oc === "W") {
    if (theirMove === "X") {
      return "Y";
    } else if (theirMove === "Y") {
      return "Z";
    } else {
      return "X";
    }
  } else if (oc === "T") {
    return theirMove;
  } else {
    if (theirMove === "X") {
      return "Z";
    } else if (theirMove === "Y") {
      return "X";
    } else {
      return "Y";
    }
  }
};

const scoreB = lines.reduce((acc, line) => {
  if (!line || line.length < 3) return acc;
  const [theirMove, ocInMove] = line.split(" ");

  const oc = MY_MOVE_TO_OUTCOME[ocInMove];
  const myMove = moveToOutcome(theirMove, oc);
  const currScore =
    SHAPE_SCORE[myMove] + OUTCOME_SCORE[outcome(theirMove, myMove)];
  return acc + currScore;
}, 0);

console.log(scoreB);
