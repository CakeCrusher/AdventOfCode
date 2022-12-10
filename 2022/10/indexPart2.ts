const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const lines = input.split("\n");

const parseLin = (line: string) => {
  line = line.replace("\n", "");
  const data = line.split(" ");
  const command = data[0];
  const value = parseInt(data[1]);
  return { command, value };
};

const pipeline = (lines: string[]) => {
  let X = 1;
  let cycle = 0;

  // create a string of length 240 of "."
  let map = new Array(240).fill(".");

  let strength = [];

  let lineIdx = 0;
  let skipCycle = 0;
  let valueToAdd = 0;

  while (lineIdx < lines.length) {
    const line = lines[lineIdx];
    const { command, value } = parseLin(line);
    if (skipCycle > 0) {
      skipCycle--;
    } else {
      X += valueToAdd;
      valueToAdd = 0;
      lineIdx++;
      if (command === "noop") {
      }
      if (command === "addx") {
        valueToAdd = value;
        skipCycle = 1;
      }
    }

    // console.log(cycle, X);
    // console.log(valueToAdd);
    if (cycle % 40 >= X - 1 && cycle % 40 <= X + 1) {
      map[cycle] = "#";
    }
    cycle++;
  }
  // split the string into lengths of 40
  map = map.join("").match(/.{1,40}/g);
  console.log(map);
};
console.log("##..##..##..##..##..##..##..##..##..##..".length);

pipeline(lines);
