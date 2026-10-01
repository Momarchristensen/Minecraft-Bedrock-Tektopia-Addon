var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// src/utils.ts
import {
  StructureRotation
} from "@minecraft/server";
function fix(number, decimalPlaces = 0) {
  return Number(number.toFixed(decimalPlaces));
}
function calculateAverage(numbers) {
  if (numbers.length === 0) {
    return 0;
  }
  const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const average = sum / numbers.length;
  return average;
}
var init_utils = __esm({
  "src/utils.ts"() {
    "use strict";
  }
});

// src/performance.ts
import {
  system,
  world
} from "@minecraft/server";
var require_performance = __commonJS({
  "src/performance.ts"() {
    init_utils();
    var averageTickRateList = [];
    var lastTickTime = Date.now();
    system.runInterval(() => {
      if (!world.loadedData) {
        return;
      }
      const tickSpeed = Math.floor(1e3 / (Date.now() - lastTickTime));
      lastTickTime = Date.now();
      averageTickRateList.push(tickSpeed);
      if (averageTickRateList.length > 20) {
        averageTickRateList.shift();
      }
      const averageTickRate = calculateAverage(averageTickRateList);
      const players = world.getAllPlayers();
      for (const player of players) {
        player.onScreenDisplay.setActionBar(fix(averageTickRate).toString());
      }
    });
  }
});
export default require_performance();
//# sourceMappingURL=performance.js.map
