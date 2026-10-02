var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// src/block_extensions.ts
import {
  Block,
  Dimension
} from "@minecraft/server";
var require_block_extensions = __commonJS({
  "src/block_extensions.ts"() {
    Block.prototype.northSafe = function(...args) {
      try {
        return this.north(...args);
      } catch {
        return void 0;
      }
    };
    Block.prototype.eastSafe = function(...args) {
      try {
        return this.east(...args);
      } catch {
        return void 0;
      }
    };
    Block.prototype.southSafe = function(...args) {
      try {
        return this.south(...args);
      } catch {
        return void 0;
      }
    };
    Block.prototype.westSafe = function(...args) {
      try {
        return this.west(...args);
      } catch {
        return void 0;
      }
    };
    Block.prototype.aboveSafe = function(...args) {
      try {
        return this.above(...args);
      } catch {
        return void 0;
      }
    };
    Block.prototype.belowSafe = function(...args) {
      try {
        return this.below(...args);
      } catch {
        return void 0;
      }
    };
    Block.prototype.offsetSafe = function(...args) {
      try {
        return this.offset(...args);
      } catch {
        return void 0;
      }
    };
    Dimension.prototype.getBlockSafe = function(...args) {
      try {
        return this.getBlock(...args);
      } catch {
        return void 0;
      }
    };
  }
});
export default require_block_extensions();
//# sourceMappingURL=block_extensions.js.map
