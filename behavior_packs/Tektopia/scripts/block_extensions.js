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
    Block.prototype.northSafe = function() {
      try {
        return this.north();
      } catch {
        return void 0;
      }
    };
    Block.prototype.eastSafe = function() {
      try {
        return this.east();
      } catch {
        return void 0;
      }
    };
    Block.prototype.southSafe = function() {
      try {
        return this.south();
      } catch {
        return void 0;
      }
    };
    Block.prototype.westSafe = function() {
      try {
        return this.west();
      } catch {
        return void 0;
      }
    };
    Block.prototype.aboveSafe = function() {
      try {
        return this.above();
      } catch {
        return void 0;
      }
    };
    Block.prototype.belowSafe = function() {
      try {
        return this.below();
      } catch {
        return void 0;
      }
    };
    Block.prototype.offsetSafe = function(offset) {
      try {
        return this.offset(offset);
      } catch {
        return void 0;
      }
    };
    Dimension.prototype.getBlockSafe = function(location) {
      try {
        return this.getBlock(location);
      } catch {
        return void 0;
      }
    };
  }
});
export default require_block_extensions();
//# sourceMappingURL=block_extensions.js.map
