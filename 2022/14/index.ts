const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "input.txt"), "utf8");
const lines = input.split("\n");

// console.log(lines);


const parseLines = (lines): any => {
  const parsedLines: number[][][] = [];
  const xRange = [0, 0];
  const yRange = [0, 0];
  for (let line of lines) {
    const coordinates = line.split(" -> ").map((coord) => {
      const [x, y] = coord.split(",");
      const xNum = parseInt(x);
      const yNum = parseInt(y);
      if (xNum < xRange[0]) {
        xRange[0] = xNum;
      }
      if (xNum > xRange[1]) {
        xRange[1] = xNum;
      }
      if (yNum < yRange[0]) {
        yRange[0] = yNum;
      }
      if (yNum > yRange[1]) {
        yRange[1] = yNum;
      }
      return [xNum, yNum]
    });
    // console.log(coordinates)
    parsedLines.push(coordinates);
  }
  // console.log(parsedLines)
  
  // add 2 for Part 2
  yRange[1] += 2;
  // xRange sides will need a max padding of yRange[1]
  xRange[1] += yRange[1]*2;
  
  return [parsedLines, xRange, yRange];
}

let [parsed, xRange, yRange] = parseLines(lines);

// part 2
const updatedParsed = (parsed: number[][][], yRange: number[]) => {
  const updated = parsed.map((path) => {
    const updatedPath = path.map((coord) => {
      const [x, y] = coord;
      return [x + yRange[1], y];
    });
    return updatedPath;
  });
  return updated;
}

parsed = updatedParsed(parsed, yRange);

// console.log(parsed);
// console.log(xRange, yRange);

const createGrid = (xRange, yRange): string[][] => {
  const grid: string[][] = [];
  for (let i = 0; i < yRange[1] - yRange[0] + 1; i++) {
    grid.push([]);
    for (let j = 0; j < xRange[1] - xRange[0] + 1; j++) {

      // for Part 2
      if (i === yRange[1]) {
        grid[i].push("#");
      } else {
        grid[i].push(".");
      }
    }
  }

  return grid;
}

const showGrid = (grid: string[][]): void => {
  console.log(grid.map((row) => row.slice(470,600).join(""));
}


const grid = createGrid(xRange, yRange);

// showGrid(grid);


const createPath = (points: number[][], grid: string[][]): string[][] => {
  for (let i = 0; i < points.length - 1; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[i+1];
    const xMin = Math.min(x1, x2);
    const xMax = Math.max(x1, x2);
    const yMin = Math.min(y1, y2);
    const yMax = Math.max(y1, y2);
    for (let j = yMin; j <= yMax; j++) {
      for (let k = xMin; k <= xMax; k++) {
        grid[j][k] = "#";
      }
    }
  }

  return grid;
  
}

const createPaths = (paths: number[][][], grid: string[][]): string[][] => {
  for (let i = 0; i < paths.length; i++) {
    grid = createPath(paths[i], grid);
  }
  return grid;
}

const gridWithPaths = createPaths(parsed, grid);

// showGrid(gridWithPaths);

const dropSand = (grid: string[][], xRange: number[], yRange: number[], location: number[] = [500,0]): any => {
  let [x, y] = location;
  try {
  while (grid[y+1][x] === "." || grid[y+1][x-1] === "." || grid[y+1][x+1] === ".") {
    if (grid[y+1][x] === ".") {
      y++;
    } else if (grid[y+1][x-1] === ".") { 
      x--;
      y++;
    } else if (grid[y+1][x+1] === ".") {
      x++;
      y++;
    } 
    if (y < yRange[0] || y > yRange[1] || x < xRange[0] || x > xRange[1]) {
      return true;
    }
  }
  } catch (e) {
    return true;
  }
  return [x,y];
}



const pourSand = (grid: string[][], yRange: number[]): number => {
  // part 2
  let location = [500+yRange[1],0];

  let grains = 0;
  while (true) {
    // console.log(grains)
    const res = dropSand(grid, xRange, yRange, location);
    if (res === true) {
      break;
    }
    grains++;

    // part 2
    if (res[1] === location[1] && res[0] === location[0]) {
      return grains;
    }

    grid[res[1]][res[0]] = "O";

    // showGrid(grid);
  }
  return grains
}


const sandPoured = pourSand(gridWithPaths, yRange);
console.log(sandPoured)



    





