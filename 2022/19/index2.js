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
// console.log(bpsMaxes);

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
  wallet: { ore: 0, clay: 0, obsidian: 0, geodes: 0 },
};
// console.log("makePurchase", makePurchase(bps[0], inventory, "ore"))

const isMax = (inventory, bpMax) => {
  for (let resource in inventory.wallet) {
    if (inventory.wallet[resource] > bpMax[resource]) {
      return true;
    }
  }
  return false;
}

const purchaseSpree = (bp, buyable, bpMax, inventory) => {
  let newInventories = [];
  for (let robotType of buyable) {
    const purchasedInventory = makePurchase(bp, inventory, robotType);
    const purchasedBuyable = canBuy(bp, purchasedInventory.wallet);
    newInventories.push(purchasedInventory);

    if (isMax(purchasedInventory, bpMax) && purchasedBuyable.length > 0) {
      const newerInventories = purchaseSpree(bp, purchasedBuyable, bpMax, purchasedInventory)
      newInventories = newInventories.concat(newerInventories);
    }
        
  }
  const filteredInventories = newInventories.filter((inventory) => !isMax(inventory, bpMax));

  return filteredInventories;
}


const tic = (bp, inventories, bpMax) => {
  let newInventories = [...inventories];
  for (let i = 0; i < inventories.length; i++) {
    const inventory = inventories[i];
    const addToWallet = { ...inventory.robots };
    const buyable = canBuy(bp, inventory.wallet);
    const ps = purchaseSpree(bp, buyable, bpMax, inventory);

    for (let resource in addToWallet) {
      inventory.wallet[resource] += addToWallet[resource];
    }
    for (let j = 0; j < ps.length; j++) {
      const currentPs = ps[j];
      for (let resource in addToWallet) {
        currentPs.wallet[resource] += addToWallet[resource];
      }
    }
    newInventories = newInventories.concat(ps);
  }
  return newInventories;
};

const timer = (bp, bpMax, inventory, time) => {
  let inventories = [inventory];
  for (let i = 0; i < time; i++) {
    inventories = tic(bp, inventories, bpMax);
    console.log(i, inventories.length)
  }
  return inventories;
};

const inventories = timer(bps[0], bpsMaxes[0], inventory, 20);
