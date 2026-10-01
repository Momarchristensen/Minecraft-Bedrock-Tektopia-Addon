var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// src/array_extensions.ts
var require_array_extensions = __commonJS({
  "src/array_extensions.ts"() {
    var setCache = /* @__PURE__ */ new WeakMap();
    Array.prototype.includesFast = function(value) {
      let set = setCache.get(this);
      if (set === void 0) {
        set = new Set(this);
        setCache.set(this, set);
      }
      return set.has(value);
    };
    Array.prototype.remove = function(value) {
      const index = this.indexOf(value);
      if (index !== -1) {
        this.splice(index, 1);
      }
      return this;
    };
  }
});
export default require_array_extensions();
//# sourceMappingURL=array_extensions.js.map
