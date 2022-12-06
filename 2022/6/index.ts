// PLAN
// identify the first start of packet market
//   - create a queue of size 4 containing the first 3 characters
//   - start iterating at the 4th character
//   - iterate through each character and add it to the queue untill all characters are unique
//   - return i
const fs = require("fs");
const path = require("path");
const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");

console.log(input);
// <<<<PART_2>>>>> add lenUnique parameter to indicate number of unique characters before the start of packet is fulfilled
const pipeline = (input: string, lenUnique: number = 4): number => {
  // create a queue of size 4
  const queue: string[] = [];
  for (let i = 0; i < input.length; i++) {
    // transform queue to set
    // get length of set
    if (queue.length === lenUnique) {
      queue.shift();
    }
    queue.push(input[i]);
    console.log(queue);

    const set = new Set(queue);
    if (set.size === lenUnique) return i + 1;
  }
  return -1;
};
console.log(pipeline(input, 14));
