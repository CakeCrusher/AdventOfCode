const fs = require("fs");
const path = require("path");

const input = fs.readFileSync(path.join(__dirname, "inputTest.txt"), "utf8");
const lines = input.split("\n");

// purchase happens before new resources are added

// robot based market
const parseStep = (step) => {
  // Each geode robot costs 2 ore and 7 obsidian
  const robotType = step.split(" ")[1];
  const costsStr = step.split("costs ")[1].split(" and ");
  const costs = costsStr.map((cost) => cost.split(" "));
  const costObj = costs.reduce((acc, cost) => {
    acc[cost[1]] = parseInt(cost[0]);
    return acc;
  }, {});
  return [robotType, costObj];
};

const parseLines = (lines) => {
  const bps = [];
  for (let i = 0; i < lines.length; i++) {
    // Blueprint 1: Each ore robot costs 4 ore. Each clay robot costs 2 ore. Each obsidian robot costs 3 ore and 14 clay. Each geode robot costs 2 ore and 7 obsidian.
    // exclude the final period
    let steps = lines[i].slice(0, -1).split(": ")[1].split(". ");
    let bp = {};
    for (let j = 0; j < steps.length; j++) {
      const [robotType, costObj] = parseStep(steps[j]);
      bp[robotType] = costObj;
    }
    bps.push(bp);
  }
  return bps;
};

const bps = parseLines(lines);
// console.log(bps)

// get the max of each resource
const getMaxes = (bps) => {
  const maxes = [];
  for (let bp of bps) {
    const max = { ore: 0, clay: 0, obsidian: 0, geodes: 0 };
    for (let resourceType in bp) {
      const cost = bp[resourceType];
      for (let resource in cost) {
        if (cost[resource] > max[resource]) {
          max[resource] = cost[resource];
        }
      }
    }
    maxes.push(max);
  }
  return maxes;
};
const bpsMaxes = getMaxes(bps);
console.log(bpsMaxes);

const canBuy = (bp, wallet) => {
  const buyable = [];
  for (let robotType in bp) {
    const cost = bp[robotType];
    let canBuy = true;
    for (let resource in cost) {
      if (wallet[resource] < cost[resource]) {
        canBuy = false;
        break;
      }
    }
    if (canBuy) {
      buyable.push(robotType);
    }
  }
  return buyable;
};
// console.log(canBuy(bps[0], { ore: 4, clay: 0, obsidian: 0, geodes: 0 }))

const makePurchase = (bp, inventory, robotType) => {
  const cost = bp[robotType];
  const newInventoryWallet = { ...inventory.wallet };
  for (let resource in cost) {
    newInventoryWallet[resource] -= cost[resource];
  }
  const newInventoryRobots = { ...inventory.robots };
  newInventoryRobots[robotType] += 1;
  const newInventory = {
    wallet: newInventoryWallet,
    robots: newInventoryRobots,
  };
  return newInventory;
};
const inventory = {
  robots: { ore: 1, clay: 0, obsidian: 0, geodes: 0 },
  wallet: { ore: 5, clay: 1, obsidian: 0, geodes: 0 },
};
// console.log("makePurchase", makePurchase(bps[0], inventory, "ore"))

const canBuyPermutations = (bp, inventory, bpMax) => {
  let permutations = [];
  const buyable = canBuy(bp, inventory.wallet);
  // console.log(inventory.wallet.ore)
  // console.log(buyable)
  for (let robotType of buyable) {
    const newInventory = makePurchase(bp, inventory, robotType);
    permutations.push(newInventory);
    // console.log(newInventory)
    const newPermutations = canBuyPermutations(bp, newInventory, bpMax);
    // console.log(newPermutations)
    // combine permutations with newPermutations
    permutations = permutations.concat(newPermutations);
    // console.log(permutations)
  }
  return permutations;
};
// get all permutations of buy actions
const timeIterator = (bp, time, bpMax) => {
  let inventories = [
    {
      robots: { ore: 1, clay: 0, obsidian: 0, geodes: 0 },
      wallet: { ore: 0, clay: 0, obsidian: 0, geodes: 0 },
    },
  ];
  for (let i = 0; i < time; i++) {
    console.log("TIME", i);
    for (let inventory of inventories) {
      const materialsToAdd = { ...inventory.robots };
      // console.log("CURRENT INVENTORY", inventory)
      const allPermutations = canBuyPermutations(bp, inventory, bpMax);
      // console.log("allPermutations", allPermutations)
      // console.log(i, inventories.length, inventories.map((inv) => inv.wallet.ore))
      inventories = inventories.concat(allPermutations);
      console.log("INVENTORIES\n", inventories)
      const currentInventories = allPermutations.concat(inventory);
      for (let inventory of currentInventories) {
        for (let resource in materialsToAdd) {
          // console.log(materialsToAdd)
          inventory.wallet[resource] += materialsToAdd[resource];
        }
      }
    }
  }
  // inventories[0].wallet.clay += 10
  return inventories;
};
const ti = timeIterator(bps[0], 5);
// console.log(bps[0])

// const result = (): number => {
//   return bpId * maxGeodes
// }
