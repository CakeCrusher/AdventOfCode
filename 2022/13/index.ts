const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const lines = input.split("\n");

console.log(lines);
// returs a 2d string array
const createBatches = (lines: string[]): object[][] => {
  let batches: object[][] = [];
  for (let i = 0; i < lines.length; i += 3) {
    const batch: object[] = [];
    batch.push(JSON.parse(lines[i]));
    batch.push(JSON.parse(lines[i + 1]));

    batches.push(batch);
  }
  return batches;
};

const batches = createBatches(lines);
const allPackets = batches
  .reduce((a, b) => a.concat(b), [])
  .concat([[[2]], [[6]]]);

const compare = (left: object[], right: object[]) => {
  // parse the string into json
  const minLength = Math.min(left.length, right.length);
  let minSide: null | string = null;
  if (left.length < right.length) {
    minSide = "left";
  } else if (right.length < left.length) {
    minSide = "right";
  }

  for (let i = 0; i < minLength; i++) {
    if (typeof left[i] === "object" || typeof right[i] === "object") {
      const newLeft = typeof left[i] === "object" ? left[i] : [left[i]];
      const newRight = typeof right[i] === "object" ? right[i] : [right[i]];
      console.log(newLeft, newRight);
      const comp = compare(newLeft, newRight);
      if (comp || comp === false) {
        return comp;
      }
    } else {
      if (left[i] !== right[i]) {
        if (left[i] < right[i]) {
          console.log(true);
          return true;
        } else {
          console.log(false);
          return false;
        }
      }
    }
  }

  console.log(minSide);

  if (minSide === "left") {
    console.log("left");
    return true;
  } else if (minSide === "right") {
    console.log("right");
    return false;
  }
  return null;
};

const compare_all = (batches: object[]): number => {
  const results: number[] = [];
  for (let i = 0; i < batches.length; i++) {
    const left = batches[i][0];
    const right = batches[i][1];
    const comp = compare(left, right);
    if (comp) {
      results.push(i + 1);
    }
    console.log(comp);
  }

  return results.reduce((a, b) => a + b, 0);
};

const part1Res = compare_all(batches);

// create a sorting function based on the compare function
const sort = (left: object[], right: object[]) => {
  const comp = compare(left, right);
  if (comp === true) {
    return -1;
  } else if (comp === false) {
    return 1;
  }
  return 0;
};

// sort all the packets
const sortedPackets = allPackets.sort(sort);

const getProductOfKeys = (obj: object[]): number => {
  const keyIndexes: number[] = [];
  for (let i = 0; i < obj.length; i++) {
    if (
      JSON.stringify(obj[i]) === "[[2]]" ||
      JSON.stringify(obj[i]) === "[[6]]"
    ) {
      keyIndexes.push(i + 1);
    }
    if (keyIndexes.length === 2) {
      break;
    }
  }
  return keyIndexes.reduce((a, b) => a * b, 1);
};

// const res = compare_all(batches.slice(5,10));
// const res = compare_all([batches[5]]);

const part2Res = getProductOfKeys(sortedPackets);

console.log(part2Res);
