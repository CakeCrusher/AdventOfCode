const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const lines = input.split("\n");



const parseLin = (line: string) => {
  line = line.replace("\n", "")
  const data = line.split(" ")
  data
  const command = data[0]
  const value = parseInt(data[1])
  return {command, value}
}

const pipeline = (lines: string[]) => {
  let X = 1;
  let cycle = 0

  let strength = []

  let lineIdx = 0
  let skipCycle = 0
  let valueToAdd = 0

  while (lineIdx < lines.length) {
    const line = lines[lineIdx]
    const {command, value} = parseLin(line)

    cycle++
    if (skipCycle > 0) {
      skipCycle--
    } else {
      X += valueToAdd
      valueToAdd = 0
      lineIdx++
      if (command === "noop") {
      }
      else if (command === "addx") {
        valueToAdd = value
        skipCycle = 1
      } 
    }

    if (cycle >= 20 && ((cycle-20) % 40) === 0) {
      strength.push(X * cycle)
    }


  }
  // add up the strength
  console.log(strength)
  console.log(strength.reduce((a, b) => a + b, 0))

  // for (let i = 0; i < lines.length; i++) {
  //   const line = lines[i]
  //   const {command, value} = parseLin(line)
  //   let cycleToBe;
  //   if (command === "noop") {
  //     cycleToBe = cycle + 1
  //   }
  //   else if (command === "addx") {
  //     cycleToBe = cycle + 2
  //   }

  //   if (cycle >= 20) {
  //     console.log(cycle, X, command, value)
  //   }


  //   // add strength
  //   if (cycleToBe >= 20) {
  //     if (command === "noop" && ((cycle-20) % 40) === 0) {
  //       strength.push(X * cycle)
  //       console.log(cycle, X)
  //     }
  //     if (command === "addx") {
  //       if (((cycle-20) % 40) === 0) {
  //         console.log(cycle, X)
  //         strength.push(X * cycle)
  //       }
  //       else if ((((cycle+1)-20) % 40) === 0) {
  //         console.log(cycle+1, X)
  //         strength.push(X * (cycle+1))
  //       }
  //     }
  //   }

  //   cycle = cycleToBe
  //   if (command === "addx") {
  //     X += value
  //   }
  // }
  // console.log(strength);
};

pipeline(lines);