var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/lz-string/libs/lz-string.js
var require_lz_string = __commonJS({
  "node_modules/lz-string/libs/lz-string.js"(exports, module) {
    var LZString = (function() {
      var f = String.fromCharCode;
      var keyStrBase64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      var keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
      var baseReverseDic = {};
      function getBaseValue(alphabet, character) {
        if (!baseReverseDic[alphabet]) {
          baseReverseDic[alphabet] = {};
          for (var i = 0; i < alphabet.length; i++) {
            baseReverseDic[alphabet][alphabet.charAt(i)] = i;
          }
        }
        return baseReverseDic[alphabet][character];
      }
      var LZString2 = {
        compressToBase64: function(input) {
          if (input == null) return "";
          var res = LZString2._compress(input, 6, function(a) {
            return keyStrBase64.charAt(a);
          });
          switch (res.length % 4) {
            // To produce valid Base64
            default:
            // When could this happen ?
            case 0:
              return res;
            case 1:
              return res + "===";
            case 2:
              return res + "==";
            case 3:
              return res + "=";
          }
        },
        decompressFromBase64: function(input) {
          if (input == null) return "";
          if (input == "") return null;
          return LZString2._decompress(input.length, 32, function(index) {
            return getBaseValue(keyStrBase64, input.charAt(index));
          });
        },
        compressToUTF16: function(input) {
          if (input == null) return "";
          return LZString2._compress(input, 15, function(a) {
            return f(a + 32);
          }) + " ";
        },
        decompressFromUTF16: function(compressed) {
          if (compressed == null) return "";
          if (compressed == "") return null;
          return LZString2._decompress(compressed.length, 16384, function(index) {
            return compressed.charCodeAt(index) - 32;
          });
        },
        //compress into uint8array (UCS-2 big endian format)
        compressToUint8Array: function(uncompressed) {
          var compressed = LZString2.compress(uncompressed);
          var buf = new Uint8Array(compressed.length * 2);
          for (var i = 0, TotalLen = compressed.length; i < TotalLen; i++) {
            var current_value = compressed.charCodeAt(i);
            buf[i * 2] = current_value >>> 8;
            buf[i * 2 + 1] = current_value % 256;
          }
          return buf;
        },
        //decompress from uint8array (UCS-2 big endian format)
        decompressFromUint8Array: function(compressed) {
          if (compressed === null || compressed === void 0) {
            return LZString2.decompress(compressed);
          } else {
            var buf = new Array(compressed.length / 2);
            for (var i = 0, TotalLen = buf.length; i < TotalLen; i++) {
              buf[i] = compressed[i * 2] * 256 + compressed[i * 2 + 1];
            }
            var result = [];
            buf.forEach(function(c) {
              result.push(f(c));
            });
            return LZString2.decompress(result.join(""));
          }
        },
        //compress into a string that is already URI encoded
        compressToEncodedURIComponent: function(input) {
          if (input == null) return "";
          return LZString2._compress(input, 6, function(a) {
            return keyStrUriSafe.charAt(a);
          });
        },
        //decompress from an output of compressToEncodedURIComponent
        decompressFromEncodedURIComponent: function(input) {
          if (input == null) return "";
          if (input == "") return null;
          input = input.replace(/ /g, "+");
          return LZString2._decompress(input.length, 32, function(index) {
            return getBaseValue(keyStrUriSafe, input.charAt(index));
          });
        },
        compress: function(uncompressed) {
          return LZString2._compress(uncompressed, 16, function(a) {
            return f(a);
          });
        },
        _compress: function(uncompressed, bitsPerChar, getCharFromInt) {
          if (uncompressed == null) return "";
          var i, value, context_dictionary = {}, context_dictionaryToCreate = {}, context_c = "", context_wc = "", context_w = "", context_enlargeIn = 2, context_dictSize = 3, context_numBits = 2, context_data = [], context_data_val = 0, context_data_position = 0, ii;
          for (ii = 0; ii < uncompressed.length; ii += 1) {
            context_c = uncompressed.charAt(ii);
            if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
              context_dictionary[context_c] = context_dictSize++;
              context_dictionaryToCreate[context_c] = true;
            }
            context_wc = context_w + context_c;
            if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
              context_w = context_wc;
            } else {
              if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                if (context_w.charCodeAt(0) < 256) {
                  for (i = 0; i < context_numBits; i++) {
                    context_data_val = context_data_val << 1;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                  }
                  value = context_w.charCodeAt(0);
                  for (i = 0; i < 8; i++) {
                    context_data_val = context_data_val << 1 | value & 1;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                    value = value >> 1;
                  }
                } else {
                  value = 1;
                  for (i = 0; i < context_numBits; i++) {
                    context_data_val = context_data_val << 1 | value;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                    value = 0;
                  }
                  value = context_w.charCodeAt(0);
                  for (i = 0; i < 16; i++) {
                    context_data_val = context_data_val << 1 | value & 1;
                    if (context_data_position == bitsPerChar - 1) {
                      context_data_position = 0;
                      context_data.push(getCharFromInt(context_data_val));
                      context_data_val = 0;
                    } else {
                      context_data_position++;
                    }
                    value = value >> 1;
                  }
                }
                context_enlargeIn--;
                if (context_enlargeIn == 0) {
                  context_enlargeIn = Math.pow(2, context_numBits);
                  context_numBits++;
                }
                delete context_dictionaryToCreate[context_w];
              } else {
                value = context_dictionary[context_w];
                for (i = 0; i < context_numBits; i++) {
                  context_data_val = context_data_val << 1 | value & 1;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = value >> 1;
                }
              }
              context_enlargeIn--;
              if (context_enlargeIn == 0) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
              }
              context_dictionary[context_wc] = context_dictSize++;
              context_w = String(context_c);
            }
          }
          if (context_w !== "") {
            if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
              if (context_w.charCodeAt(0) < 256) {
                for (i = 0; i < context_numBits; i++) {
                  context_data_val = context_data_val << 1;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                }
                value = context_w.charCodeAt(0);
                for (i = 0; i < 8; i++) {
                  context_data_val = context_data_val << 1 | value & 1;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = value >> 1;
                }
              } else {
                value = 1;
                for (i = 0; i < context_numBits; i++) {
                  context_data_val = context_data_val << 1 | value;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = 0;
                }
                value = context_w.charCodeAt(0);
                for (i = 0; i < 16; i++) {
                  context_data_val = context_data_val << 1 | value & 1;
                  if (context_data_position == bitsPerChar - 1) {
                    context_data_position = 0;
                    context_data.push(getCharFromInt(context_data_val));
                    context_data_val = 0;
                  } else {
                    context_data_position++;
                  }
                  value = value >> 1;
                }
              }
              context_enlargeIn--;
              if (context_enlargeIn == 0) {
                context_enlargeIn = Math.pow(2, context_numBits);
                context_numBits++;
              }
              delete context_dictionaryToCreate[context_w];
            } else {
              value = context_dictionary[context_w];
              for (i = 0; i < context_numBits; i++) {
                context_data_val = context_data_val << 1 | value & 1;
                if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data.push(getCharFromInt(context_data_val));
                  context_data_val = 0;
                } else {
                  context_data_position++;
                }
                value = value >> 1;
              }
            }
            context_enlargeIn--;
            if (context_enlargeIn == 0) {
              context_enlargeIn = Math.pow(2, context_numBits);
              context_numBits++;
            }
          }
          value = 2;
          for (i = 0; i < context_numBits; i++) {
            context_data_val = context_data_val << 1 | value & 1;
            if (context_data_position == bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
          while (true) {
            context_data_val = context_data_val << 1;
            if (context_data_position == bitsPerChar - 1) {
              context_data.push(getCharFromInt(context_data_val));
              break;
            } else context_data_position++;
          }
          return context_data.join("");
        },
        decompress: function(compressed) {
          if (compressed == null) return "";
          if (compressed == "") return null;
          return LZString2._decompress(compressed.length, 32768, function(index) {
            return compressed.charCodeAt(index);
          });
        },
        _decompress: function(length, resetValue, getNextValue) {
          var dictionary = [], next, enlargeIn = 4, dictSize = 4, numBits = 3, entry = "", result = [], i, w, bits, resb, maxpower, power, c, data = { val: getNextValue(0), position: resetValue, index: 1 };
          for (i = 0; i < 3; i += 1) {
            dictionary[i] = i;
          }
          bits = 0;
          maxpower = Math.pow(2, 2);
          power = 1;
          while (power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }
          switch (next = bits) {
            case 0:
              bits = 0;
              maxpower = Math.pow(2, 8);
              power = 1;
              while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                  data.position = resetValue;
                  data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
              }
              c = f(bits);
              break;
            case 1:
              bits = 0;
              maxpower = Math.pow(2, 16);
              power = 1;
              while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position == 0) {
                  data.position = resetValue;
                  data.val = getNextValue(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
              }
              c = f(bits);
              break;
            case 2:
              return "";
          }
          dictionary[3] = c;
          w = c;
          result.push(c);
          while (true) {
            if (data.index > length) {
              return "";
            }
            bits = 0;
            maxpower = Math.pow(2, numBits);
            power = 1;
            while (power != maxpower) {
              resb = data.val & data.position;
              data.position >>= 1;
              if (data.position == 0) {
                data.position = resetValue;
                data.val = getNextValue(data.index++);
              }
              bits |= (resb > 0 ? 1 : 0) * power;
              power <<= 1;
            }
            switch (c = bits) {
              case 0:
                bits = 0;
                maxpower = Math.pow(2, 8);
                power = 1;
                while (power != maxpower) {
                  resb = data.val & data.position;
                  data.position >>= 1;
                  if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                  }
                  bits |= (resb > 0 ? 1 : 0) * power;
                  power <<= 1;
                }
                dictionary[dictSize++] = f(bits);
                c = dictSize - 1;
                enlargeIn--;
                break;
              case 1:
                bits = 0;
                maxpower = Math.pow(2, 16);
                power = 1;
                while (power != maxpower) {
                  resb = data.val & data.position;
                  data.position >>= 1;
                  if (data.position == 0) {
                    data.position = resetValue;
                    data.val = getNextValue(data.index++);
                  }
                  bits |= (resb > 0 ? 1 : 0) * power;
                  power <<= 1;
                }
                dictionary[dictSize++] = f(bits);
                c = dictSize - 1;
                enlargeIn--;
                break;
              case 2:
                return result.join("");
            }
            if (enlargeIn == 0) {
              enlargeIn = Math.pow(2, numBits);
              numBits++;
            }
            if (dictionary[c]) {
              entry = dictionary[c];
            } else {
              if (c === dictSize) {
                entry = w + w.charAt(0);
              } else {
                return null;
              }
            }
            result.push(entry);
            dictionary[dictSize++] = w + entry.charAt(0);
            enlargeIn--;
            w = entry;
            if (enlargeIn == 0) {
              enlargeIn = Math.pow(2, numBits);
              numBits++;
            }
          }
        }
      };
      return LZString2;
    })();
    if (typeof define === "function" && define.amd) {
      define(function() {
        return LZString;
      });
    } else if (typeof module !== "undefined" && module != null) {
      module.exports = LZString;
    } else if (typeof angular !== "undefined" && angular != null) {
      angular.module("LZString", []).factory("LZString", function() {
        return LZString;
      });
    }
  }
});

// src/generated.ts
var blockSounds;
var init_generated = __esm({
  "src/generated.ts"() {
    "use strict";
    blockSounds = {
      "acacia_button": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "acacia_door": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "acacia_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "acacia_fence": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "acacia_fence_gate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "acacia_hanging_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.hanging_sign",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.hanging_sign",
          "volume": 1
        }
      },
      "acacia_leaves": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "acacia_log": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "acacia_planks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "acacia_pressure_plate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "acacia_sapling": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "acacia_shelf": {
        "break": "block.shelf.break",
        "place": null
      },
      "acacia_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "acacia_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "acacia_standing_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "acacia_trapdoor": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "acacia_wall_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "acacia_wood": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "activator_rail": {
        "break": {
          "pitch": [
            1.1,
            1.2
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            1.2,
            1.25
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "allium": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "allow": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "amethyst_block": {
        "break": {
          "pitch": 0.8,
          "sound": "break.amethyst_block",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.amethyst_block",
          "volume": 1
        }
      },
      "amethyst_cluster": {
        "break": {
          "sound": "break.amethyst_cluster",
          "volume": 1
        },
        "place": {
          "sound": "place.amethyst_cluster",
          "volume": 1
        }
      },
      "ancient_debris": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.ancient_debris",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.ancient_debris",
          "volume": 1
        }
      },
      "andesite": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "andesite_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "andesite_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "andesite_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "andesite_wall": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "anvil": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.anvil_land",
          "volume": 0.5
        }
      },
      "azalea": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.azalea",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.azalea",
          "volume": 1
        }
      },
      "azalea_leaves": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.azalea_leaves",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.azalea_leaves",
          "volume": 1
        }
      },
      "azalea_leaves_flowered": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.azalea_leaves",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.azalea_leaves",
          "volume": 1
        }
      },
      "azure_bluet": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "bamboo": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.bamboo.break",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.bamboo.place",
          "volume": 1
        }
      },
      "bamboo_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.bamboo_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.bamboo_wood",
          "volume": 1
        }
      },
      "bamboo_button": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.bamboo_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.bamboo_wood",
          "volume": 1
        }
      },
      "bamboo_door": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.bamboo_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.bamboo_wood",
          "volume": 1
        }
      },
      "bamboo_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.bamboo_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.bamboo_wood",
          "volume": 1
        }
      },
      "bamboo_fence": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.bamboo_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.bamboo_wood",
          "volume": 1
        }
      },
      "bamboo_fence_gate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.bamboo_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.bamboo_wood",
          "volume": 1
        }
      },
      "bamboo_hanging_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.bamboo_wood_hanging_sign",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.bamboo_wood_hanging_sign",
          "volume": 1
        }
      },
      "bamboo_mosaic": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.bamboo_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.bamboo_wood",
          "volume": 1
        }
      },
      "bamboo_mosaic_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.bamboo_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.bamboo_wood",
          "volume": 1
        }
      },
      "bamboo_mosaic_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.bamboo_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.bamboo_wood",
          "volume": 1
        }
      },
      "bamboo_mosaic_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.bamboo_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.bamboo_wood",
          "volume": 1
        }
      },
      "bamboo_planks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.bamboo_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.bamboo_wood",
          "volume": 1
        }
      },
      "bamboo_pressure_plate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.bamboo_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.bamboo_wood",
          "volume": 1
        }
      },
      "bamboo_sapling": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.bamboo_sapling.break",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.bamboo_sapling.place",
          "volume": 1
        }
      },
      "bamboo_shelf": {
        "break": "block.shelf.break",
        "place": null
      },
      "bamboo_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.bamboo_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.bamboo_wood",
          "volume": 1
        }
      },
      "bamboo_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.bamboo_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.bamboo_wood",
          "volume": 1
        }
      },
      "bamboo_standing_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.bamboo_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.bamboo_wood",
          "volume": 1
        }
      },
      "bamboo_trapdoor": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.bamboo_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.bamboo_wood",
          "volume": 1
        }
      },
      "bamboo_wall_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.bamboo_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.bamboo_wood",
          "volume": 1
        }
      },
      "barrel": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "basalt": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.basalt",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.basalt",
          "volume": 1
        }
      },
      "beacon": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "bed": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "bedrock": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "beetroot": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "bell": {
        "break": {
          "pitch": [
            1.1,
            1.2
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            1.2,
            1.25
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "big_dripleaf": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.big_dripleaf",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.big_dripleaf",
          "volume": 1
        }
      },
      "birch_button": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "birch_door": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "birch_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "birch_fence": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "birch_fence_gate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "birch_hanging_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.hanging_sign",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.hanging_sign",
          "volume": 1
        }
      },
      "birch_leaves": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "birch_log": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "birch_planks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "birch_pressure_plate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "birch_sapling": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "birch_shelf": {
        "break": "block.shelf.break",
        "place": null
      },
      "birch_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "birch_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "birch_standing_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "birch_trapdoor": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "birch_wall_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "birch_wood": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "black_candle": {
        "break": {
          "pitch": 1,
          "sound": "dig.candle",
          "volume": 1
        },
        "place": {
          "pitch": 1,
          "sound": "place.candle",
          "volume": 1
        }
      },
      "black_candle_cake": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "black_carpet": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "black_concrete": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "black_concrete_powder": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.sand",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.sand",
          "volume": 1
        }
      },
      "black_glazed_terracotta": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "black_shulker_box": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "black_stained_glass": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "black_stained_glass_pane": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "black_terracotta": {
        "break": null,
        "place": null
      },
      "black_wool": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "blackstone": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "blackstone_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "blackstone_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "blackstone_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "blackstone_wall": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "blast_furnace": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "blue_candle": {
        "break": {
          "pitch": 1,
          "sound": "dig.candle",
          "volume": 1
        },
        "place": {
          "pitch": 1,
          "sound": "place.candle",
          "volume": 1
        }
      },
      "blue_candle_cake": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "blue_carpet": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "blue_concrete": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "blue_concrete_powder": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.sand",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.sand",
          "volume": 1
        }
      },
      "blue_glazed_terracotta": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "blue_ice": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "blue_orchid": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "blue_shulker_box": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "blue_stained_glass": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "blue_stained_glass_pane": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "blue_terracotta": {
        "break": null,
        "place": null
      },
      "blue_wool": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "bone_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.bone_block",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.bone_block",
          "volume": 1
        }
      },
      "bookshelf": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "border_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "brain_coral": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "brain_coral_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "brain_coral_fan": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "brain_coral_wall_fan": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "brewing_stand": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "brick_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "brick_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "brick_wall": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "brown_candle": {
        "break": {
          "pitch": 1,
          "sound": "dig.candle",
          "volume": 1
        },
        "place": {
          "pitch": 1,
          "sound": "place.candle",
          "volume": 1
        }
      },
      "brown_candle_cake": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "brown_carpet": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "brown_concrete": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "brown_concrete_powder": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.sand",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.sand",
          "volume": 1
        }
      },
      "brown_glazed_terracotta": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "brown_mushroom": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "brown_mushroom_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "brown_shulker_box": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "brown_stained_glass": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "brown_stained_glass_pane": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "brown_terracotta": {
        "break": null,
        "place": null
      },
      "brown_wool": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "bubble_coral": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "bubble_coral_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "bubble_coral_fan": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "bubble_coral_wall_fan": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "budding_amethyst": {
        "break": {
          "pitch": 0.8,
          "sound": "break.amethyst_block",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.amethyst_block",
          "volume": 1
        }
      },
      "bush": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "cactus": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "cactus_flower": {
        "break": {
          "pitch": 0.8,
          "sound": "block.cactus_flower.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.cactus_flower.place"
        }
      },
      "cake": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "calcite": {
        "break": {
          "sound": "break.calcite",
          "volume": 1
        },
        "place": {
          "sound": "place.calcite",
          "volume": 1
        }
      },
      "calibrated_sculk_sensor": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.sculk_sensor",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.sculk_sensor",
          "volume": 0.8
        }
      },
      "campfire": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "candle": {
        "break": {
          "pitch": 1,
          "sound": "dig.candle",
          "volume": 1
        },
        "place": {
          "pitch": 1,
          "sound": "place.candle",
          "volume": 1
        }
      },
      "candle_cake": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "carpet": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "carrots": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "cartography_table": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "carved_pumpkin": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "cave_vines": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cave_vines",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cave_vines",
          "volume": 1
        }
      },
      "cave_vines_body_with_berries": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cave_vines",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cave_vines",
          "volume": 1
        }
      },
      "cave_vines_head_with_berries": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cave_vines",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cave_vines",
          "volume": 1
        }
      },
      "chain": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.chain",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.chain",
          "volume": 1
        }
      },
      "chain_command_block": {
        "break": {
          "pitch": [
            1.1,
            1.2
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            1.2,
            1.25
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "cherry_button": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.cherry_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.cherry_wood",
          "volume": 1
        }
      },
      "cherry_door": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.cherry_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.cherry_wood",
          "volume": 1
        }
      },
      "cherry_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.cherry_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.cherry_wood",
          "volume": 1
        }
      },
      "cherry_fence": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.cherry_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.cherry_wood",
          "volume": 1
        }
      },
      "cherry_fence_gate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.cherry_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.cherry_wood",
          "volume": 1
        }
      },
      "cherry_hanging_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.cherry_wood_hanging_sign",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cherry_wood_hanging_sign",
          "volume": 1
        }
      },
      "cherry_leaves": {
        "break": {
          "sound": "break.cherry_leaves",
          "volume": 1
        },
        "place": {
          "sound": "place.cherry_leaves",
          "volume": 1
        }
      },
      "cherry_log": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.cherry_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.cherry_wood",
          "volume": 1
        }
      },
      "cherry_planks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.cherry_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.cherry_wood",
          "volume": 1
        }
      },
      "cherry_pressure_plate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.cherry_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.cherry_wood",
          "volume": 1
        }
      },
      "cherry_sapling": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.bamboo_sapling.break",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.bamboo_sapling.place",
          "volume": 1
        }
      },
      "cherry_shelf": {
        "break": "block.shelf.break",
        "place": null
      },
      "cherry_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.cherry_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.cherry_wood",
          "volume": 1
        }
      },
      "cherry_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.cherry_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.cherry_wood",
          "volume": 1
        }
      },
      "cherry_standing_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.cherry_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.cherry_wood",
          "volume": 1
        }
      },
      "cherry_trapdoor": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.cherry_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.cherry_wood",
          "volume": 1
        }
      },
      "cherry_wall_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.cherry_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.cherry_wood",
          "volume": 1
        }
      },
      "cherry_wood": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.cherry_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.cherry_wood",
          "volume": 1
        }
      },
      "chest": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "chipped_anvil": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.anvil_land",
          "volume": 0.5
        }
      },
      "chiseled_bookshelf": {
        "break": {
          "pitch": 1,
          "sound": "break.chiseled_bookshelf",
          "volume": 1
        },
        "place": {
          "pitch": 1,
          "sound": "place.chiseled_bookshelf",
          "volume": 1
        }
      },
      "chiseled_cinnabar": {
        "break": {
          "pitch": 0.8,
          "sound": "block.cinnabar.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.cinnabar.place"
        }
      },
      "chiseled_copper": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "chiseled_deepslate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate_bricks",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate_bricks",
          "volume": 1
        }
      },
      "chiseled_nether_bricks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.nether_brick",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.nether_brick",
          "volume": 1
        }
      },
      "chiseled_polished_blackstone": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "chiseled_quartz_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "chiseled_red_sandstone": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "chiseled_resin_bricks": {
        "break": {
          "pitch": 0.8,
          "sound": "block.resin_brick.break",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.resin_brick.place",
          "volume": 1
        }
      },
      "chiseled_sandstone": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "chiseled_stone_bricks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "chiseled_sulfur": {
        "break": {
          "pitch": 0.8,
          "sound": "block.sulfur.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.sulfur.place"
        }
      },
      "chiseled_tuff": {
        "break": {
          "pitch": 0.8,
          "sound": "place.tuff",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.tuff",
          "volume": 1
        }
      },
      "chiseled_tuff_bricks": {
        "break": {
          "pitch": 0.8,
          "sound": "place.tuff_bricks",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.tuff_bricks",
          "volume": 1
        }
      },
      "chorus_flower": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "chorus_plant": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "cinnabar": {
        "break": {
          "pitch": 0.8,
          "sound": "block.cinnabar.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.cinnabar.place"
        }
      },
      "cinnabar_brick_double_slab": {
        "break": {
          "pitch": 0.8,
          "sound": "block.cinnabar.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.cinnabar.place"
        }
      },
      "cinnabar_brick_slab": {
        "break": {
          "pitch": 0.8,
          "sound": "block.cinnabar.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.cinnabar.place"
        }
      },
      "cinnabar_brick_stairs": {
        "break": {
          "pitch": 0.8,
          "sound": "block.cinnabar.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.cinnabar.place"
        }
      },
      "cinnabar_brick_wall": {
        "break": {
          "pitch": 0.8,
          "sound": "block.cinnabar.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.cinnabar.place"
        }
      },
      "cinnabar_bricks": {
        "break": {
          "pitch": 0.8,
          "sound": "block.cinnabar.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.cinnabar.place"
        }
      },
      "cinnabar_double_slab": {
        "break": {
          "pitch": 0.8,
          "sound": "block.cinnabar.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.cinnabar.place"
        }
      },
      "cinnabar_slab": {
        "break": {
          "pitch": 0.8,
          "sound": "block.cinnabar.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.cinnabar.place"
        }
      },
      "cinnabar_stairs": {
        "break": {
          "pitch": 0.8,
          "sound": "block.cinnabar.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.cinnabar.place"
        }
      },
      "cinnabar_wall": {
        "break": {
          "pitch": 0.8,
          "sound": "block.cinnabar.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.cinnabar.place"
        }
      },
      "clay": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.gravel",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.gravel",
          "volume": 1
        }
      },
      "closed_eyeblossom": {
        "break": null,
        "place": null
      },
      "coal_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "coal_ore": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "coarse_dirt": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.gravel",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.gravel",
          "volume": 1
        }
      },
      "cobbled_deepslate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate",
          "volume": 1
        }
      },
      "cobbled_deepslate_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate",
          "volume": 1
        }
      },
      "cobbled_deepslate_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate",
          "volume": 1
        }
      },
      "cobbled_deepslate_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate",
          "volume": 1
        }
      },
      "cobbled_deepslate_wall": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate",
          "volume": 1
        }
      },
      "cobblestone": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "cobblestone_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "cobblestone_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "cobblestone_wall": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "cocoa": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "command_block": {
        "break": {
          "pitch": [
            1.1,
            1.2
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            1.2,
            1.25
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "composter": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "concrete": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "concretePowder": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.sand",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.sand",
          "volume": 1
        }
      },
      "conduit": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "copper_bars": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "copper_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "copper_bulb": {
        "break": {
          "pitch": 0.8,
          "sound": "break.copper_bulb"
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.copper_bulb"
        }
      },
      "copper_chain": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.chain",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.chain",
          "volume": 1
        }
      },
      "copper_chest": {
        "break": null,
        "place": null
      },
      "copper_door": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "copper_golem_statue": {
        "break": "block.copper_golem_statue.break",
        "place": "block.copper_golem_statue.place"
      },
      "copper_grate": {
        "break": {
          "pitch": 0.8,
          "sound": "break.copper_grate",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.copper_grate",
          "volume": 1
        }
      },
      "copper_lantern": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.lantern.break",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.lantern.place",
          "volume": 1
        }
      },
      "copper_ore": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "copper_torch": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "copper_trapdoor": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "coral": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "coral_fan": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "coral_fan_dead": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "coral_fan_hang": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "coral_fan_hang2": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "coral_fan_hang3": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "cornflower": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "cracked_deepslate_bricks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate_bricks",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate_bricks",
          "volume": 1
        }
      },
      "cracked_deepslate_tiles": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate_bricks",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate_bricks",
          "volume": 1
        }
      },
      "cracked_nether_bricks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.nether_brick",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.nether_brick",
          "volume": 1
        }
      },
      "cracked_polished_blackstone_bricks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "cracked_stone_bricks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "crafter": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "crafting_table": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "creaking_heart": {
        "break": {
          "pitch": 0.8,
          "sound": "block.creaking_heart.break",
          "volume": 0.5
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.creaking_heart.place",
          "volume": 0.7
        }
      },
      "creeper_head": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "crimson_button": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.nether_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.nether_wood",
          "volume": 1
        }
      },
      "crimson_door": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.nether_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.nether_wood",
          "volume": 1
        }
      },
      "crimson_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.nether_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.nether_wood",
          "volume": 1
        }
      },
      "crimson_fence": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.nether_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.nether_wood",
          "volume": 1
        }
      },
      "crimson_fence_gate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.nether_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.nether_wood",
          "volume": 1
        }
      },
      "crimson_fungus": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.fungus",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.fungus",
          "volume": 1
        }
      },
      "crimson_hanging_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.nether_wood_hanging_sign",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.nether_wood_hanging_sign",
          "volume": 1
        }
      },
      "crimson_hyphae": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stem",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stem",
          "volume": 1
        }
      },
      "crimson_nylium": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.nylium",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.nylium",
          "volume": 1
        }
      },
      "crimson_planks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.nether_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.nether_wood",
          "volume": 1
        }
      },
      "crimson_pressure_plate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.nether_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.nether_wood",
          "volume": 1
        }
      },
      "crimson_roots": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.roots",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.roots",
          "volume": 1
        }
      },
      "crimson_shelf": {
        "break": "block.shelf.break",
        "place": null
      },
      "crimson_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.nether_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.nether_wood",
          "volume": 1
        }
      },
      "crimson_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.nether_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.nether_wood",
          "volume": 1
        }
      },
      "crimson_standing_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.nether_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.nether_wood",
          "volume": 1
        }
      },
      "crimson_stem": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stem",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stem",
          "volume": 1
        }
      },
      "crimson_trapdoor": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.nether_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.nether_wood",
          "volume": 1
        }
      },
      "crimson_wall_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.nether_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.nether_wood",
          "volume": 1
        }
      },
      "crying_obsidian": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "cut_copper": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "cut_copper_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "cut_copper_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "cut_red_sandstone": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "cut_red_sandstone_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "cut_red_sandstone_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "cut_sandstone": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "cut_sandstone_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "cut_sandstone_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "cyan_candle": {
        "break": {
          "pitch": 1,
          "sound": "dig.candle",
          "volume": 1
        },
        "place": {
          "pitch": 1,
          "sound": "place.candle",
          "volume": 1
        }
      },
      "cyan_candle_cake": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "cyan_carpet": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "cyan_concrete": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "cyan_concrete_powder": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.sand",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.sand",
          "volume": 1
        }
      },
      "cyan_glazed_terracotta": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "cyan_shulker_box": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "cyan_stained_glass": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "cyan_stained_glass_pane": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "cyan_terracotta": {
        "break": null,
        "place": null
      },
      "cyan_wool": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "damaged_anvil": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.anvil_land",
          "volume": 0.5
        }
      },
      "dandelion": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "dark_oak_button": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "dark_oak_door": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "dark_oak_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "dark_oak_fence": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "dark_oak_fence_gate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "dark_oak_hanging_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.hanging_sign",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.hanging_sign",
          "volume": 1
        }
      },
      "dark_oak_leaves": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "dark_oak_log": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "dark_oak_planks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "dark_oak_pressure_plate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "dark_oak_sapling": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "dark_oak_shelf": {
        "break": "block.shelf.break",
        "place": null
      },
      "dark_oak_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "dark_oak_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "dark_oak_trapdoor": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "dark_oak_wood": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "dark_prismarine": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "dark_prismarine_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "dark_prismarine_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "dark_prismarine_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "darkoak_standing_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "darkoak_wall_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "daylight_detector": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "daylight_detector_inverted": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "dead_brain_coral": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "dead_brain_coral_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "dead_brain_coral_fan": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "dead_brain_coral_wall_fan": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "dead_bubble_coral": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "dead_bubble_coral_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "dead_bubble_coral_fan": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "dead_bubble_coral_wall_fan": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "dead_fire_coral": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "dead_fire_coral_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "dead_fire_coral_fan": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "dead_fire_coral_wall_fan": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "dead_horn_coral": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "dead_horn_coral_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "dead_horn_coral_fan": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "dead_horn_coral_wall_fan": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "dead_tube_coral": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "dead_tube_coral_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "dead_tube_coral_fan": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "dead_tube_coral_wall_fan": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "deadbush": {
        "break": null,
        "place": null
      },
      "decorated_pot": {
        "break": null,
        "place": {
          "pitch": 1,
          "sound": "place.decorated_pot",
          "volume": 1
        }
      },
      "deepslate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate",
          "volume": 1
        }
      },
      "deepslate_brick_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate_bricks",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate_bricks",
          "volume": 1
        }
      },
      "deepslate_brick_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate_bricks",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate_bricks",
          "volume": 1
        }
      },
      "deepslate_brick_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate_bricks",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate_bricks",
          "volume": 1
        }
      },
      "deepslate_brick_wall": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate_bricks",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate_bricks",
          "volume": 1
        }
      },
      "deepslate_bricks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate_bricks",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate_bricks",
          "volume": 1
        }
      },
      "deepslate_coal_ore": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate",
          "volume": 1
        }
      },
      "deepslate_copper_ore": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate",
          "volume": 1
        }
      },
      "deepslate_diamond_ore": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate",
          "volume": 1
        }
      },
      "deepslate_emerald_ore": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate",
          "volume": 1
        }
      },
      "deepslate_gold_ore": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate",
          "volume": 1
        }
      },
      "deepslate_iron_ore": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate",
          "volume": 1
        }
      },
      "deepslate_lapis_ore": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate",
          "volume": 1
        }
      },
      "deepslate_redstone_ore": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate",
          "volume": 1
        }
      },
      "deepslate_tile_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate_bricks",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate_bricks",
          "volume": 1
        }
      },
      "deepslate_tile_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate_bricks",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate_bricks",
          "volume": 1
        }
      },
      "deepslate_tile_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate_bricks",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate_bricks",
          "volume": 1
        }
      },
      "deepslate_tile_wall": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate_bricks",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate_bricks",
          "volume": 1
        }
      },
      "deepslate_tiles": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate_bricks",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate_bricks",
          "volume": 1
        }
      },
      "deny": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "deprecated_anvil": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.anvil_land",
          "volume": 0.5
        }
      },
      "deprecated_purpur_block_1": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "deprecated_purpur_block_2": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "detector_rail": {
        "break": {
          "pitch": [
            1.1,
            1.2
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            1.2,
            1.25
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "diamond_block": {
        "break": {
          "pitch": [
            1.1,
            1.2
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            1.2,
            1.25
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "diamond_ore": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "diorite": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "diorite_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "diorite_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "diorite_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "diorite_wall": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "dirt": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.gravel",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.gravel",
          "volume": 1
        }
      },
      "dirt_with_roots": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.hanging_roots",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.hanging_roots",
          "volume": 1
        }
      },
      "dispenser": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "double_cut_copper_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "double_plant": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "double_stone_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "double_stone_slab2": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "double_stone_slab3": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "double_stone_slab4": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "double_wooden_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "dragon_egg": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "dragon_head": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "dried_ghast": {
        "break": {
          "pitch": 0.96,
          "sound": "block.dried_ghast.break",
          "volume": 0.8
        },
        "place": {
          "pitch": 0.96,
          "sound": "block.dried_ghast.place",
          "volume": 0.8
        }
      },
      "dried_kelp_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "dripstone_block": {
        "break": {
          "sound": "break.dripstone_block"
        },
        "place": {
          "sound": "place.dripstone_block"
        }
      },
      "dropper": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "emerald_block": {
        "break": {
          "pitch": [
            1.1,
            1.2
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            1.2,
            1.25
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "emerald_ore": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "end_brick_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "end_bricks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "end_portal_frame": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "end_rod": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "end_stone": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "end_stone_brick_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "end_stone_brick_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "end_stone_brick_wall": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "exposed_chiseled_copper": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "exposed_copper": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "exposed_copper_bars": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "exposed_copper_bulb": {
        "break": {
          "pitch": 0.8,
          "sound": "break.copper_bulb"
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.copper_bulb"
        }
      },
      "exposed_copper_chain": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.chain",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.chain",
          "volume": 1
        }
      },
      "exposed_copper_chest": {
        "break": null,
        "place": null
      },
      "exposed_copper_door": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "exposed_copper_golem_statue": {
        "break": "block.copper_golem_statue.break",
        "place": "block.copper_golem_statue.place"
      },
      "exposed_copper_grate": {
        "break": {
          "pitch": 0.8,
          "sound": "break.copper_grate",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.copper_grate",
          "volume": 1
        }
      },
      "exposed_copper_lantern": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.lantern.break",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.lantern.place",
          "volume": 1
        }
      },
      "exposed_copper_trapdoor": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "exposed_cut_copper": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "exposed_cut_copper_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "exposed_cut_copper_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "exposed_double_cut_copper_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "exposed_lightning_rod": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "farmland": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.gravel",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.gravel",
          "volume": 1
        }
      },
      "fence": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "fence_gate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "fern": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "fire": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "fire_coral": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "fire_coral_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "fire_coral_fan": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "fire_coral_wall_fan": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "firefly_bush": {
        "break": null,
        "place": null
      },
      "fletching_table": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "flowering_azalea": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.azalea",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.azalea",
          "volume": 1
        }
      },
      "frame": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.itemframe.break",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.itemframe.place",
          "volume": 1
        }
      },
      "frog_spawn": {
        "break": {
          "pitch": 1.2,
          "sound": "break.frog_spawn",
          "volume": 0.1
        },
        "place": {
          "pitch": 1.5,
          "sound": "place.frog_spawn",
          "volume": 0.2
        }
      },
      "frosted_ice": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "furnace": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "gilded_blackstone": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "glass": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "glass_pane": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "glow_frame": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.itemframe.break",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.itemframe.place",
          "volume": 1
        }
      },
      "glow_lichen": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "glowingobsidian": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "glowstone": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "gold_block": {
        "break": {
          "pitch": [
            1.1,
            1.2
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            1.2,
            1.25
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "gold_ore": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "golden_dandelion": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "golden_rail": {
        "break": {
          "pitch": [
            1.1,
            1.2
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            1.2,
            1.25
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "granite": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "granite_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "granite_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "granite_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "granite_wall": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "grass": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "grass_path": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "gravel": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.gravel",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.gravel",
          "volume": 1
        }
      },
      "gray_candle": {
        "break": {
          "pitch": 1,
          "sound": "dig.candle",
          "volume": 1
        },
        "place": {
          "pitch": 1,
          "sound": "place.candle",
          "volume": 1
        }
      },
      "gray_candle_cake": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "gray_carpet": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "gray_concrete": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "gray_concrete_powder": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.sand",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.sand",
          "volume": 1
        }
      },
      "gray_glazed_terracotta": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "gray_shulker_box": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "gray_stained_glass": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "gray_stained_glass_pane": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "gray_terracotta": {
        "break": null,
        "place": null
      },
      "gray_wool": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "green_candle": {
        "break": {
          "pitch": 1,
          "sound": "dig.candle",
          "volume": 1
        },
        "place": {
          "pitch": 1,
          "sound": "place.candle",
          "volume": 1
        }
      },
      "green_candle_cake": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "green_carpet": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "green_concrete": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "green_concrete_powder": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.sand",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.sand",
          "volume": 1
        }
      },
      "green_glazed_terracotta": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "green_shulker_box": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "green_stained_glass": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "green_stained_glass_pane": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "green_terracotta": {
        "break": null,
        "place": null
      },
      "green_wool": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "grindstone": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "hanging_roots": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.hanging_roots",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.hanging_roots",
          "volume": 1
        }
      },
      "hardened_clay": {
        "break": null,
        "place": null
      },
      "hay_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "heavy_core": {
        "break": {
          "pitch": 0.8,
          "sound": "break.heavy_core",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.heavy_core",
          "volume": 1
        }
      },
      "heavy_weighted_pressure_plate": {
        "break": {
          "pitch": 0.8,
          "sound": "break.iron",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.iron",
          "volume": 1
        }
      },
      "honey_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.honey_block",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.honey_block",
          "volume": 1
        }
      },
      "honeycomb_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.coral",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.coral",
          "volume": 1
        }
      },
      "hopper": {
        "break": {
          "pitch": [
            1.1,
            1.2
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            1.2,
            1.25
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "horn_coral": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "horn_coral_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "horn_coral_fan": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "horn_coral_wall_fan": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "ice": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "infested_chiseled_stone_bricks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "infested_cobblestone": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "infested_cracked_stone_bricks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "infested_deepslate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate",
          "volume": 1
        }
      },
      "infested_mossy_stone_bricks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "infested_stone": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "infested_stone_bricks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "info_update": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.gravel",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.gravel",
          "volume": 1
        }
      },
      "info_update2": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.gravel",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.gravel",
          "volume": 1
        }
      },
      "iron_bars": {
        "break": {
          "pitch": 0.8,
          "sound": "break.iron",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.iron",
          "volume": 1
        }
      },
      "iron_block": {
        "break": {
          "pitch": 0.8,
          "sound": "break.iron",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.iron",
          "volume": 1
        }
      },
      "iron_door": {
        "break": {
          "pitch": 0.8,
          "sound": "break.iron",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.iron",
          "volume": 1
        }
      },
      "iron_ore": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "iron_trapdoor": {
        "break": {
          "pitch": 0.8,
          "sound": "break.iron",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.iron",
          "volume": 1
        }
      },
      "jukebox": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "jungle_button": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "jungle_door": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "jungle_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "jungle_fence": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "jungle_fence_gate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "jungle_hanging_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.hanging_sign",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.hanging_sign",
          "volume": 1
        }
      },
      "jungle_leaves": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "jungle_log": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "jungle_planks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "jungle_pressure_plate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "jungle_sapling": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "jungle_shelf": {
        "break": "block.shelf.break",
        "place": null
      },
      "jungle_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "jungle_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "jungle_standing_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "jungle_trapdoor": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "jungle_wall_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "jungle_wood": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "kelp": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "ladder": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "lantern": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.lantern.break",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.lantern.place",
          "volume": 1
        }
      },
      "lapis_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "lapis_ore": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "large_amethyst_bud": {
        "break": {
          "sound": "break.large_amethyst_bud"
        },
        "place": {
          "sound": "place.large_amethyst_bud",
          "volume": 1
        }
      },
      "large_fern": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "leaf_litter": {
        "break": {
          "pitch": 0.8,
          "sound": "block.leaf_litter.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.leaf_litter.place"
        }
      },
      "leaves": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "leaves2": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "lectern": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "lever": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "light_block_0": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "light_block_1": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "light_block_10": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "light_block_11": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "light_block_12": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "light_block_13": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "light_block_14": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "light_block_15": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "light_block_2": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "light_block_3": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "light_block_4": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "light_block_5": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "light_block_6": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "light_block_7": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "light_block_8": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "light_block_9": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "light_blue_candle": {
        "break": {
          "pitch": 1,
          "sound": "dig.candle",
          "volume": 1
        },
        "place": {
          "pitch": 1,
          "sound": "place.candle",
          "volume": 1
        }
      },
      "light_blue_candle_cake": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "light_blue_carpet": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "light_blue_concrete": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "light_blue_concrete_powder": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.sand",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.sand",
          "volume": 1
        }
      },
      "light_blue_glazed_terracotta": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "light_blue_shulker_box": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "light_blue_stained_glass": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "light_blue_stained_glass_pane": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "light_blue_terracotta": {
        "break": null,
        "place": null
      },
      "light_blue_wool": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "light_gray_candle": {
        "break": {
          "pitch": 1,
          "sound": "dig.candle",
          "volume": 1
        },
        "place": {
          "pitch": 1,
          "sound": "place.candle",
          "volume": 1
        }
      },
      "light_gray_candle_cake": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "light_gray_carpet": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "light_gray_concrete": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "light_gray_concrete_powder": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.sand",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.sand",
          "volume": 1
        }
      },
      "light_gray_shulker_box": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "light_gray_stained_glass": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "light_gray_stained_glass_pane": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "light_gray_terracotta": {
        "break": null,
        "place": null
      },
      "light_gray_wool": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "light_weighted_pressure_plate": {
        "break": {
          "pitch": [
            1.1,
            1.2
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            1.2,
            1.25
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "lightning_rod": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "lilac": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "lily_of_the_valley": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "lime_candle": {
        "break": {
          "pitch": 1,
          "sound": "dig.candle",
          "volume": 1
        },
        "place": {
          "pitch": 1,
          "sound": "place.candle",
          "volume": 1
        }
      },
      "lime_candle_cake": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "lime_carpet": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "lime_concrete": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "lime_concrete_powder": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.sand",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.sand",
          "volume": 1
        }
      },
      "lime_glazed_terracotta": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "lime_shulker_box": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "lime_stained_glass": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "lime_stained_glass_pane": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "lime_terracotta": {
        "break": null,
        "place": null
      },
      "lime_wool": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "lit_blast_furnace": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "lit_deepslate_redstone_ore": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate",
          "volume": 1
        }
      },
      "lit_furnace": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "lit_pumpkin": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "lit_redstone_lamp": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "lit_redstone_ore": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "lit_smoker": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "lodestone": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.lodestone",
          "volume": 1
        }
      },
      "log": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "log2": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "loom": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "magenta_candle": {
        "break": {
          "pitch": 1,
          "sound": "dig.candle",
          "volume": 1
        },
        "place": {
          "pitch": 1,
          "sound": "place.candle",
          "volume": 1
        }
      },
      "magenta_candle_cake": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "magenta_carpet": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "magenta_concrete": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "magenta_concrete_powder": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.sand",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.sand",
          "volume": 1
        }
      },
      "magenta_glazed_terracotta": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "magenta_shulker_box": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "magenta_stained_glass": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "magenta_stained_glass_pane": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "magenta_terracotta": {
        "break": null,
        "place": null
      },
      "magenta_wool": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "magma": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "mangrove_button": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "mangrove_door": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "mangrove_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "mangrove_fence": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "mangrove_fence_gate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "mangrove_hanging_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.hanging_sign",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.hanging_sign",
          "volume": 1
        }
      },
      "mangrove_leaves": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "mangrove_log": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "mangrove_planks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "mangrove_pressure_plate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "mangrove_propagule": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "mangrove_roots": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.mangrove_roots.break",
          "volume": 0.4
        },
        "place": {
          "pitch": [
            1,
            1.2
          ],
          "sound": "block.mangrove_roots.place",
          "volume": 0.25
        }
      },
      "mangrove_shelf": {
        "break": "block.shelf.break",
        "place": null
      },
      "mangrove_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "mangrove_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "mangrove_standing_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "mangrove_trapdoor": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "mangrove_wall_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "mangrove_wood": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "medium_amethyst_bud": {
        "break": {
          "sound": "break.medium_amethyst_bud"
        },
        "place": {
          "sound": "place.medium_amethyst_bud",
          "volume": 1
        }
      },
      "melon_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "melon_stem": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "mob_spawner": {
        "break": {
          "pitch": 0.8,
          "sound": "block.mob_spawner.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.mob_spawner.place"
        }
      },
      "moss_block": {
        "break": {
          "sound": "dig.moss",
          "volume": 0.93
        },
        "place": {
          "sound": "place.moss",
          "volume": 0.93
        }
      },
      "moss_carpet": {
        "break": {
          "sound": "dig.moss",
          "volume": 0.93
        },
        "place": {
          "sound": "place.moss",
          "volume": 0.93
        }
      },
      "mossy_cobblestone": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "mossy_cobblestone_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "mossy_cobblestone_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "mossy_cobblestone_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "mossy_cobblestone_wall": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "mossy_stone_brick_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "mossy_stone_brick_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "mossy_stone_brick_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "mossy_stone_brick_wall": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "mossy_stone_bricks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "mud": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.mud.break",
          "volume": 0.4
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.mud.place",
          "volume": 0.25
        }
      },
      "mud_brick_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.mud_bricks.break",
          "volume": 0.5
        },
        "place": {
          "pitch": [
            0.6,
            0.8
          ],
          "sound": "block.mud_bricks.place",
          "volume": 0.3
        }
      },
      "mud_brick_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.mud_bricks.break",
          "volume": 0.5
        },
        "place": {
          "pitch": [
            0.6,
            0.8
          ],
          "sound": "block.mud_bricks.place",
          "volume": 0.3
        }
      },
      "mud_brick_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.mud_bricks.break",
          "volume": 0.5
        },
        "place": {
          "pitch": [
            0.6,
            0.8
          ],
          "sound": "block.mud_bricks.place",
          "volume": 0.3
        }
      },
      "mud_brick_wall": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.mud_bricks.break",
          "volume": 0.5
        },
        "place": {
          "pitch": [
            0.6,
            0.8
          ],
          "sound": "block.mud_bricks.place",
          "volume": 0.3
        }
      },
      "mud_bricks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.mud_bricks.break",
          "volume": 0.5
        },
        "place": {
          "pitch": [
            0.6,
            0.8
          ],
          "sound": "block.mud_bricks.place",
          "volume": 0.3
        }
      },
      "muddy_mangrove_roots": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.muddy_mangrove_roots.break",
          "volume": 0.4
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.muddy_mangrove_roots.place",
          "volume": 0.25
        }
      },
      "mushroom_stem": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "mycelium": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "nether_brick": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.nether_brick",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.nether_brick",
          "volume": 1
        }
      },
      "nether_brick_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "nether_brick_fence": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.nether_brick",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.nether_brick",
          "volume": 1
        }
      },
      "nether_brick_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.nether_brick",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.nether_brick",
          "volume": 1
        }
      },
      "nether_brick_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.nether_brick",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.nether_brick",
          "volume": 1
        }
      },
      "nether_brick_wall": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.nether_brick",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.nether_brick",
          "volume": 1
        }
      },
      "nether_gold_ore": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.nether_gold_ore",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.nether_gold_ore",
          "volume": 1
        }
      },
      "nether_sprouts": {
        "break": {
          "pitch": [
            1.1,
            1.2
          ],
          "sound": "dig.nether_sprouts",
          "volume": 1
        },
        "place": {
          "pitch": [
            1.2,
            1.25
          ],
          "sound": "place.nether_sprouts",
          "volume": 1
        }
      },
      "nether_wart": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.nether_wart",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.nether_wart",
          "volume": 0.7
        }
      },
      "nether_wart_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.nether_wart",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.nether_wart",
          "volume": 0.7
        }
      },
      "netherite_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.netherite",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.netherite",
          "volume": 1
        }
      },
      "netherrack": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.netherrack",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.netherrack",
          "volume": 1
        }
      },
      "netherreactor": {
        "break": {
          "pitch": [
            1.1,
            1.2
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            1.2,
            1.25
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "normal_stone_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "normal_stone_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "normal_stone_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "noteblock": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "oak_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "oak_fence": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "oak_hanging_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.hanging_sign",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.hanging_sign",
          "volume": 1
        }
      },
      "oak_leaves": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "oak_log": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "oak_planks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "oak_sapling": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "oak_shelf": {
        "break": "block.shelf.break",
        "place": null
      },
      "oak_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "oak_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "oak_wood": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "observer": {
        "break": {
          "pitch": [
            1.1,
            1.2
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            1.2,
            1.25
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "obsidian": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "ochre_froglight": {
        "break": {
          "sound": "break.froglight",
          "volume": 1
        },
        "place": {
          "sound": "place.froglight",
          "volume": 1
        }
      },
      "open_eyeblossom": {
        "break": null,
        "place": null
      },
      "orange_candle": {
        "break": {
          "pitch": 1,
          "sound": "dig.candle",
          "volume": 1
        },
        "place": {
          "pitch": 1,
          "sound": "place.candle",
          "volume": 1
        }
      },
      "orange_candle_cake": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "orange_carpet": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "orange_concrete": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "orange_concrete_powder": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.sand",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.sand",
          "volume": 1
        }
      },
      "orange_glazed_terracotta": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "orange_shulker_box": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "orange_stained_glass": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "orange_stained_glass_pane": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "orange_terracotta": {
        "break": null,
        "place": null
      },
      "orange_tulip": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "orange_wool": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "oxeye_daisy": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "oxidized_chiseled_copper": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "oxidized_copper": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "oxidized_copper_bars": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "oxidized_copper_bulb": {
        "break": {
          "pitch": 0.8,
          "sound": "break.copper_bulb"
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.copper_bulb"
        }
      },
      "oxidized_copper_chain": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.chain",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.chain",
          "volume": 1
        }
      },
      "oxidized_copper_chest": {
        "break": null,
        "place": null
      },
      "oxidized_copper_door": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "oxidized_copper_golem_statue": {
        "break": "block.copper_golem_statue.break",
        "place": "block.copper_golem_statue.place"
      },
      "oxidized_copper_grate": {
        "break": {
          "pitch": 0.8,
          "sound": "break.copper_grate",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.copper_grate",
          "volume": 1
        }
      },
      "oxidized_copper_lantern": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.lantern.break",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.lantern.place",
          "volume": 1
        }
      },
      "oxidized_copper_trapdoor": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "oxidized_cut_copper": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "oxidized_cut_copper_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "oxidized_cut_copper_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "oxidized_double_cut_copper_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "oxidized_lightning_rod": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "packed_ice": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "packed_mud": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.packed_mud.break",
          "volume": 0.4
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.packed_mud.place",
          "volume": 0.25
        }
      },
      "pale_hanging_moss": {
        "break": null,
        "place": null
      },
      "pale_moss_block": {
        "break": {
          "sound": "dig.moss",
          "volume": 0.93
        },
        "place": {
          "sound": "place.moss",
          "volume": 0.93
        }
      },
      "pale_moss_carpet": {
        "break": {
          "sound": "dig.moss",
          "volume": 0.93
        },
        "place": {
          "sound": "place.moss",
          "volume": 0.93
        }
      },
      "pale_oak_button": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "pale_oak_door": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "pale_oak_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "pale_oak_fence": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "pale_oak_fence_gate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "pale_oak_hanging_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.hanging_sign",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.hanging_sign",
          "volume": 1
        }
      },
      "pale_oak_leaves": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "pale_oak_log": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "pale_oak_planks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "pale_oak_pressure_plate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "pale_oak_sapling": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "pale_oak_shelf": {
        "break": "block.shelf.break",
        "place": null
      },
      "pale_oak_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "pale_oak_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "pale_oak_standing_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "pale_oak_trapdoor": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "pale_oak_wall_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "pale_oak_wood": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "pearlescent_froglight": {
        "break": {
          "sound": "break.froglight",
          "volume": 1
        },
        "place": {
          "sound": "place.froglight",
          "volume": 1
        }
      },
      "peony": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "petrified_oak_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "petrified_oak_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "piglin_head": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "pink_candle": {
        "break": {
          "pitch": 1,
          "sound": "dig.candle",
          "volume": 1
        },
        "place": {
          "pitch": 1,
          "sound": "place.candle",
          "volume": 1
        }
      },
      "pink_candle_cake": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "pink_carpet": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "pink_concrete": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "pink_concrete_powder": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.sand",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.sand",
          "volume": 1
        }
      },
      "pink_glazed_terracotta": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "pink_petals": {
        "break": {
          "sound": "break.pink_petals",
          "volume": 1
        },
        "place": {
          "sound": "place.pink_petals",
          "volume": 1
        }
      },
      "pink_shulker_box": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "pink_stained_glass": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "pink_stained_glass_pane": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "pink_terracotta": {
        "break": null,
        "place": null
      },
      "pink_tulip": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "pink_wool": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "piston": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "pitcher_crop": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "pitcher_plant": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "planks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "player_head": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "podzol": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.gravel",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.gravel",
          "volume": 1
        }
      },
      "pointed_dripstone": {
        "break": {
          "sound": "break.pointed_dripstone"
        },
        "place": {
          "sound": "place.pointed_dripstone"
        }
      },
      "polished_andesite": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "polished_andesite_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "polished_andesite_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "polished_andesite_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "polished_basalt": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.basalt",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.basalt",
          "volume": 1
        }
      },
      "polished_blackstone": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "polished_blackstone_brick_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "polished_blackstone_brick_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "polished_blackstone_brick_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "polished_blackstone_brick_wall": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "polished_blackstone_bricks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "polished_blackstone_button": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "polished_blackstone_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "polished_blackstone_pressure_plate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "polished_blackstone_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "polished_blackstone_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "polished_blackstone_wall": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "polished_cinnabar": {
        "break": {
          "pitch": 0.8,
          "sound": "block.cinnabar.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.cinnabar.place"
        }
      },
      "polished_cinnabar_double_slab": {
        "break": {
          "pitch": 0.8,
          "sound": "block.cinnabar.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.cinnabar.place"
        }
      },
      "polished_cinnabar_slab": {
        "break": {
          "pitch": 0.8,
          "sound": "block.cinnabar.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.cinnabar.place"
        }
      },
      "polished_cinnabar_stairs": {
        "break": {
          "pitch": 0.8,
          "sound": "block.cinnabar.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.cinnabar.place"
        }
      },
      "polished_cinnabar_wall": {
        "break": {
          "pitch": 0.8,
          "sound": "block.cinnabar.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.cinnabar.place"
        }
      },
      "polished_deepslate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate",
          "volume": 1
        }
      },
      "polished_deepslate_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate",
          "volume": 1
        }
      },
      "polished_deepslate_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate",
          "volume": 1
        }
      },
      "polished_deepslate_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate",
          "volume": 1
        }
      },
      "polished_deepslate_wall": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate",
          "volume": 1
        }
      },
      "polished_diorite": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "polished_diorite_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "polished_diorite_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "polished_diorite_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "polished_granite": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "polished_granite_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "polished_granite_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "polished_granite_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "polished_sulfur": {
        "break": {
          "pitch": 0.8,
          "sound": "block.sulfur.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.sulfur.place"
        }
      },
      "polished_sulfur_double_slab": {
        "break": {
          "pitch": 0.8,
          "sound": "block.sulfur.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.sulfur.place"
        }
      },
      "polished_sulfur_slab": {
        "break": {
          "pitch": 0.8,
          "sound": "block.sulfur.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.sulfur.place"
        }
      },
      "polished_sulfur_stairs": {
        "break": {
          "pitch": 0.8,
          "sound": "block.sulfur.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.sulfur.place"
        }
      },
      "polished_sulfur_wall": {
        "break": {
          "pitch": 0.8,
          "sound": "block.sulfur.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.sulfur.place"
        }
      },
      "polished_tuff": {
        "break": {
          "pitch": 0.96,
          "sound": "break.tuff",
          "volume": 1
        },
        "place": {
          "pitch": 0.96,
          "sound": "place.tuff",
          "volume": 1
        }
      },
      "polished_tuff_double_slab": {
        "break": {
          "pitch": 0.96,
          "sound": "break.tuff",
          "volume": 1
        },
        "place": {
          "pitch": 0.96,
          "sound": "place.tuff",
          "volume": 1
        }
      },
      "polished_tuff_slab": {
        "break": {
          "pitch": 0.96,
          "sound": "break.tuff",
          "volume": 1
        },
        "place": {
          "pitch": 0.96,
          "sound": "place.tuff",
          "volume": 1
        }
      },
      "polished_tuff_stairs": {
        "break": {
          "pitch": 0.96,
          "sound": "break.tuff",
          "volume": 1
        },
        "place": {
          "pitch": 0.96,
          "sound": "place.tuff",
          "volume": 1
        }
      },
      "polished_tuff_wall": {
        "break": {
          "pitch": 0.96,
          "sound": "break.tuff",
          "volume": 1
        },
        "place": {
          "pitch": 0.96,
          "sound": "place.tuff",
          "volume": 1
        }
      },
      "poppy": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "portal": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "potatoes": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "potent_sulfur": {
        "break": {
          "pitch": 0.8,
          "sound": "block.potent_sulfur.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.potent_sulfur.place"
        }
      },
      "powder_snow": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.powder_snow",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.powder_snow",
          "volume": 1
        }
      },
      "powered_comparator": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "powered_repeater": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "prismarine": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "prismarine_brick_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "prismarine_brick_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "prismarine_bricks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "prismarine_bricks_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "prismarine_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "prismarine_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "prismarine_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "prismarine_wall": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "pumpkin": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "pumpkin_stem": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "purple_candle": {
        "break": {
          "pitch": 1,
          "sound": "dig.candle",
          "volume": 1
        },
        "place": {
          "pitch": 1,
          "sound": "place.candle",
          "volume": 1
        }
      },
      "purple_candle_cake": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "purple_carpet": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "purple_concrete": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "purple_concrete_powder": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.sand",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.sand",
          "volume": 1
        }
      },
      "purple_glazed_terracotta": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "purple_shulker_box": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "purple_stained_glass": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "purple_stained_glass_pane": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "purple_terracotta": {
        "break": null,
        "place": null
      },
      "purple_wool": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "purpur_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "purpur_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "purpur_pillar": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "purpur_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "quartz_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "quartz_bricks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "quartz_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "quartz_ore": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.nether_gold_ore",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.nether_gold_ore",
          "volume": 1
        }
      },
      "quartz_pillar": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "quartz_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "rail": {
        "break": {
          "pitch": [
            1.1,
            1.2
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            1.2,
            1.25
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "raw_copper_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "raw_gold_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "raw_iron_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "red_candle": {
        "break": {
          "pitch": 1,
          "sound": "dig.candle",
          "volume": 1
        },
        "place": {
          "pitch": 1,
          "sound": "place.candle",
          "volume": 1
        }
      },
      "red_candle_cake": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "red_carpet": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "red_concrete": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "red_concrete_powder": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.sand",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.sand",
          "volume": 1
        }
      },
      "red_flower": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "red_glazed_terracotta": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "red_mushroom": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "red_mushroom_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "red_nether_brick": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.nether_brick",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.nether_brick",
          "volume": 1
        }
      },
      "red_nether_brick_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "red_nether_brick_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.nether_brick",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.nether_brick",
          "volume": 1
        }
      },
      "red_nether_brick_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.nether_brick",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.nether_brick",
          "volume": 1
        }
      },
      "red_nether_brick_wall": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.nether_brick",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.nether_brick",
          "volume": 1
        }
      },
      "red_sand": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.sand",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.sand",
          "volume": 1
        }
      },
      "red_sandstone": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "red_sandstone_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "red_sandstone_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "red_sandstone_wall": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "red_shulker_box": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "red_stained_glass": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "red_stained_glass_pane": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "red_terracotta": {
        "break": null,
        "place": null
      },
      "red_tulip": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "red_wool": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "redstone_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "redstone_lamp": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "redstone_ore": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "redstone_torch": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "reeds": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "reinforced_deepslate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.deepslate",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.deepslate",
          "volume": 1
        }
      },
      "repeating_command_block": {
        "break": {
          "pitch": [
            1.1,
            1.2
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            1.2,
            1.25
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "resin_block": {
        "break": {
          "pitch": 0.8,
          "sound": "block.resin.break",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.resin.place",
          "volume": 1
        }
      },
      "resin_brick_double_slab": {
        "break": {
          "pitch": 0.8,
          "sound": "block.resin_brick.break",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.resin_brick.place",
          "volume": 1
        }
      },
      "resin_brick_slab": {
        "break": {
          "pitch": 0.8,
          "sound": "block.resin_brick.break",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.resin_brick.place",
          "volume": 1
        }
      },
      "resin_brick_stairs": {
        "break": {
          "pitch": 0.8,
          "sound": "block.resin_brick.break",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.resin_brick.place",
          "volume": 1
        }
      },
      "resin_brick_wall": {
        "break": {
          "pitch": 0.8,
          "sound": "block.resin_brick.break",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.resin_brick.place",
          "volume": 1
        }
      },
      "resin_bricks": {
        "break": {
          "pitch": 0.8,
          "sound": "block.resin_brick.break",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.resin_brick.place",
          "volume": 1
        }
      },
      "resin_clump": {
        "break": {
          "pitch": 0.8,
          "sound": "block.resin.break",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.resin.place",
          "volume": 1
        }
      },
      "respawn_anchor": {
        "break": {
          "pitch": [
            1.1,
            1.2
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            1.2,
            1.25
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "rose_bush": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "sand": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.sand",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.sand",
          "volume": 1
        }
      },
      "sandstone": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "sandstone_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "sandstone_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "sandstone_wall": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "sapling": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "scaffolding": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.scaffolding.break",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.9
          ],
          "sound": "block.scaffolding.place",
          "volume": 1
        }
      },
      "sculk": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.sculk",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.sculk",
          "volume": 1
        }
      },
      "sculk_catalyst": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.sculk_catalyst",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.sculk_catalyst",
          "volume": 1
        }
      },
      "sculk_sensor": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.sculk_sensor",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.sculk_sensor",
          "volume": 0.8
        }
      },
      "sculk_shrieker": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.sculk_shrieker",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.sculk_shrieker",
          "volume": 1
        }
      },
      "sculk_vein": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.sculk_vein",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.sculk_vein",
          "volume": 1
        }
      },
      "seaLantern": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "sea_pickle": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "mob.slime.big",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.slime.big",
          "volume": 1
        }
      },
      "seagrass": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "short_dry_grass": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "short_grass": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "shroomlight": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.shroomlight",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.shroomlight",
          "volume": 1
        }
      },
      "shulker_box": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "silver_glazed_terracotta": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "skeleton_skull": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "skull": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "slime": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "mob.slime.big",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.slime.big",
          "volume": 1
        }
      },
      "small_amethyst_bud": {
        "break": {
          "sound": "break.small_amethyst_bud"
        },
        "place": {
          "sound": "place.small_amethyst_bud",
          "volume": 1
        }
      },
      "small_dripleaf_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.big_dripleaf",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.big_dripleaf",
          "volume": 1
        }
      },
      "smithing_table": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "smoker": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "smooth_basalt": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.basalt",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.basalt",
          "volume": 1
        }
      },
      "smooth_quartz": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "smooth_quartz_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "smooth_quartz_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "smooth_quartz_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "smooth_red_sandstone": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "smooth_red_sandstone_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "smooth_red_sandstone_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "smooth_red_sandstone_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "smooth_sandstone": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "smooth_sandstone_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "smooth_sandstone_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "smooth_sandstone_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "smooth_stone": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "smooth_stone_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "smooth_stone_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "sniffer_egg": {
        "break": {
          "pitch": [
            1.1,
            1.2
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            1.2,
            1.25
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "snow": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.snow",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.snow",
          "volume": 1
        }
      },
      "snow_layer": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.snow",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.snow",
          "volume": 1
        }
      },
      "soul_campfire": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "soul_fire": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "soul_lantern": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.lantern.break",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.lantern.place",
          "volume": 1
        }
      },
      "soul_sand": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.soul_sand",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.soul_sand",
          "volume": 1
        }
      },
      "soul_soil": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.soul_soil",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.soul_soil",
          "volume": 1
        }
      },
      "soul_torch": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "sponge": {
        "break": {
          "pitch": 0.8,
          "sound": "break.sponge",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.sponge",
          "volume": 1
        }
      },
      "spore_blossom": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.spore_blossom",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.spore_blossom",
          "volume": 1
        }
      },
      "spruce_button": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "spruce_door": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "spruce_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "spruce_fence": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "spruce_fence_gate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "spruce_hanging_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.hanging_sign",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.hanging_sign",
          "volume": 1
        }
      },
      "spruce_leaves": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "spruce_log": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "spruce_planks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "spruce_pressure_plate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "spruce_sapling": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "spruce_shelf": {
        "break": "block.shelf.break",
        "place": null
      },
      "spruce_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "spruce_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "spruce_standing_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "spruce_trapdoor": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "spruce_wall_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "spruce_wood": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "stained_glass": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "stained_glass_pane": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "stained_hardened_clay": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "standing_banner": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "standing_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "sticky_piston": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "stone": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "stone_brick_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "stone_brick_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "stone_brick_wall": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "stone_bricks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "stone_button": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "stone_pressure_plate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "stone_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "stone_slab2": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "stone_slab3": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "stone_slab4": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "stonebrick": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "stonecutter": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "stonecutter_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "stripped_acacia_log": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "stripped_acacia_wood": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "stripped_bamboo_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.bamboo_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.bamboo_wood",
          "volume": 1
        }
      },
      "stripped_birch_log": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "stripped_birch_wood": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "stripped_cherry_log": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.cherry_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.cherry_wood",
          "volume": 1
        }
      },
      "stripped_cherry_wood": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.cherry_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.cherry_wood",
          "volume": 1
        }
      },
      "stripped_crimson_hyphae": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stem",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stem",
          "volume": 1
        }
      },
      "stripped_crimson_stem": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stem",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stem",
          "volume": 1
        }
      },
      "stripped_dark_oak_log": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "stripped_dark_oak_wood": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "stripped_jungle_log": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "stripped_jungle_wood": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "stripped_mangrove_log": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "stripped_mangrove_wood": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "stripped_oak_log": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "stripped_oak_wood": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "stripped_pale_oak_log": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "stripped_pale_oak_wood": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "stripped_spruce_log": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "stripped_spruce_wood": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "stripped_warped_hyphae": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stem",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stem",
          "volume": 1
        }
      },
      "stripped_warped_stem": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stem",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stem",
          "volume": 1
        }
      },
      "sulfur": {
        "break": {
          "pitch": 0.8,
          "sound": "block.sulfur.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.sulfur.place"
        }
      },
      "sulfur_brick_double_slab": {
        "break": {
          "pitch": 0.8,
          "sound": "block.sulfur.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.sulfur.place"
        }
      },
      "sulfur_brick_slab": {
        "break": {
          "pitch": 0.8,
          "sound": "block.sulfur.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.sulfur.place"
        }
      },
      "sulfur_brick_stairs": {
        "break": {
          "pitch": 0.8,
          "sound": "block.sulfur.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.sulfur.place"
        }
      },
      "sulfur_brick_wall": {
        "break": {
          "pitch": 0.8,
          "sound": "block.sulfur.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.sulfur.place"
        }
      },
      "sulfur_bricks": {
        "break": {
          "pitch": 0.8,
          "sound": "block.sulfur.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.sulfur.place"
        }
      },
      "sulfur_double_slab": {
        "break": {
          "pitch": 0.8,
          "sound": "block.sulfur.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.sulfur.place"
        }
      },
      "sulfur_slab": {
        "break": {
          "pitch": 0.8,
          "sound": "block.sulfur.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.sulfur.place"
        }
      },
      "sulfur_spike": {
        "break": {
          "pitch": 0.8,
          "sound": "block.sulfur_spike.break",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.sulfur_spike.place",
          "volume": 1
        }
      },
      "sulfur_stairs": {
        "break": {
          "pitch": 0.8,
          "sound": "block.sulfur.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.sulfur.place"
        }
      },
      "sulfur_wall": {
        "break": {
          "pitch": 0.8,
          "sound": "block.sulfur.break"
        },
        "place": {
          "pitch": 0.8,
          "sound": "block.sulfur.place"
        }
      },
      "sunflower": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "suspicious_gravel": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.suspicious_gravel",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.suspicious_gravel",
          "volume": 1
        }
      },
      "suspicious_sand": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.suspicious_sand",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.suspicious_sand",
          "volume": 1
        }
      },
      "sweet_berry_bush": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.sweet_berry_bush.break",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.sweet_berry_bush.place",
          "volume": 1
        }
      },
      "tall_dry_grass": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "tall_grass": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "tallgrass": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "target": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "tinted_glass": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "tnt": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "torch": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "torchflower": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "torchflower_crop": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "trapdoor": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "trapped_chest": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "trial_spawner": {
        "break": {
          "pitch": 0.8,
          "sound": "trial_spawner.break",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "trial_spawner.place",
          "volume": 1
        }
      },
      "tube_coral": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "tube_coral_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "tube_coral_fan": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "tube_coral_wall_fan": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "tuff": {
        "break": {
          "pitch": 0.8,
          "sound": "place.tuff",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.tuff",
          "volume": 1
        }
      },
      "tuff_brick_double_slab": {
        "break": {
          "pitch": 0.8,
          "sound": "place.tuff_bricks",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.tuff_bricks",
          "volume": 1
        }
      },
      "tuff_brick_slab": {
        "break": {
          "pitch": 0.8,
          "sound": "place.tuff_bricks",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.tuff_bricks",
          "volume": 1
        }
      },
      "tuff_brick_stairs": {
        "break": {
          "pitch": 0.8,
          "sound": "place.tuff_bricks",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.tuff_bricks",
          "volume": 1
        }
      },
      "tuff_brick_wall": {
        "break": {
          "pitch": 0.8,
          "sound": "place.tuff_bricks",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.tuff_bricks",
          "volume": 1
        }
      },
      "tuff_bricks": {
        "break": {
          "pitch": 0.8,
          "sound": "place.tuff_bricks",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.tuff_bricks",
          "volume": 1
        }
      },
      "tuff_double_slab": {
        "break": {
          "pitch": 0.8,
          "sound": "place.tuff",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.tuff",
          "volume": 1
        }
      },
      "tuff_slab": {
        "break": {
          "pitch": 0.8,
          "sound": "place.tuff",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.tuff",
          "volume": 1
        }
      },
      "tuff_stairs": {
        "break": {
          "pitch": 0.8,
          "sound": "place.tuff",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.tuff",
          "volume": 1
        }
      },
      "tuff_wall": {
        "break": {
          "pitch": 0.8,
          "sound": "place.tuff",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.tuff",
          "volume": 1
        }
      },
      "turtle_egg": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "twisting_vines": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.weeping_vines.break",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.weeping_vines.place",
          "volume": 1
        }
      },
      "undyed_shulker_box": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "unlit_redstone_torch": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "unpowered_comparator": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "unpowered_repeater": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "vault": {
        "break": {
          "pitch": 0.8,
          "sound": "vault.break",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "vault.place",
          "volume": 1
        }
      },
      "verdant_froglight": {
        "break": {
          "sound": "break.froglight",
          "volume": 1
        },
        "place": {
          "sound": "place.froglight",
          "volume": 1
        }
      },
      "vine": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.vines",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.vines",
          "volume": 1
        }
      },
      "wall_banner": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "wall_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "warped_button": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.nether_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.nether_wood",
          "volume": 1
        }
      },
      "warped_door": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.nether_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.nether_wood",
          "volume": 1
        }
      },
      "warped_double_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.nether_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.nether_wood",
          "volume": 1
        }
      },
      "warped_fence": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.nether_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.nether_wood",
          "volume": 1
        }
      },
      "warped_fence_gate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.nether_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.nether_wood",
          "volume": 1
        }
      },
      "warped_fungus": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.fungus",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.fungus",
          "volume": 1
        }
      },
      "warped_hanging_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.nether_wood_hanging_sign",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.nether_wood_hanging_sign",
          "volume": 1
        }
      },
      "warped_hyphae": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stem",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stem",
          "volume": 1
        }
      },
      "warped_nylium": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.nylium",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.nylium",
          "volume": 1
        }
      },
      "warped_planks": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.nether_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.nether_wood",
          "volume": 1
        }
      },
      "warped_pressure_plate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.nether_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.nether_wood",
          "volume": 1
        }
      },
      "warped_roots": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.roots",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.roots",
          "volume": 1
        }
      },
      "warped_shelf": {
        "break": "block.shelf.break",
        "place": null
      },
      "warped_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.nether_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.nether_wood",
          "volume": 1
        }
      },
      "warped_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.nether_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.nether_wood",
          "volume": 1
        }
      },
      "warped_standing_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.nether_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.nether_wood",
          "volume": 1
        }
      },
      "warped_stem": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stem",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stem",
          "volume": 1
        }
      },
      "warped_trapdoor": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.nether_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.nether_wood",
          "volume": 1
        }
      },
      "warped_wall_sign": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "break.nether_wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.nether_wood",
          "volume": 1
        }
      },
      "warped_wart_block": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.nether_wart",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.nether_wart",
          "volume": 0.7
        }
      },
      "waterlily": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "waxed_chiseled_copper": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_copper": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_copper_bars": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_copper_bulb": {
        "break": {
          "pitch": 0.8,
          "sound": "break.copper_bulb"
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.copper_bulb"
        }
      },
      "waxed_copper_chain": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.chain",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.chain",
          "volume": 1
        }
      },
      "waxed_copper_chest": {
        "break": null,
        "place": null
      },
      "waxed_copper_door": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_copper_golem_statue": {
        "break": "block.copper_golem_statue.break",
        "place": "block.copper_golem_statue.place"
      },
      "waxed_copper_grate": {
        "break": {
          "pitch": 0.8,
          "sound": "break.copper_grate",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.copper_grate",
          "volume": 1
        }
      },
      "waxed_copper_lantern": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.lantern.break",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.lantern.place",
          "volume": 1
        }
      },
      "waxed_copper_trapdoor": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_cut_copper": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_cut_copper_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_cut_copper_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_double_cut_copper_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_exposed_chiseled_copper": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_exposed_copper": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_exposed_copper_bars": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_exposed_copper_bulb": {
        "break": {
          "pitch": 0.8,
          "sound": "break.copper_bulb"
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.copper_bulb"
        }
      },
      "waxed_exposed_copper_chain": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.chain",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.chain",
          "volume": 1
        }
      },
      "waxed_exposed_copper_chest": {
        "break": null,
        "place": null
      },
      "waxed_exposed_copper_door": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_exposed_copper_golem_statue": {
        "break": "block.copper_golem_statue.break",
        "place": "block.copper_golem_statue.place"
      },
      "waxed_exposed_copper_grate": {
        "break": {
          "pitch": 0.8,
          "sound": "break.copper_grate",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.copper_grate",
          "volume": 1
        }
      },
      "waxed_exposed_copper_lantern": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.lantern.break",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.lantern.place",
          "volume": 1
        }
      },
      "waxed_exposed_copper_trapdoor": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_exposed_cut_copper": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_exposed_cut_copper_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_exposed_cut_copper_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_exposed_double_cut_copper_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_exposed_lightning_rod": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_lightning_rod": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_oxidized_chiseled_copper": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_oxidized_copper": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_oxidized_copper_bars": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_oxidized_copper_bulb": {
        "break": {
          "pitch": 0.8,
          "sound": "break.copper_bulb"
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.copper_bulb"
        }
      },
      "waxed_oxidized_copper_chain": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.chain",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.chain",
          "volume": 1
        }
      },
      "waxed_oxidized_copper_chest": {
        "break": null,
        "place": null
      },
      "waxed_oxidized_copper_door": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_oxidized_copper_golem_statue": {
        "break": "block.copper_golem_statue.break",
        "place": "block.copper_golem_statue.place"
      },
      "waxed_oxidized_copper_grate": {
        "break": {
          "pitch": 0.8,
          "sound": "break.copper_grate",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.copper_grate",
          "volume": 1
        }
      },
      "waxed_oxidized_copper_lantern": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.lantern.break",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.lantern.place",
          "volume": 1
        }
      },
      "waxed_oxidized_copper_trapdoor": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_oxidized_cut_copper": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_oxidized_cut_copper_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_oxidized_cut_copper_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_oxidized_double_cut_copper_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_oxidized_lightning_rod": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_weathered_chiseled_copper": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_weathered_copper": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_weathered_copper_bars": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_weathered_copper_bulb": {
        "break": {
          "pitch": 0.8,
          "sound": "break.copper_bulb"
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.copper_bulb"
        }
      },
      "waxed_weathered_copper_chain": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.chain",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.chain",
          "volume": 1
        }
      },
      "waxed_weathered_copper_chest": {
        "break": null,
        "place": null
      },
      "waxed_weathered_copper_door": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_weathered_copper_golem_statue": {
        "break": "block.copper_golem_statue.break",
        "place": "block.copper_golem_statue.place"
      },
      "waxed_weathered_copper_grate": {
        "break": {
          "pitch": 0.8,
          "sound": "break.copper_grate",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.copper_grate",
          "volume": 1
        }
      },
      "waxed_weathered_copper_lantern": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.lantern.break",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.lantern.place",
          "volume": 1
        }
      },
      "waxed_weathered_copper_trapdoor": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_weathered_cut_copper": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_weathered_cut_copper_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_weathered_cut_copper_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_weathered_double_cut_copper_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "waxed_weathered_lightning_rod": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "weathered_chiseled_copper": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "weathered_copper": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "weathered_copper_bars": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "weathered_copper_bulb": {
        "break": {
          "pitch": 0.8,
          "sound": "break.copper_bulb"
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.copper_bulb"
        }
      },
      "weathered_copper_chain": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.chain",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.chain",
          "volume": 1
        }
      },
      "weathered_copper_chest": {
        "break": null,
        "place": null
      },
      "weathered_copper_door": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "weathered_copper_golem_statue": {
        "break": "block.copper_golem_statue.break",
        "place": "block.copper_golem_statue.place"
      },
      "weathered_copper_grate": {
        "break": {
          "pitch": 0.8,
          "sound": "break.copper_grate",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.copper_grate",
          "volume": 1
        }
      },
      "weathered_copper_lantern": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.lantern.break",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.lantern.place",
          "volume": 1
        }
      },
      "weathered_copper_trapdoor": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "weathered_cut_copper": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "weathered_cut_copper_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "weathered_cut_copper_stairs": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "weathered_double_cut_copper_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "weathered_lightning_rod": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.copper",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.copper",
          "volume": 1
        }
      },
      "web": {
        "break": {
          "sound": "break.web"
        },
        "place": {
          "sound": "place.web"
        }
      },
      "weeping_vines": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.weeping_vines.break",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "block.weeping_vines.place",
          "volume": 1
        }
      },
      "wet_sponge": {
        "break": {
          "pitch": 0.8,
          "sound": "break.wet_sponge",
          "volume": 1
        },
        "place": {
          "pitch": 0.8,
          "sound": "place.wet_sponge",
          "volume": 1
        }
      },
      "wheat": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "white_candle": {
        "break": {
          "pitch": 1,
          "sound": "dig.candle",
          "volume": 1
        },
        "place": {
          "pitch": 1,
          "sound": "place.candle",
          "volume": 1
        }
      },
      "white_candle_cake": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "white_carpet": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "white_concrete": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "white_concrete_powder": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.sand",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.sand",
          "volume": 1
        }
      },
      "white_glazed_terracotta": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "white_shulker_box": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "white_stained_glass": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "white_stained_glass_pane": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "white_terracotta": {
        "break": null,
        "place": null
      },
      "white_tulip": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "white_wool": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "wildflowers": {
        "break": {
          "sound": "break.pink_petals",
          "volume": 1
        },
        "place": {
          "sound": "place.pink_petals",
          "volume": 1
        }
      },
      "wither_rose": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "wither_skeleton_skull": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "wood": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "wooden_button": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "wooden_door": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "wooden_pressure_plate": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "wooden_slab": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.wood",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            0.8
          ],
          "sound": "place.wood",
          "volume": 1
        }
      },
      "wool": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "yellow_candle": {
        "break": {
          "pitch": 1,
          "sound": "dig.candle",
          "volume": 1
        },
        "place": {
          "pitch": 1,
          "sound": "place.candle",
          "volume": 1
        }
      },
      "yellow_candle_cake": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "yellow_carpet": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "yellow_concrete": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "yellow_concrete_powder": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.sand",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.sand",
          "volume": 1
        }
      },
      "yellow_flower": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.grass",
          "volume": 0.7
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.grass",
          "volume": 0.8
        }
      },
      "yellow_glazed_terracotta": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "yellow_shulker_box": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "yellow_stained_glass": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "yellow_stained_glass_pane": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "random.glass",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      },
      "yellow_terracotta": {
        "break": null,
        "place": null
      },
      "yellow_wool": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.cloth",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.cloth",
          "volume": 1
        }
      },
      "zombie_head": {
        "break": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "dig.stone",
          "volume": 1
        },
        "place": {
          "pitch": [
            0.8,
            1
          ],
          "sound": "place.stone",
          "volume": 1
        }
      }
    };
  }
});

// src/utils.ts
import {
  StructureRotation
} from "@minecraft/server";
function isVectorBetween(vector, vector1, vector2, ignoreY = false) {
  vector = centerVector(vector);
  const startingVector = floorVector(minVectors(vector1, vector2));
  const endingVector = ceilVector(maxVectors(vector1, vector2));
  return vector.x >= startingVector.x && vector.x <= endingVector.x && (ignoreY || vector.y >= startingVector.y && vector.y <= endingVector.y) && vector.z >= startingVector.z && vector.z <= endingVector.z;
}
function formatTypeId(itemTypeId) {
  return capitalizeEveryWord(removeIdentifier(itemTypeId).replace(/_/g, " "));
}
function capitalizeEveryWord(sentence) {
  const words = sentence.split(" ");
  const capitalizedWords = words.map((word) => {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  const capitalizedSentence = capitalizedWords.join(" ");
  return capitalizedSentence;
}
function fix(number, decimalPlaces = 0) {
  return Number(number.toFixed(decimalPlaces));
}
function minVectors(...vectors) {
  return {
    x: Math.min(...vectors.map((vector) => vector.x)),
    y: Math.min(...vectors.map((vector) => vector.y)),
    z: Math.min(...vectors.map((vector) => vector.z))
  };
}
function maxVectors(...vectors) {
  return {
    x: Math.max(...vectors.map((vector) => vector.x)),
    y: Math.max(...vectors.map((vector) => vector.y)),
    z: Math.max(...vectors.map((vector) => vector.z))
  };
}
function floorVector(vector) {
  return {
    x: Math.floor(vector.x),
    y: Math.floor(vector.y),
    z: Math.floor(vector.z)
  };
}
function ceilVector(vector) {
  return {
    x: Math.ceil(vector.x),
    y: Math.ceil(vector.y),
    z: Math.ceil(vector.z)
  };
}
function calculateDistance(v1, v2, ignoreY = false) {
  const dx = v1.x - v2.x;
  const dy = ignoreY ? 0 : v1.y - v2.y;
  const dz = v1.z - v2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
function calculateSquareDistance(v1, v2, ignoreY = false) {
  const dx = Math.abs(v1.x - v2.x);
  const dy = ignoreY ? 0 : Math.abs(v1.y - v2.y);
  const dz = Math.abs(v1.z - v2.z);
  return Math.max(dx, dy, dz);
}
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomItem(list) {
  return list[randomInt(0, list.length - 1)];
}
function vectorToString(vector) {
  return `${vector.x},${vector.y},${vector.z}`;
}
function centerVector(vector, floorY = false) {
  return {
    x: Math.floor(vector.x) + 0.5,
    y: Math.floor(vector.y) + (floorY ? 0 : 0.5),
    z: Math.floor(vector.z) + 0.5
  };
}
function addVectors(...vectors) {
  let x = 0, y = 0, z = 0;
  const len = vectors.length;
  for (let i = 0; i < len; i++) {
    const v = vectors[i];
    x += v.x;
    y += v.y;
    z += v.z;
  }
  return { x, y, z };
}
function addVector(vector, axises, value) {
  const result = {
    x: vector.x,
    y: vector.y,
    z: vector.z
  };
  if (typeof axises === "string") {
    axises = axises.split("");
  }
  for (const axis of axises) {
    if (axis in result) {
      result[axis] += value;
    }
  }
  return result;
}
function multiplyVector(vector, axises, value) {
  const result = {
    x: vector.x,
    y: vector.y,
    z: vector.z
  };
  if (typeof axises === "string") {
    axises = axises.split("");
  }
  for (const axis of axises) {
    if (axis in result) {
      result[axis] *= value;
    }
  }
  return result;
}
function rotationToStructureRotation(rotation) {
  if (rotation === "north") {
    return StructureRotation.None;
  } else if (rotation === "east") {
    return StructureRotation.Rotate90;
  } else if (rotation === "south") {
    return StructureRotation.Rotate180;
  } else if (rotation === "west") {
    return StructureRotation.Rotate270;
  }
  return void 0;
}
function stringToVector(string) {
  const index1 = string.indexOf(",");
  const index2 = string.indexOf(",", index1 + 1);
  return {
    x: Number(string.substring(0, index1)),
    y: Number(string.substring(index1 + 1, index2)),
    z: Number(string.substring(index2 + 1))
  };
}
function subtractLists(list1, list2) {
  const removalSet = new Set(list2);
  const result = [];
  const len1 = list1.length;
  const has = removalSet.has.bind(removalSet);
  for (let i = 0; i < len1; ++i) {
    const item = list1[i];
    if (!has(item)) {
      result.push(item);
    }
  }
  return result;
}
function areVectorsEqual(vector1, vector2) {
  return vector1.x === vector2.x && vector1.y === vector2.y && vector1.z === vector2.z;
}
function directionToVector(direction) {
  switch (direction.toLowerCase()) {
    case "north":
      return { x: 0, y: 0, z: -1 };
    case "south":
      return { x: 0, y: 0, z: 1 };
    case "east":
      return { x: 1, y: 0, z: 0 };
    case "west":
      return { x: -1, y: 0, z: 0 };
    case "up":
      return { x: 0, y: 1, z: 0 };
    case "down":
      return { x: 0, y: -1, z: 0 };
  }
  return { x: 0, y: 0, z: 0 };
}
function getOppositeDirection(direction) {
  switch (direction.toLowerCase()) {
    case "north":
      return "south";
    case "south":
      return "north";
    case "east":
      return "west";
    case "west":
      return "east";
    case "up":
      return "down";
    case "down":
      return "up";
  }
  return void 0;
}
function vectorToDirection(vector) {
  return directionMap[vectorToString(vector)];
}
function subtractVectors(vector1, vector2) {
  return {
    x: vector1.x - vector2.x,
    y: vector1.y - vector2.y,
    z: vector1.z - vector2.z
  };
}
function splitString(input, chunkSize) {
  const length = input.length;
  const count = Math.ceil(length / chunkSize);
  const out = new Array(count);
  let offset = 0;
  for (let i = 0; i < count; ++i) {
    out[i] = input.slice(offset, offset + chunkSize);
    offset += chunkSize;
  }
  return out;
}
function calculateAverage(numbers) {
  if (numbers.length === 0) {
    return 0;
  }
  const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const average = sum / numbers.length;
  return average;
}
function removeIdentifier(string) {
  return string.includes(":") ? string.split(":")[1] : string;
}
function copy(object) {
  if (object === null || typeof object !== "object") {
    return object;
  }
  if (Array.isArray(object)) {
    return object.map(copy);
  }
  const result = {};
  for (const [key, value] of Object.entries(object)) {
    result[key] = copy(value);
  }
  return result;
}
var directionMap;
var init_utils = __esm({
  "src/utils.ts"() {
    "use strict";
    directionMap = {
      "0,0,-1": "north",
      "1,0,0": "east",
      "0,0,1": "south",
      "-1,0,0": "west",
      "0,1,0": "up",
      "0,-1,0": "down",
      "1,0,-1": "northeast",
      "1,0,1": "southeast",
      "-1,0,1": "southwest",
      "-1,0,-1": "northwest",
      "0,1,-1": "northup",
      "1,1,0": "eastup",
      "0,1,1": "southup",
      "-1,1,0": "westup",
      "0,-1,-1": "northdown",
      "1,-1,0": "eastdown",
      "0,-1,1": "southdown",
      "-1,-1,0": "westdown"
    };
  }
});

// src/registry.ts
import {
  BlockTypes,
  DimensionTypes,
  EntityTypes
} from "@minecraft/server";
function lazy(compute) {
  let cached;
  let ready = false;
  return () => {
    if (!ready) {
      cached = compute();
      ready = true;
    }
    return cached;
  };
}
function defineRegistry(definitions) {
  const registry = {};
  for (const key of Object.keys(definitions)) {
    Object.defineProperty(registry, key, {
      get: lazy(definitions[key]),
      enumerable: true
    });
  }
  return registry;
}
var blocks, entities, Registry;
var init_registry = __esm({
  "src/registry.ts"() {
    "use strict";
    init_utils();
    init_variables();
    blocks = (test) => () => Registry.blockTypes.filter(test);
    entities = (test) => () => Registry.entityTypes.filter(test);
    Registry = defineRegistry({
      blockTypes: () => BlockTypes.getAll().map((b) => b.id),
      entityTypes: () => EntityTypes.getAll().map((e) => e.id),
      trapdoorTypes: blocks((id) => id.includes("trapdoor")),
      doorTypes: blocks((id) => id.includes("_door") || id.includes("_fence_gate")),
      slabTypes: blocks((id) => id.includes("_slab") && !id.includes("_double_slab")),
      stairTypes: blocks((id) => id.includes("_stair")),
      fenceTypes: blocks((id) => id.includes("_fence") || id.includes("_wall") && !id.includes("_sign") && !id.includes("_fan")),
      saplingTypes: blocks((id) => id.includes("_sapling")),
      logTypes: blocks((id) => id.includes("_log") && !id.includes("stripped_")),
      leafTypes: blocks((id) => id.includes("_leaves")),
      villagerTypes: entities((id) => id.startsWith("tektopia:")),
      noWalkBlocks: () => [...Registry.fenceTypes, ...Registry.doorTypes, ...Registry.trapdoorTypes],
      solidBlocks: () => subtractLists(subtractLists(Registry.blockTypes, minecraftNonSolidBlocks), Registry.noWalkBlocks),
      solidBlocksSet: () => new Set(Registry.solidBlocks),
      lumberjackPickups: () => ["minecraft:apple", ...Registry.saplingTypes, ...Registry.logTypes],
      dimensionTypes: () => DimensionTypes.getAll().map((dimensionType) => dimensionType.typeId)
    });
  }
});

// src/village.ts
import {
  system,
  World,
  world
} from "@minecraft/server";
function packUnsigned(values) {
  let result = "";
  for (let i = 0; i < values.length; i++) {
    let value = values[i];
    while (value >= 32) {
      result += DIGITS[value % 32 + 32];
      value = Math.floor(value / 32);
    }
    result += DIGITS[value];
  }
  return result;
}
function unpackUnsigned(text) {
  const result = [];
  let value = 0;
  let scale = 1;
  for (let i = 0; i < text.length; i++) {
    const digit = DIGIT_VALUES[text[i]];
    value += (digit & 31) * scale;
    if (digit >= 32) {
      scale *= 32;
    } else {
      result.push(value);
      value = 0;
      scale = 1;
    }
  }
  return result;
}
function zigzag(value) {
  return value >= 0 ? value * 2 : -value * 2 - 1;
}
function unzigzag(value) {
  return value % 2 === 0 ? value / 2 : -(value + 1) / 2;
}
function packSigned(values) {
  return packUnsigned(values.map((value) => zigzag(value)));
}
function unpackSigned(text) {
  return unpackUnsigned(text).map((value) => unzigzag(value));
}
function comparePoints(a, b) {
  return a.x - b.x || a.z - b.z || a.y - b.y;
}
function packPoints(sortedPoints, origin) {
  if (sortedPoints.length === 0) {
    return "";
  }
  const dx = new Array(sortedPoints.length);
  const dy = new Array(sortedPoints.length);
  const dz = new Array(sortedPoints.length);
  let px = origin.x;
  let py = origin.y;
  let pz = origin.z;
  for (let i = 0; i < sortedPoints.length; i++) {
    const point = sortedPoints[i];
    dx[i] = point.x - px;
    dy[i] = point.y - py;
    dz[i] = point.z - pz;
    px = point.x;
    py = point.y;
    pz = point.z;
  }
  return packSigned(dx) + "." + packSigned(dz) + "." + packSigned(dy);
}
function unpackPoints(text, origin) {
  if (text === "") {
    return [];
  }
  const [xText, zText, yText] = text.split(".");
  const dx = unpackSigned(xText);
  const dz = unpackSigned(zText);
  const dy = unpackSigned(yText);
  const points = new Array(dx.length);
  let x = origin.x;
  let y = origin.y;
  let z = origin.z;
  for (let i = 0; i < dx.length; i++) {
    x += dx[i];
    y += dy[i];
    z += dz[i];
    points[i] = { x, y, z };
  }
  return points;
}
function packLocations(locationList, origin) {
  const points = locationList.map((location) => stringToVector(location));
  points.sort(comparePoints);
  return packPoints(points, origin);
}
function unpackLocations(text, origin) {
  return unpackPoints(text, origin).map((point) => vectorToString(point));
}
function originOf(center) {
  return { x: Math.floor(center.x), y: Math.floor(center.y), z: Math.floor(center.z) };
}
function offsetIndex(dx, dy, dz) {
  const index = (dx + 1) * 9 + (dz + 1) * 3 + (dy + 1);
  return index > 13 ? index - 1 : index;
}
function offsetKey(location, offset) {
  return vectorToString({
    x: location.x + offset.x,
    y: location.y + offset.y,
    z: location.z + offset.z
  });
}
function blockIsTree(block) {
  const aboveBlock = block.aboveSafe();
  if (!Registry.logTypes.includesFast(block.typeId)) {
    return false;
  }
  if (aboveBlock === void 0 || aboveBlock.typeId !== block.typeId) {
    return false;
  }
  const aboveAboveBlock = aboveBlock.aboveSafe();
  if (aboveAboveBlock === void 0 || aboveAboveBlock.typeId !== block.typeId) {
    return false;
  }
  const belowBlock = block.belowSafe();
  if (belowBlock === void 0 || !minecraftDirtTypes.includesFast(belowBlock.typeId)) {
    return false;
  }
  return true;
}
function tickScanVillage() {
  system.runJob(scanVillageBlocks(tickScanVillage));
}
function* scanVillageBlocks(callback) {
  try {
    if (!world.loadedData) {
      return;
    }
    const villageList = world.getVillages();
    for (const village of villageList) {
      const locationString = randomItem(Object.keys(village.pathNodes));
      const locationStringList = [locationString];
      const alreadyCheckedLocations = /* @__PURE__ */ new Set();
      while (locationStringList.length) {
        const locationString2 = locationStringList.pop();
        if (alreadyCheckedLocations.has(locationString2) || locationString2 === void 0) {
          continue;
        }
        alreadyCheckedLocations.add(locationString2);
        const node = village.pathNodes[locationString2];
        const location = stringToVector(locationString2);
        const dimension = world.getDimension(village.dimensionId);
        const block = dimension.getBlockSafe(location);
        if (block === void 0 || node === void 0) {
          continue;
        }
        try {
          dimension.spawnParticle(
            "minecraft:basic_flame_particle",
            centerVector(block)
          );
        } catch {
        }
        try {
          const checkBlockList = [
            block,
            block.northSafe(),
            block.eastSafe(),
            block.southSafe(),
            block.westSafe(),
            block.belowSafe()
          ];
          for (let i = 0; i < checkBlockList.length; i++) {
            const checkBlock = checkBlockList[i];
            if (checkBlock === void 0) {
              continue;
            }
            let checkNearbyNodes = false;
            const checkBlockString = vectorToString(checkBlock);
            if (blockIsFarm(checkBlock)) {
              checkNearbyNodes = true;
              if (!village.farmLocations.includes(checkBlockString)) {
                village.farmLocations.push(checkBlockString);
              }
            } else if (checkBlock.typeId === "minecraft:reeds") {
              checkNearbyNodes = true;
              if (!village.sugarCaneLocations.includes(checkBlockString)) {
                village.sugarCaneLocations.push(checkBlockString);
              }
            } else if (Registry.saplingTypes.includesFast(checkBlock.typeId)) {
              checkNearbyNodes = true;
              if (!village.saplingLocations.includes(checkBlockString)) {
                village.saplingLocations.push(checkBlockString);
              }
            } else if (blockIsTree(checkBlock)) {
              checkNearbyNodes = true;
              if (!village.treeLocations.includes(checkBlockString)) {
                village.treeLocations.push(checkBlockString);
              }
            }
            if (checkNearbyNodes) {
              locationStringList.push(...node.neighbors);
            }
          }
        } catch {
        }
        yield;
      }
      yield;
    }
  } finally {
    if (callback) {
      callback();
    }
  }
}
function blockIsFarm(block) {
  const blockAbove = block.aboveSafe();
  if (blockAbove === void 0) {
    return false;
  }
  const blockAboveAbove = blockAbove.aboveSafe();
  if (blockAboveAbove === void 0) {
    return false;
  }
  return block.typeId === "minecraft:farmland" && blockAbove.isAir && blockAboveAbove.isAir;
}
var SAVE_PATH_NODES, SAVE_RESOURCE_LOCATIONS, NAMESPACE, DIGITS, DIGIT_VALUES, NEIGHBOR_OFFSETS, FORWARD_START, VILLAGE_RADIUS, Village;
var init_village = __esm({
  "src/village.ts"() {
    "use strict";
    init_utils();
    init_variables();
    init_registry();
    SAVE_PATH_NODES = true;
    SAVE_RESOURCE_LOCATIONS = true;
    NAMESPACE = "minecraft:";
    DIGITS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    DIGIT_VALUES = {};
    for (let i = 0; i < DIGITS.length; i++) {
      DIGIT_VALUES[DIGITS[i]] = i;
    }
    NEIGHBOR_OFFSETS = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dz = -1; dz <= 1; dz++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx !== 0 || dy !== 0 || dz !== 0) {
            NEIGHBOR_OFFSETS.push({ x: dx, y: dy, z: dz });
          }
        }
      }
    }
    FORWARD_START = 13;
    VILLAGE_RADIUS = 100;
    Village = class _Village {
      constructor(data) {
        this.data = data;
        this.center = data.center;
        this.centerString = vectorToString(data.center);
        this.bounds = {
          start: { x: data.center.x - VILLAGE_RADIUS, y: -64, z: data.center.z - VILLAGE_RADIUS },
          end: { x: data.center.x + VILLAGE_RADIUS, y: 320, z: data.center.z + VILLAGE_RADIUS }
        };
      }
      data;
      static cache = /* @__PURE__ */ new WeakMap();
      center;
      centerString;
      bounds;
      searchingBlocks = false;
      deletingInvalidNodes = false;
      static from(data) {
        let village = _Village.cache.get(data);
        if (!village) {
          village = new _Village(data);
          _Village.cache.set(data, village);
        }
        return village;
      }
      static createData(center, dimensionId, doorLocation) {
        return {
          center,
          dimensionId,
          doorLocation,
          pathNodes: {},
          sugarCaneLocations: [],
          saplingLocations: [],
          farmLocations: [],
          treeLocations: []
        };
      }
      static compress(data) {
        const center = data.center;
        const origin = originOf(center);
        const nodeEntries = SAVE_PATH_NODES ? Object.keys(data.pathNodes).map((key) => ({ key, location: stringToVector(key) })) : [];
        nodeEntries.sort((a, b) => comparePoints(a.location, b.location));
        const indexByKey = /* @__PURE__ */ new Map();
        for (let i = 0; i < nodeEntries.length; i++) {
          indexByKey.set(nodeEntries[i].key, i);
        }
        const forwardMasks = new Array(nodeEntries.length).fill(0);
        const requirementGroups = /* @__PURE__ */ new Map();
        for (let i = 0; i < nodeEntries.length; i++) {
          const { key, location } = nodeEntries[i];
          const node = data.pathNodes[key];
          for (let j = 0; j < node.neighbors.length; j++) {
            const neighborKey = node.neighbors[j];
            const neighborIndex = indexByKey.get(neighborKey);
            if (neighborIndex === void 0) {
              continue;
            }
            const neighbor = nodeEntries[neighborIndex].location;
            const dx = neighbor.x - location.x;
            const dy = neighbor.y - location.y;
            const dz = neighbor.z - location.z;
            if (Math.abs(dx) > 1 || Math.abs(dy) > 1 || Math.abs(dz) > 1) {
              continue;
            }
            if (dx === 0 && dy === 0 && dz === 0) {
              continue;
            }
            const bit = offsetIndex(dx, dy, dz);
            if (bit >= FORWARD_START) {
              forwardMasks[i] |= 1 << bit - FORWARD_START;
            } else if (!data.pathNodes[neighborKey].neighbors.includes(key)) {
              forwardMasks[neighborIndex] |= 1 << offsetIndex(-dx, -dy, -dz) - FORWARD_START;
            }
          }
          const requirement = node.requirement;
          if (requirement !== void 0) {
            const types = requirement.types.slice().sort();
            const groupKey = (requirement.whiteList ? "1" : "0") + types.join(",");
            let group = requirementGroups.get(groupKey);
            if (group === void 0) {
              group = { whiteList: requirement.whiteList ? 1 : 0, types, deltas: [], last: 0 };
              requirementGroups.set(groupKey, group);
            }
            group.deltas.push(i - group.last);
            group.last = i;
          }
        }
        const maskCounts = /* @__PURE__ */ new Map();
        for (let i = 0; i < forwardMasks.length; i++) {
          maskCounts.set(forwardMasks[i], (maskCounts.get(forwardMasks[i]) ?? 0) + 1);
        }
        const palette = [...maskCounts.keys()].sort(
          (a, b) => maskCounts.get(b) - maskCounts.get(a) || a - b
        );
        const paletteIndexByMask = /* @__PURE__ */ new Map();
        for (let i = 0; i < palette.length; i++) {
          paletteIndexByMask.set(palette[i], i);
        }
        const maskIndices = forwardMasks.map((mask) => paletteIndexByMask.get(mask));
        const nodeRequirements = [];
        for (const group of requirementGroups.values()) {
          nodeRequirements.push([group.whiteList, group.types, packUnsigned(group.deltas)]);
        }
        const dimensionId = data.dimensionId;
        const door = data.doorLocation;
        return [
          dimensionId.startsWith(NAMESPACE) ? dimensionId.slice(NAMESPACE.length) : dimensionId,
          [center.x, center.y, center.z],
          [door.x - origin.x, door.y - origin.y, door.z - origin.z],
          SAVE_RESOURCE_LOCATIONS ? packLocations(data.sugarCaneLocations, origin) : "",
          SAVE_RESOURCE_LOCATIONS ? packLocations(data.saplingLocations, origin) : "",
          SAVE_RESOURCE_LOCATIONS ? packLocations(data.farmLocations, origin) : "",
          SAVE_RESOURCE_LOCATIONS ? packLocations(data.treeLocations, origin) : "",
          packPoints(nodeEntries.map((entry) => entry.location), origin),
          packUnsigned(palette),
          packUnsigned(maskIndices),
          nodeRequirements
        ];
      }
      static decompress(compressed) {
        const [
          dimensionId,
          centerTriple,
          doorTriple,
          sugarCaneText,
          saplingText,
          farmText,
          treeText,
          nodeText,
          paletteText,
          maskIndexText
        ] = compressed;
        const nodeRequirements = compressed[compressed.length - 1];
        const center = { x: centerTriple[0], y: centerTriple[1], z: centerTriple[2] };
        const origin = originOf(center);
        const points = unpackPoints(nodeText, origin);
        const keys = points.map((point) => vectorToString(point));
        const pathNodes = {};
        for (let i = 0; i < keys.length; i++) {
          pathNodes[keys[i]] = { neighbors: [] };
        }
        const palette = unpackUnsigned(paletteText);
        const maskIndices = unpackUnsigned(maskIndexText);
        for (let i = 0; i < points.length; i++) {
          const mask = palette[maskIndices[i]];
          if (!mask) {
            continue;
          }
          const node = pathNodes[keys[i]];
          for (let bit = 0; bit < 13; bit++) {
            if (!(mask & 1 << bit)) {
              continue;
            }
            const neighborKey = offsetKey(points[i], NEIGHBOR_OFFSETS[FORWARD_START + bit]);
            const neighborNode = pathNodes[neighborKey];
            if (neighborNode === void 0) {
              continue;
            }
            node.neighbors.push(neighborKey);
            neighborNode.neighbors.push(keys[i]);
          }
        }
        for (let i = 0; i < nodeRequirements.length; i++) {
          const [whiteList, types, deltaText] = nodeRequirements[i];
          const deltas = unpackUnsigned(deltaText);
          let index = 0;
          for (let j = 0; j < deltas.length; j++) {
            index += deltas[j];
            const node = pathNodes[keys[index]];
            if (node !== void 0) {
              node.requirement = { whiteList: whiteList === 1, types: types.slice() };
            }
          }
        }
        return {
          dimensionId: dimensionId.includes(":") ? dimensionId : NAMESPACE + dimensionId,
          center,
          doorLocation: {
            x: doorTriple[0] + origin.x,
            y: doorTriple[1] + origin.y,
            z: doorTriple[2] + origin.z
          },
          pathNodes,
          sugarCaneLocations: unpackLocations(sugarCaneText, origin),
          saplingLocations: unpackLocations(saplingText, origin),
          farmLocations: unpackLocations(farmText, origin),
          treeLocations: unpackLocations(treeText, origin)
        };
      }
      get dimensionId() {
        return this.data.dimensionId;
      }
      get doorLocation() {
        return this.data.doorLocation;
      }
      get pathNodes() {
        return this.data.pathNodes;
      }
      get sugarCaneLocations() {
        return this.data.sugarCaneLocations;
      }
      get saplingLocations() {
        return this.data.saplingLocations;
      }
      get farmLocations() {
        return this.data.farmLocations;
      }
      get treeLocations() {
        return this.data.treeLocations;
      }
      get dimension() {
        return world.getDimension(this.data.dimensionId);
      }
      get isValid() {
        return world.villageList.includes(this.data);
      }
      link(aKey, bKey) {
        const village = this;
        if (aKey === bKey) {
          return;
        }
        const node1 = village.pathNodes[aKey];
        const node2 = village.pathNodes[bKey];
        if (!node1 || !node2) {
          return;
        }
        if (!node1.neighbors.includes(bKey)) {
          node1.neighbors.push(bKey);
        }
        if (!node2.neighbors.includes(aKey)) {
          node2.neighbors.push(aKey);
        }
      }
      unlink(aKey, bKey) {
        const village = this;
        const node1 = village.pathNodes[aKey];
        const node2 = village.pathNodes[bKey];
        if (node1) {
          node1.neighbors = node1.neighbors.filter((k) => k !== bKey);
        }
        if (node2) {
          node2.neighbors = node2.neighbors.filter((k) => k !== aKey);
        }
      }
      removeNode(key) {
        const village = this;
        const node = village.pathNodes[key];
        if (!node) {
          return;
        }
        for (const neighborKey of [...node.neighbors]) {
          this.unlink(key, neighborKey);
        }
        delete village.pathNodes[key];
      }
    };
    World.prototype.getVillages = function() {
      return this.villageList.map((data) => Village.from(data));
    };
    system.run(tickScanVillage);
  }
});

// src/variables.ts
var worldSaveDataList, pathCancelEntityTypes, pathIgnoreEntityTypes, minecraftDirtTypes, minecraftDangerousBlockTypes, minecraftNonSolidBlocks;
var init_variables = __esm({
  "src/variables.ts"() {
    "use strict";
    init_village();
    worldSaveDataList = [
      {
        property: "itemFrameList",
        default: [],
        compression: void 0
      },
      {
        property: "villageList",
        default: [],
        compression: {
          compress: (value) => value.map((v) => Village.compress(v)),
          decompress: (value) => {
            const villages = [];
            for (const compressed of value) {
              try {
                villages.push(Village.decompress(compressed));
              } catch (error) {
                console.error("Skipping unreadable village:", error);
              }
            }
            return villages;
          }
        }
      }
    ];
    pathCancelEntityTypes = [
      "minecraft:chest_boat",
      "minecraft:boat",
      "minecraft:minecart",
      "minecraft:command_block_minecart",
      "minecraft:chest_minecart",
      "minecraft:tnt_minecart",
      "minecraft:hopper_minecart"
    ];
    pathIgnoreEntityTypes = [
      "minecraft:fishing_hook",
      "minecraft:ice_bomb",
      "minecraft:balloon",
      "minecraft:wind_charge_projectile",
      "minecraft:egg",
      "minecraft:small_fireball",
      "minecraft:ender_crystal",
      "minecraft:wither_skull_dangerous",
      "minecraft:wither_skull",
      "minecraft:thrown_trident",
      "minecraft:fireball",
      "minecraft:dragon_fireball",
      "minecraft:breeze_wind_charge_projectile",
      "minecraft:arrow",
      "minecraft:ominous_item_spawner",
      "minecraft:llama_spit",
      "minecraft:xp_orb",
      "minecraft:shulker_bullet",
      "minecraft:xp_bottle",
      "minecraft:tnt",
      "minecraft:splash_potion",
      "minecraft:lingering_potion",
      "minecraft:snowball",
      "minecraft:ender_pearl",
      "minecraft:armor_stand",
      "minecraft:lightning_bolt",
      "minecraft:tripod_camera",
      "minecraft:fireworks_rocket",
      "minecraft:eye_of_ender_signal",
      "minecraft:area_effect_cloud",
      "minecraft:item"
    ];
    minecraftDirtTypes = [
      "minecraft:mycelium",
      "minecraft:pale_moss_block",
      "minecraft:coarse_dirt",
      "minecraft:podzol",
      "minecraft:muddy_mangrove_roots",
      "minecraft:farmland",
      "minecraft:dirt_with_roots",
      "minecraft:dirt",
      "minecraft:grass_block",
      "minecraft:moss_block",
      "minecraft:mud"
    ];
    minecraftDangerousBlockTypes = [
      "minecraft:lava",
      "minecraft:flowing_lava",
      "minecraft:water",
      "minecraft:flowing_water",
      "minecraft:magma",
      "minecraft:fire",
      "minecraft:soul_fire",
      "minecraft:cactus",
      "minecraft:powder_snow",
      "minecraft:campfire",
      "minecraft:soul_campfire",
      "minecraft:sweet_berry_bush"
    ];
    minecraftNonSolidBlocks = [
      "minecraft:glow_lichen",
      "minecraft:glow_frame",
      "minecraft:frame",
      "minecraft:pink_tulip",
      "minecraft:detector_rail",
      "minecraft:zombie_head",
      "minecraft:cornflower",
      "minecraft:leaf_litter",
      "minecraft:dead_bubble_coral_wall_fan",
      "minecraft:blue_carpet",
      "minecraft:vine",
      "minecraft:cyan_carpet",
      "minecraft:cactus_flower",
      "minecraft:pale_moss_carpet",
      "minecraft:white_tulip",
      "minecraft:open_eyeblossom",
      "minecraft:brown_mushroom",
      "minecraft:powder_snow",
      "minecraft:dead_horn_coral_wall_fan",
      "minecraft:dead_bubble_coral_fan",
      "minecraft:powered_repeater",
      "minecraft:hanging_roots",
      "minecraft:light_block_1",
      "minecraft:azure_bluet",
      "minecraft:snow_layer",
      "minecraft:white_carpet",
      "minecraft:creeper_head",
      "minecraft:bubble_coral_fan",
      "minecraft:nether_wart",
      "minecraft:gray_carpet",
      "minecraft:wheat",
      "minecraft:lily_of_the_valley",
      "minecraft:blue_orchid",
      "minecraft:dead_brain_coral_fan",
      "minecraft:seagrass",
      "minecraft:tube_coral_fan",
      "minecraft:big_dripleaf",
      "minecraft:dead_horn_coral",
      "minecraft:magenta_carpet",
      "minecraft:pitcher_crop",
      "minecraft:redstone_wire",
      "minecraft:firefly_bush",
      "minecraft:fern",
      "minecraft:poppy",
      "minecraft:moss_carpet",
      "minecraft:warped_fungus",
      "minecraft:melon_stem",
      "minecraft:flower_pot",
      "minecraft:short_grass",
      "minecraft:activator_rail",
      "minecraft:potatoes",
      "minecraft:soul_torch",
      "minecraft:allium",
      "minecraft:lava",
      "minecraft:light_block_14",
      "minecraft:powered_comparator",
      "minecraft:light_block_8",
      "minecraft:spruce_sapling",
      "minecraft:dark_oak_sapling",
      "minecraft:pale_oak_sapling",
      "minecraft:soul_fire",
      "minecraft:pink_petals",
      "minecraft:pink_carpet",
      "minecraft:brown_carpet",
      "minecraft:brain_coral",
      "minecraft:orange_carpet",
      "minecraft:pitcher_plant",
      "minecraft:unlit_redstone_torch",
      "minecraft:light_block_9",
      "minecraft:light_block_7",
      "minecraft:light_block_6",
      "minecraft:light_block_5",
      "minecraft:light_block_4",
      "minecraft:warped_roots",
      "minecraft:small_dripleaf_block",
      "minecraft:light_block_3",
      "minecraft:light_block_2",
      "minecraft:light_block_0",
      "minecraft:unpowered_repeater",
      "minecraft:oak_sapling",
      "minecraft:fire_coral",
      "minecraft:bush",
      "minecraft:kelp",
      "minecraft:dead_fire_coral_wall_fan",
      "minecraft:sea_pickle",
      "minecraft:flowering_azalea",
      "minecraft:brain_coral_fan",
      "minecraft:torch",
      "minecraft:water",
      "minecraft:torchflower",
      "minecraft:colored_torch_red",
      "minecraft:spore_blossom",
      "minecraft:waterlily",
      "minecraft:redstone_torch",
      "minecraft:tube_coral_wall_fan",
      "minecraft:light_block_13",
      "minecraft:horn_coral",
      "minecraft:player_head",
      "minecraft:light_block_10",
      "minecraft:rose_bush",
      "minecraft:green_carpet",
      "minecraft:compound_creator",
      "minecraft:dead_brain_coral_wall_fan",
      "minecraft:light_block_12",
      "minecraft:rail",
      "minecraft:carrots",
      "minecraft:brain_coral_wall_fan",
      "minecraft:short_dry_grass",
      "minecraft:pale_hanging_moss",
      "minecraft:bubble_coral",
      "minecraft:dead_tube_coral",
      "minecraft:light_block_11",
      "minecraft:colored_torch_blue",
      "minecraft:flowing_lava",
      "minecraft:skeleton_skull",
      "minecraft:frog_spawn",
      "minecraft:horn_coral_wall_fan",
      "minecraft:chorus_flower",
      "minecraft:torchflower_crop",
      "minecraft:lab_table",
      "minecraft:element_constructor",
      "minecraft:wildflowers",
      "minecraft:colored_torch_purple",
      "minecraft:red_mushroom",
      "minecraft:black_carpet",
      "minecraft:bubble_column",
      "minecraft:sunflower",
      "minecraft:wither_rose",
      "minecraft:deadbush",
      "minecraft:flowing_water",
      "minecraft:cave_vines",
      "minecraft:light_blue_carpet",
      "minecraft:beetroot",
      "minecraft:tall_dry_grass",
      "minecraft:golden_rail",
      "minecraft:fire_coral_wall_fan",
      "minecraft:dead_brain_coral",
      "minecraft:weeping_vines",
      "minecraft:chorus_plant",
      "minecraft:pumpkin_stem",
      "minecraft:lever",
      "minecraft:twisting_vines",
      "minecraft:reeds",
      "minecraft:end_rod",
      "minecraft:dragon_head",
      "minecraft:cave_vines_body_with_berries",
      "minecraft:oxeye_daisy",
      "minecraft:yellow_carpet",
      "minecraft:tripwire_hook",
      "minecraft:large_fern",
      "minecraft:sweet_berry_bush",
      "minecraft:piglin_head",
      "minecraft:jungle_sapling",
      "minecraft:web",
      "minecraft:cocoa",
      "minecraft:fire",
      "minecraft:dead_fire_coral",
      "minecraft:acacia_sapling",
      "minecraft:unpowered_comparator",
      "minecraft:tall_grass",
      "minecraft:light_block_15",
      "minecraft:nether_sprouts",
      "minecraft:dead_horn_coral_fan",
      "minecraft:wither_skeleton_skull",
      "minecraft:horn_coral_fan",
      "minecraft:colored_torch_green",
      "minecraft:purple_carpet",
      "minecraft:fire_coral_fan",
      "minecraft:air",
      "minecraft:dead_tube_coral_fan",
      "minecraft:lime_carpet",
      "minecraft:closed_eyeblossom",
      "minecraft:dead_fire_coral_fan",
      "minecraft:bubble_coral_wall_fan",
      "minecraft:orange_tulip",
      "minecraft:azalea",
      "minecraft:mangrove_propagule",
      "minecraft:dead_bubble_coral",
      "minecraft:cherry_sapling",
      "minecraft:lilac",
      "minecraft:red_carpet",
      "minecraft:red_tulip",
      "minecraft:trip_wire",
      "minecraft:cave_vines_head_with_berries",
      "minecraft:dead_tube_coral_wall_fan",
      "minecraft:birch_sapling",
      "minecraft:bamboo_sapling",
      "minecraft:crimson_roots",
      "minecraft:light_gray_carpet",
      "minecraft:crimson_fungus",
      "minecraft:tube_coral",
      "minecraft:peony",
      "minecraft:material_reducer",
      "minecraft:dandelion",
      "minecraft:pink_tulip",
      "minecraft:cornflower",
      "minecraft:white_tulip",
      "minecraft:azure_bluet",
      "minecraft:lily_of_the_valley",
      "minecraft:blue_orchid",
      "minecraft:poppy",
      "minecraft:allium",
      "minecraft:oxeye_daisy",
      "minecraft:orange_tulip",
      "minecraft:red_tulip",
      "minecraft:dandelion",
      "minecraft:wheat",
      "minecraft:pitcher_crop",
      "minecraft:potatoes",
      "minecraft:carrots",
      "minecraft:torchflower_crop",
      "minecraft:beetroot",
      "minecraft:pitcher_crop",
      "minecraft:spruce_sapling",
      "minecraft:dark_oak_sapling",
      "minecraft:pitcher_plant",
      "minecraft:oak_sapling",
      "minecraft:rose_bush",
      "minecraft:sunflower",
      "minecraft:large_fern",
      "minecraft:jungle_sapling",
      "minecraft:acacia_sapling",
      "minecraft:tall_grass",
      "minecraft:lilac",
      "minecraft:birch_sapling",
      "minecraft:peony",
      "minecraft:acacia_wall_sign",
      "minecraft:birch_standing_sign",
      "minecraft:spruce_standing_sign",
      "minecraft:warped_wall_sign",
      "minecraft:darkoak_wall_sign",
      "minecraft:cherry_hanging_sign",
      "minecraft:crimson_wall_sign",
      "minecraft:pale_oak_hanging_sign",
      "minecraft:acacia_standing_sign",
      "minecraft:dark_oak_hanging_sign",
      "minecraft:pale_oak_wall_sign",
      "minecraft:darkoak_standing_sign",
      "minecraft:jungle_wall_sign",
      "minecraft:warped_hanging_sign",
      "minecraft:birch_hanging_sign",
      "minecraft:wall_sign",
      "minecraft:acacia_hanging_sign",
      "minecraft:jungle_hanging_sign",
      "minecraft:mangrove_standing_sign",
      "minecraft:bamboo_hanging_sign",
      "minecraft:warped_standing_sign",
      "minecraft:oak_hanging_sign",
      "minecraft:mangrove_wall_sign",
      "minecraft:spruce_wall_sign",
      "minecraft:standing_sign",
      "minecraft:spruce_hanging_sign",
      "minecraft:cherry_standing_sign",
      "minecraft:mangrove_hanging_sign",
      "minecraft:jungle_standing_sign",
      "minecraft:pale_oak_standing_sign",
      "minecraft:birch_wall_sign",
      "minecraft:bamboo_wall_sign",
      "minecraft:crimson_hanging_sign",
      "minecraft:bamboo_standing_sign",
      "minecraft:crimson_standing_sign",
      "minecraft:cherry_wall_sign",
      "minecraft:detector_rail",
      "minecraft:activator_rail",
      "minecraft:rail",
      "minecraft:golden_rail",
      "minecraft:torch",
      "minecraft:soul_torch"
    ];
  }
});

// src/villager.ts
import {
  Entity,
  EntityComponentTypes,
  system as system2,
  World as World2,
  world as world2
} from "@minecraft/server";
function destroyTree(startingBlock, callback) {
  system2.runJob(destroyTreeGenerator());
  function* destroyTreeGenerator() {
    try {
      let currentBlock = startingBlock;
      const logType = removeIdentifier(startingBlock.typeId).replace("_log", "");
      const logTypeId = `minecraft:${logType}_log`;
      const leafTypeId = `minecraft:${logType}_leaves`;
      const logBlocks = [startingBlock];
      const checkLogBlocks = [];
      const y = 0;
      for (let x = -1; x <= 1; x++) {
        for (let z = -1; z <= 1; z++) {
          checkLogBlocks.push(startingBlock.offsetSafe({ x, y, z }));
        }
      }
      const checkLeafBlocks = [];
      let logChecks = 0;
      while (true) {
        currentBlock = currentBlock.aboveSafe();
        if (currentBlock === void 0 || currentBlock.typeId !== logTypeId) {
          break;
        }
        if (currentBlock.permutation.getState("pillar_axis") !== "y") {
          break;
        }
        logBlocks.push(currentBlock);
        checkLeafBlocks.push(
          currentBlock.aboveSafe(),
          currentBlock.belowSafe(),
          currentBlock.northSafe(),
          currentBlock.eastSafe(),
          currentBlock.southSafe(),
          currentBlock.westSafe()
        );
        for (let x = -1; x <= 1; x++) {
          for (let z = -1; z <= 1; z++) {
            checkLogBlocks.push(currentBlock.offsetSafe({ x, y, z }));
          }
        }
        if (++logChecks % 10 === 0) {
          yield;
        }
      }
      let alreadyCheckedLocations = /* @__PURE__ */ new Set();
      let sideLogChecks = 0;
      while (checkLogBlocks.length > 0) {
        const checkBlock = checkLogBlocks.pop();
        if (checkBlock === void 0) {
          continue;
        }
        const checkBlockString = vectorToString(checkBlock);
        if (alreadyCheckedLocations.has(checkBlockString)) {
          continue;
        }
        alreadyCheckedLocations.add(checkBlockString);
        if (checkBlock.typeId !== logTypeId) {
          continue;
        }
        if (checkBlock.permutation.getState("pillar_axis") === "y") {
          continue;
        }
        logBlocks.push(checkBlock);
        checkLeafBlocks.push(
          checkBlock.aboveSafe(),
          checkBlock.belowSafe(),
          checkBlock.northSafe(),
          checkBlock.eastSafe(),
          checkBlock.southSafe(),
          checkBlock.westSafe()
        );
        for (let x = -1; x <= 1; x++) {
          for (let y2 = 0; y2 <= 1; y2++) {
            for (let z = -1; z <= 1; z++) {
              checkLogBlocks.push(checkBlock.offsetSafe({ x, y: y2, z }));
            }
          }
        }
        if (++sideLogChecks % 10 === 0) {
          yield;
        }
      }
      alreadyCheckedLocations = /* @__PURE__ */ new Set();
      const leafBlocks = [];
      const logBlockLocations = logBlocks.map((block) => block.location);
      let leafChecks = 0;
      while (checkLeafBlocks.length > 0) {
        const checkBlock = checkLeafBlocks.pop();
        if (checkBlock === void 0) {
          continue;
        }
        const checkBlockString = vectorToString(checkBlock);
        if (alreadyCheckedLocations.has(checkBlockString)) {
          continue;
        }
        alreadyCheckedLocations.add(checkBlockString);
        if (checkBlock.typeId !== leafTypeId) {
          continue;
        }
        if (checkBlock.permutation.getState("persistent_bit")) {
          continue;
        }
        let closestLogLocation;
        const maxDistance = 4;
        let closestDistance = maxDistance + 1;
        outer: for (let dx = -maxDistance; dx <= maxDistance; dx++) {
          for (let dy = -maxDistance; dy <= maxDistance; dy++) {
            for (let dz = -maxDistance; dz <= maxDistance; dz++) {
              if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) > maxDistance) {
                continue;
              }
              const block = checkBlock.offsetSafe({ x: dx, y: dy, z: dz });
              if (!block) {
                continue;
              }
              const distance = calculateDistance(block, checkBlock);
              if (block.typeId === logTypeId && distance < closestDistance) {
                closestLogLocation = block.location;
                closestDistance = distance;
                if (closestDistance === 1) {
                  break outer;
                }
              }
            }
          }
        }
        if (!closestLogLocation) {
          continue;
        }
        if (!logBlockLocations.some(
          (loc) => areVectorsEqual(closestLogLocation, loc)
        )) {
          continue;
        }
        leafBlocks.push(checkBlock);
        checkLeafBlocks.push(
          checkBlock.aboveSafe(),
          checkBlock.belowSafe(),
          checkBlock.northSafe(),
          checkBlock.eastSafe(),
          checkBlock.southSafe(),
          checkBlock.westSafe()
        );
        if (++leafChecks % 3 === 0) {
          yield;
        }
      }
      const blockList = logBlocks.concat(leafBlocks);
      const blocksToUpdate = [];
      const checkedBlocks = /* @__PURE__ */ new Set();
      for (let i = 0; i < blockList.length; i++) {
        const block = blockList[i];
        block.destroy();
        const updateBlockList = [block, block.aboveSafe(), block.belowSafe()];
        for (let j = 0; j < updateBlockList.length; j++) {
          const block2 = updateBlockList[j];
          if (block2 === void 0) {
            continue;
          }
          const list = [block2, block2.aboveSafe()];
          for (let k = 0; k < list.length; k++) {
            const block3 = list[k];
            if (block3 === void 0) {
              continue;
            }
            const blockString = vectorToString(block3);
            if (!checkedBlocks.has(blockString)) {
              checkedBlocks.add(blockString);
              blocksToUpdate.push(block3, block3.aboveSafe());
            }
          }
        }
        if (i % 3 === 0) {
          yield;
        }
      }
      updatePathNodes(blocksToUpdate.filter((block) => block !== void 0));
    } finally {
      if (callback !== void 0) {
        callback();
      }
    }
  }
}
var originalFunctions, villagerCache, Villager, globalTasks, tektopiaVillagers;
var init_villager = __esm({
  "src/villager.ts"() {
    "use strict";
    init_utils();
    init_registry();
    init_path();
    init_village();
    originalFunctions = {
      "getEntity": World2.prototype.getEntity
    };
    Object.defineProperty(Entity.prototype, "isVillager", {
      get: function() {
        return Registry.villagerTypes.includes(this.typeId);
      }
    });
    World2.prototype.getEntity = function(entityId) {
      const entity = originalFunctions.getEntity.call(this, entityId);
      if (entity !== void 0 && entity.isVillager) {
        return Villager.fromEntity(entity);
      }
      return entity;
    };
    World2.prototype.getVillagers = function() {
      return this.getEntities().filter(
        (entity) => Registry.villagerTypes.includes(entity.typeId)
      ).map((entity) => Villager.fromEntity(entity));
    };
    villagerCache = /* @__PURE__ */ new Map();
    world2.afterEvents.entityRemove.subscribe((event) => {
      const removedEntityId = event.removedEntityId;
      villagerCache.delete(removedEntityId);
    });
    Villager = class _Villager {
      constructor(entity) {
        this.entity = entity;
        return new Proxy(this, {
          get(target, prop, receiver) {
            if (!(prop in target) && prop in target.entity) {
              const value = Reflect.get(target.entity, prop);
              return typeof value === "function" ? value.bind(target.entity) : value;
            }
            return Reflect.get(target, prop, receiver);
          },
          set(target, prop, value) {
            if (!(prop in target) && prop in target.entity) {
              return Reflect.set(target.entity, prop, value);
            }
            return Reflect.set(target, prop, value);
          }
        });
      }
      entity;
      isBlocked = false;
      blockedTimer = 0;
      isPathing = false;
      unblockTimer = 0;
      pathTickId;
      pathError;
      taskProgress = 0;
      currentTask;
      animation;
      lastAnimation;
      holdingItem;
      lastHoldingItem;
      waiting;
      foundItem;
      foundTree;
      static fromEntity(entity) {
        const cached = villagerCache.get(entity.id);
        if (cached !== void 0) {
          return cached;
        }
        const villager = new _Villager(entity);
        villagerCache.set(entity.id, villager);
        return villager;
      }
      static fromId(entityId) {
        const entity = world2.getEntity(entityId);
        if (entity === void 0 || !entity.isVillager) {
          return void 0;
        }
        return entity instanceof _Villager ? entity : _Villager.fromEntity(entity);
      }
      get location() {
        return this.entity.location;
      }
      get dimension() {
        return this.entity.dimension;
      }
      get isDead() {
        return this.entity.isDead;
      }
      get id() {
        return this.entity.id;
      }
      get typeId() {
        return this.entity.typeId;
      }
      get isOnGround() {
        return this.entity.isOnGround;
      }
      get isValid() {
        return this.entity.isValid;
      }
      get nameTag() {
        return this.entity.nameTag;
      }
      set nameTag(value) {
        this.entity.nameTag = value;
      }
      applyKnockback(...args) {
        return this.entity.applyKnockback(...args);
      }
      applyImpulse(...args) {
        return this.entity.applyImpulse(...args);
      }
      getViewDirection(...args) {
        return this.entity.getViewDirection(...args);
      }
      lookAt(...args) {
        return this.entity.lookAt(...args);
      }
      getComponent(componentId) {
        return this.entity.getComponent(componentId);
      }
      playAnimation(...args) {
        return this.entity.playAnimation(...args);
      }
      setAnimation(animation) {
        this.animation = animation;
      }
      getAnimation() {
        return this.animation;
      }
      getAllBlocksStandingOn(...args) {
        return this.entity.getAllBlocksStandingOn(...args);
      }
      stopPath() {
      }
      getMoveSpeed(ignoreY = false) {
        const entityVelocity = this.entity.getVelocity();
        const { x, y, z } = entityVelocity;
        return Math.sqrt(x * x + z * z + (ignoreY ? 0 : y * y));
      }
      getVillage() {
        const entityLocation = this.location;
        const villages = world2.getVillages();
        for (let i = 0; i < villages.length; i++) {
          const village = villages[i];
          if (isVectorBetween(entityLocation, village.bounds.start, village.bounds.end, true)) {
            return village;
          }
        }
        return void 0;
      }
      findTree(village) {
        const takenTrees = /* @__PURE__ */ new Set();
        const villagers = world2.getVillagers();
        for (let i = 0; i < villagers.length; i++) {
          if (villagers[i].id === this.id) {
            continue;
          }
          const tree = villagers[i].foundTree;
          if (tree) {
            takenTrees.add(vectorToString(tree));
          }
        }
        const villagerLoc = this.location;
        let closestTree;
        let minDist = Infinity;
        for (let i = 0; i < village.treeLocations.length; i++) {
          const treeStr = village.treeLocations[i];
          if (takenTrees.has(treeStr)) {
            continue;
          }
          const treeVec = stringToVector(treeStr);
          const dist = calculateDistance(villagerLoc, treeVec);
          if (dist < minDist) {
            minDist = dist;
            closestTree = treeVec;
          }
        }
        this.foundTree = closestTree;
        return closestTree;
      }
      findItem(village) {
        let pickupItems = tektopiaVillagers[this.typeId]?.pickupItems;
        if (pickupItems === void 0) {
          this.foundItem = void 0;
          return void 0;
        }
        if (typeof pickupItems === "function") {
          pickupItems = pickupItems();
        }
        const villagerLoc = this.location;
        const nearbyItems = this.dimension.getEntities({
          type: "item",
          location: villagerLoc,
          maxDistance: 9
        });
        let closestItem;
        let bestDist = Infinity;
        for (let i = 0; i < nearbyItems.length; i++) {
          const item = nearbyItems[i];
          if (!item.isOnGround || item.unreachable) {
            continue;
          }
          if (Math.abs(item.location.y - villagerLoc.y) > 1.1) {
            continue;
          }
          if (!isVectorBetween(item.location, village.bounds.start, village.bounds.end)) {
            continue;
          }
          const stack = item.getComponent(EntityComponentTypes.Item)?.itemStack;
          if (stack === void 0 || !pickupItems.includes(stack.typeId)) {
            continue;
          }
          const dist = calculateDistance(item.location, villagerLoc);
          if (dist < bestDist) {
            bestDist = dist;
            closestItem = item;
          }
        }
        this.foundItem = closestItem;
        return closestItem;
      }
      pathFindTo(targetLocation) {
        pathFindTo(this, targetLocation);
      }
      tickAI() {
        const villager = this;
        if (villager.isDead) {
          return;
        }
        const village = villager.getVillage();
        if (village === void 0) {
          villager.nameTag = "No Village";
          villager.setAnimation(void 0);
          return;
        }
        const pathError = villager.pathError;
        if (villager.waiting && pathError === void 0) {
          let nameTag = `Waiting${".".repeat(Math.floor(system2.currentTick / 5) % 3 + 1)}`;
          if (typeof villager.waiting === "number") {
            villager.waiting--;
            if (villager.waiting === 0) {
              villager.holdingItem = void 0;
            }
            nameTag = `(${villager.waiting}) ${nameTag}`;
          }
          villager.nameTag = nameTag;
        } else {
          villager.tickTasks(village);
        }
        if (pathError !== void 0) {
          villager.pathError = void 0;
        }
        villager.updateHoldingItem();
        villager.updateAnimation();
      }
      tickTasks(village) {
        const villager = this;
        const dimension = villager.dimension;
        const villagerProps = tektopiaVillagers[villager.typeId];
        if (villagerProps === void 0) {
          return;
        }
        const villagerLocation = villager.location;
        const allTaskList = globalTasks.concat(villagerProps.customTasks);
        const taskList = villager.currentTask ? allTaskList.filter((task) => task.canInterrupt) : allTaskList;
        villager.taskProgress ??= 0;
        if (!villager.currentTask) {
          villager.foundTree = void 0;
          villager.foundItem = void 0;
          for (let i = 0; i < taskList.length; i++) {
            const task = taskList[i];
            if (task.condition(villager, village)) {
              villager.currentTask = task.id;
              villager.stopPath();
              villager.taskProgress = 0;
              break;
            }
          }
          if (!villager.currentTask) {
            villager.foundTree = void 0;
            villager.foundItem = void 0;
          }
        }
        if (villager.currentTask !== void 0) {
          const task = allTaskList.find((task2) => task2.id === villager.currentTask);
          task?.tick?.(villager, village);
          if (!villager.currentTask && !villager.waiting) {
            if (villager.animation !== "walking") {
              villager.animation = void 0;
            }
            villager.holdingItem = void 0;
            villager.stopPath();
            villager.taskProgress = 0;
            villager.foundTree = void 0;
          }
          for (let i = 0; i < allTaskList.length; i++) {
            const task2 = allTaskList[i];
            if (task2.id === villager.currentTask) {
              villager.nameTag = `${task2.name}
${villager.blockedTimer}`;
              break;
            }
          }
        } else {
          if (!villager.isPathing) {
            const offset = {
              x: randomInt(-10, 10),
              y: 0,
              z: randomInt(-10, 10)
            };
            const randomLocation = addVectors(villagerLocation, offset);
            if (villager.taskProgress > 0) {
              villager.taskProgress--;
            } else {
              let block = dimension.getBlockSafe(randomLocation);
              if (block !== void 0) {
                while (block !== void 0 && block.isAir) {
                  block = block.belowSafe();
                }
                while (block !== void 0 && !block.isAir) {
                  block = block.aboveSafe();
                }
                if (block !== void 0) {
                  if (village.pathNodes[vectorToString(block)]) {
                    villager.pathFindTo(block.location);
                    villager.taskProgress = randomInt(20, 200);
                  }
                }
              }
            }
          }
        }
        if (villager.currentTask === void 0) {
          villager.nameTag = "Idle";
        }
        if (villager.isPathing && villager.typeId === "tektopia:lumberjack" && system2.currentTick % 20 === 0) {
          const minVector = addVectors(villagerLocation, { x: -2, y: -1, z: -2 });
          const maxVector = addVectors(villagerLocation, { x: 2, y: 2, z: 2 });
          const blocksToUpdate = [];
          const checkedBlocks = /* @__PURE__ */ new Set();
          for (let x = minVector.x; x <= maxVector.x; x++) {
            for (let y = minVector.y; y <= maxVector.y; y++) {
              for (let z = minVector.z; z <= maxVector.z; z++) {
                const block = dimension.getBlockSafe({ x, y, z });
                if (!block) {
                  continue;
                }
                if (block.permutation.getState("persistent_bit") === false) {
                  block.destroy();
                  const blockList = [block, block.aboveSafe(), block.belowSafe()];
                  for (const neighbor of blockList) {
                    if (neighbor === void 0) {
                      continue;
                    }
                    const blockString = vectorToString(neighbor);
                    if (!checkedBlocks.has(blockString)) {
                      checkedBlocks.add(blockString);
                      blocksToUpdate.push(neighbor);
                    }
                  }
                }
              }
            }
          }
          updatePathNodes(blocksToUpdate);
        }
      }
      tickChop(village) {
        const villager = this;
        const dimension = villager.dimension;
        const foundTree = villager.foundTree;
        if (foundTree !== void 0) {
          const treeBlock = dimension.getBlockSafe(foundTree);
          if (treeBlock !== void 0 && blockIsTree(treeBlock)) {
            const treeDist = calculateDistance(foundTree, villager.location);
            if (treeDist <= 5) {
              villager.holdingItem = "wooden_axe";
            } else {
              villager.holdingItem = void 0;
            }
            if (treeDist < 0.5 || !villager.isPathing && treeDist < 3) {
              villager.animation = "chopping";
              villager.lookAt(centerVector(foundTree));
              villager.taskProgress++;
              if (villager.taskProgress > 100 && !villager.waiting) {
                const saplingTypeId = treeBlock.typeId.replace(
                  "_log",
                  "_sapling"
                );
                villager.waiting = true;
                villager.animation = void 0;
                destroyTree(treeBlock, function() {
                  village.saplingLocations.push(vectorToString(treeBlock));
                  villager.currentTask = void 0;
                  villager.waiting = 20;
                  if (!treeBlock.isValid) {
                    return;
                  }
                  treeBlock.replace(saplingTypeId);
                });
              }
            } else {
              villager.pathFindTo(foundTree);
            }
          } else {
            village.treeLocations.remove(vectorToString(foundTree));
            villager.currentTask = void 0;
          }
        } else {
          villager.currentTask = void 0;
        }
      }
      tickPickupItem() {
        const villager = this;
        const foundItem = villager.foundItem;
        const pathError = villager.pathError;
        if (foundItem !== void 0 && foundItem.isValid) {
          if (calculateDistance(foundItem.location, villager.location) < 1.75) {
            if (villager.getMoveSpeed() < 0.01) {
              const item = foundItem.getComponent(EntityComponentTypes.Item)?.itemStack;
              if (item !== void 0) {
                villager.getComponent(EntityComponentTypes.Inventory)?.container.addItem(item);
                villager.holdingItem = item.typeId;
              }
              villager.waiting = 10;
              villager.playAnimation(
                "animation.tektopia_villager.pickup_item"
              );
              foundItem.remove();
              villager.currentTask = void 0;
              villager.animation = void 0;
              villager.stopPath();
            }
          } else if (pathError !== void 0) {
            foundItem.unreachable = 20;
            villager.currentTask = void 0;
          } else {
            villager.pathFindTo(foundItem.location);
          }
        } else {
          villager.currentTask = void 0;
        }
      }
      updateAnimation() {
        if (this.lastAnimation !== this.animation) {
          this.lastAnimation = this.animation;
          this.entity.setProperty("property:animation", this.animation ?? "none");
        }
      }
      updateHoldingItem() {
        if (this.lastHoldingItem !== this.holdingItem) {
          this.lastHoldingItem = this.holdingItem;
          this.entity.runCommand(
            this.holdingItem ? `replaceitem entity @s slot.weapon.offhand 0 ${this.holdingItem}` : "replaceitem entity @s slot.weapon.offhand 0 air"
          );
        }
      }
    };
    World2.prototype.getVillager = function(entityId) {
      return Villager.fromId(entityId);
    };
    globalTasks = [
      {
        id: "eat",
        name: "Eat",
        required: true,
        condition: () => false,
        canInterrupt: true
      },
      {
        id: "sleep",
        name: "Sleep",
        required: true,
        condition: () => false
      },
      {
        id: "item",
        name: "Pickup Items",
        required: true,
        condition: (villager, village) => villager.findItem(village) !== void 0,
        tick: (villager) => villager.tickPickupItem()
      },
      {
        id: "tool",
        name: "Get Tool",
        required: true,
        condition: () => false
      },
      {
        id: "craft",
        name: "Craft Tools",
        required: false,
        condition: () => false
      }
    ];
    tektopiaVillagers = {
      "tektopia:farmer": {
        customTasks: [
          {
            id: "till",
            name: "Till",
            required: false,
            condition: () => false
          },
          {
            id: "plant",
            name: "Plant",
            required: false,
            condition: () => false
          },
          {
            id: "harvest",
            name: "Harvest",
            required: false,
            condition: () => false
          }
        ],
        pickupItems: [
          "minecraft:wheat_seeds",
          "minecraft:beetroot_seeds",
          "minecraft:pumpkin_seeds",
          "minecraft:melon_seeds",
          "minecraft:sugarcane",
          "minecraft:potato",
          "minecraft:carrot",
          "minecraft:pumpkin",
          "minecraft:melon_slice"
        ]
      },
      "tektopia:lumberjack": {
        customTasks: [
          {
            id: "chop",
            name: "Chop Trees",
            required: false,
            condition: (villager, village) => villager.findTree(village) !== void 0,
            tick: (villager, village) => villager.tickChop(village)
          }
        ],
        pickupItems: () => ["minecraft:apple", ...Registry.saplingTypes, ...Registry.logTypes]
      }
    };
  }
});

// src/path.ts
import {
  GameMode,
  Player,
  system as system3,
  world as world3
} from "@minecraft/server";
function generatePath(entity, startLocation, targetLocation, token) {
  return new Promise((resolve) => {
    const village = entity.getVillage();
    if (!village) {
      resolve("no_village");
      return;
    }
    const villageBounds = village.bounds;
    const dimensionId = village.dimensionId;
    const dimension = world3.getDimension(dimensionId);
    const nodeList = village.pathNodes;
    startLocation = floorVector(startLocation);
    targetLocation = floorVector(targetLocation);
    const endBlock = dimension.getBlockSafe(targetLocation);
    if (endBlock !== void 0 && !isValidPath(endBlock, villageBounds)) {
      const checkBlocks = [
        endBlock.northSafe(),
        endBlock.eastSafe(),
        endBlock.southSafe(),
        endBlock.westSafe()
      ];
      for (let i = 0; i < checkBlocks.length; i++) {
        const block = checkBlocks[i];
        if (block !== void 0 && isValidPath(block, villageBounds)) {
          targetLocation = block.location;
          break;
        }
      }
    }
    function heuristic(vector1, vector2) {
      return Math.abs(vector1.x - vector2.x) + Math.abs(vector1.y - vector2.y) + Math.abs(vector1.z - vector2.z);
    }
    system3.runJob(safeTickGeneratePath());
    function* safeTickGeneratePath() {
      try {
        yield* tickGeneratePath();
      } catch (error) {
        console.warn("Pathfinding failed: ", error);
        resolve("error");
      }
    }
    function* tickGeneratePath() {
      let startKey = vectorToString(startLocation);
      let endKey = vectorToString(targetLocation);
      if (!nodeList[startKey]) {
        const nearestStart = findNearestNodeLocation(nodeList, startLocation);
        if (nearestStart === void 0) {
          resolve("no_path");
          return;
        }
        startKey = vectorToString(nearestStart);
      }
      if (!nodeList[endKey]) {
        const nearestEnd = findNearestNodeLocation(nodeList, targetLocation);
        if (nearestEnd === void 0) {
          resolve("no_path");
          return;
        }
        endKey = vectorToString(nearestEnd);
      }
      const startVec = stringToVector(startKey);
      const endVec = stringToVector(endKey);
      if (startKey === endKey) {
        resolve([startVec]);
        return;
      }
      const HEURISTIC_WEIGHT = 1;
      const MAX_EXPANSIONS = 2e4;
      const YIELD_EVERY = 20;
      const closedSet = /* @__PURE__ */ new Set();
      const gScore = /* @__PURE__ */ new Map([[startKey, 0]]);
      const cameFrom = /* @__PURE__ */ new Map();
      const openSet = new PriorityQueue();
      openSet.enqueue(startKey, heuristic(startVec, endVec) * HEURISTIC_WEIGHT);
      const checkEntityList = getCheckPathEntities(dimensionId, entity);
      let expansions = 0;
      while (!openSet.isEmpty()) {
        const currentKey = openSet.dequeue();
        if (closedSet.has(currentKey)) {
          continue;
        }
        closedSet.add(currentKey);
        if (currentKey === endKey) {
          const path = [];
          let k = currentKey;
          while (k !== void 0) {
            path.push(stringToVector(k));
            k = cameFrom.get(k);
          }
          path.reverse();
          resolve(path);
          return;
        }
        if (token.cancelled) {
          resolve("cancelled");
          return;
        }
        if (++expansions > MAX_EXPANSIONS) {
          resolve("timeout");
          return;
        }
        const currentVec = stringToVector(currentKey);
        const currentNode = nodeList[currentKey];
        if (!currentNode) {
          continue;
        }
        const currentG = gScore.get(currentKey) ?? 0;
        outerLoop: for (const neighborKey of currentNode.neighbors) {
          if (closedSet.has(neighborKey)) {
            continue;
          }
          const neighborNode = nodeList[neighborKey];
          if (!neighborNode) {
            continue;
          }
          if (neighborNode.requirement !== void 0 && !checkRequirement(entity.typeId, neighborNode.requirement)) {
            continue;
          }
          const neighborLocation = stringToVector(neighborKey);
          const neighborCenter = centerVector(neighborLocation, true);
          let isBlocked = false;
          for (let i = 0; i < checkEntityList.length; i++) {
            const other = checkEntityList[i];
            if (calculateSquareDistance(other.location, neighborCenter) < 1.75) {
              if (other.cancelPath) {
                continue outerLoop;
              }
              isBlocked = true;
              break;
            }
          }
          const moveCost = heuristic(currentVec, neighborLocation) + (neighborLocation.y !== currentVec.y ? 10 : 0) + (isBlocked ? 50 : 0);
          const tentativeG = currentG + moveCost;
          if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
            cameFrom.set(neighborKey, currentKey);
            gScore.set(neighborKey, tentativeG);
            openSet.enqueue(
              neighborKey,
              tentativeG + heuristic(neighborLocation, endVec) * HEURISTIC_WEIGHT
            );
          }
        }
        if (expansions % YIELD_EVERY === 0) {
          yield;
        }
      }
      resolve("no_path");
    }
  });
}
function findNearestNodeLocation(nodeList, location, maxRadius = 6) {
  if (nodeList[vectorToString(location)]) {
    return location;
  }
  for (let radius = 1; radius <= maxRadius; radius++) {
    let closest;
    let closestDist = Infinity;
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dz = -radius; dz <= radius; dz++) {
          if (Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz)) !== radius) {
            continue;
          }
          const candidate = addVectors(location, { x: dx, y: dy, z: dz });
          if (!nodeList[vectorToString(candidate)]) {
            continue;
          }
          const dist = calculateSquareDistance(candidate, location);
          if (dist < closestDist) {
            closestDist = dist;
            closest = candidate;
          }
        }
      }
    }
    if (closest) {
      return closest;
    }
  }
  return void 0;
}
function getCheckPathEntities(dimensionId, villager) {
  const result = [];
  const entityList = pathCheckEntities[dimensionId] ?? [];
  for (let i = 0; i < entityList.length; i++) {
    const checkEntityObject = entityList[i];
    if (!checkEntityObject || checkEntityObject.id === villager.id) {
      continue;
    }
    const checkEntity = world3.getEntity(checkEntityObject.id);
    if (!checkEntity) {
      continue;
    }
    result.push({
      ...checkEntityObject,
      isBlocked: checkEntity instanceof Villager && (checkEntity.isBlocked || !checkEntity.isPathing)
    });
  }
  return result;
}
function checkRequirement(villagerType, requirement) {
  if (!requirement) {
    return true;
  }
  const { whiteList, types } = requirement;
  const typeSet = new Set(types);
  if (whiteList) {
    return typeSet.has(villagerType);
  }
  return !typeSet.has(villagerType);
}
function updatePathNodes(blockList) {
  updatePathNodeList.push(blockList);
}
function tickUpdateNodes() {
  system3.runJob(updateNodesBlocks(tickUpdateNodes));
}
function* updateNodesBlocks(callback) {
  try {
    if (!world3.loadedData) {
      return;
    }
    let index = 0;
    while (updatePathNodeList.length > 0) {
      const blockList = updatePathNodeList.shift();
      for (let i = 0; i < blockList.length; i++) {
        const checkBlock = blockList[i];
        if (!checkBlock.isValid) {
          continue;
        }
        const neighborList = getNodeNeighbors(checkBlock);
        const checkBlockStringLocation = vectorToString(checkBlock);
        const villageList = world3.getVillages();
        for (let j = 0; j < villageList.length; j++) {
          const village = villageList[j];
          const alreadyCheckedLocations = /* @__PURE__ */ new Set();
          const villageBounds = village.bounds;
          village.removeNode(checkBlockStringLocation);
          for (let k = 0; k < neighborList.length; k++) {
            const neighborBlock = neighborList[k];
            if (neighborBlock === void 0) {
              continue;
            }
            const neighborLocationString = vectorToString(neighborBlock);
            if (!alreadyCheckedLocations.has(neighborLocationString)) {
              alreadyCheckedLocations.add(neighborLocationString);
              if (village.pathNodes[neighborLocationString] && isValidPath(neighborBlock, villageBounds)) {
                system3.runJob(searchBlocks(village, neighborBlock));
              }
            }
          }
        }
        if (i % 3 === 0) {
          yield;
        }
      }
      index++;
      if (index % 5 === 0) {
        yield;
      }
    }
  } finally {
    if (callback !== void 0) {
      callback();
    }
  }
}
function checkNodeValidity(village, pathNodeLocation) {
  const dimension = world3.getDimension(village.dimensionId);
  const block = dimension.getBlockSafe(stringToVector(pathNodeLocation));
  const pathNode = village.pathNodes[pathNodeLocation];
  if (!block || !pathNode) {
    return;
  }
  if (!isValidPath(block, village.bounds)) {
    village.removeNode(pathNodeLocation);
    return;
  }
  for (const neighborKey of [...pathNode.neighbors]) {
    const neighborBlock = dimension.getBlockSafe(stringToVector(neighborKey));
    if (neighborBlock && !isValidConnection(block, neighborBlock)) {
      village.unlink(pathNodeLocation, neighborKey);
      console.warn("Node Deleted: ", pathNodeLocation);
    }
  }
}
function isValidConnection(currentBlock, neighborBlock) {
  function checkValidConnection(block1, block2) {
    const offset = subtractVectors(block2, block1);
    if (offset.y === 1) {
      const aboveAbove = block1.aboveSafe()?.aboveSafe();
      if (aboveAbove === void 0 || !aboveAbove.canWalkThrough()) {
        return false;
      }
    }
    if (offset.x !== 0 && offset.z !== 0) {
      const block2Above = block2.aboveSafe();
      if (block2Above === void 0 || !block2.canWalkThrough() || !block2Above.canWalkThrough()) {
        return false;
      }
      const dirX = offset.x === 1 ? "eastSafe" : "westSafe";
      const dirZ = offset.z === 1 ? "southSafe" : "northSafe";
      const checkBlockX = block1[dirX]();
      if (checkBlockX && (!checkBlockX.canWalkThrough() || !checkBlockX.aboveSafe()?.canWalkThrough() || !isValidPath(checkBlockX))) {
        return false;
      }
      const checkBlockZ = block1[dirZ]();
      if (checkBlockZ && (!checkBlockZ.canWalkThrough() || !checkBlockZ.aboveSafe()?.canWalkThrough() || !isValidPath(checkBlockZ))) {
        return false;
      }
    }
    return true;
  }
  return checkValidConnection(currentBlock, neighborBlock) && checkValidConnection(neighborBlock, currentBlock);
}
function isValidPath(block, villageBounds) {
  const below = block.belowSafe();
  if (below === void 0) {
    return false;
  }
  const above = block.aboveSafe();
  if (above === void 0) {
    return false;
  }
  if (!block.canPathThrough()) {
    return false;
  }
  if (below.isDangerous()) {
    return false;
  }
  const belowIsSolid = below.getIsSolid();
  if (below.destroyableLeaf() && (block.destroyableLeaf() || above.destroyableLeaf())) {
    return false;
  }
  if (!belowIsSolid) {
    return false;
  }
  if (!above.canPathThrough()) {
    return false;
  }
  if (villageBounds !== void 0 && !isVectorBetween(block, villageBounds.start, villageBounds.end, true)) {
    return false;
  }
  return true;
}
function* searchBlocks(village, startingBlock, overwrite = false, callback) {
  try {
    const checkBlockList = [startingBlock];
    if (!isValidPath(startingBlock, village.bounds)) {
      return;
    }
    const startingBlockLocationString = vectorToString(startingBlock);
    const alreadyCheckedLocations = /* @__PURE__ */ new Set([startingBlockLocationString]);
    const villageBounds = village.bounds;
    const dimension = world3.getDimension(village.dimensionId);
    const pathCache = /* @__PURE__ */ new Map();
    while (checkBlockList.length > 0) {
      if (!village.isValid) {
        return;
      }
      const checkBlock = checkBlockList.shift();
      if (checkBlock === void 0 || !checkBlock.isValid) {
        continue;
      }
      const key = vectorToString(checkBlock);
      village.pathNodes[key] ??= { neighbors: [] };
      const node = village.pathNodes[key];
      const requirement = getNodeRequirement(checkBlock);
      if (requirement) {
        node.requirement = requirement;
      } else {
        delete node.requirement;
      }
      const before = new Set(node.neighbors);
      const after = /* @__PURE__ */ new Set();
      for (const block of getNodeNeighbors(checkBlock)) {
        const blockString = vectorToString(block);
        let isValid = pathCache.get(blockString);
        if (isValid === void 0) {
          isValid = isValidPath(block, villageBounds);
          pathCache.set(blockString, isValid);
        }
        if (!isValid || !isValidConnection(checkBlock, block)) {
          continue;
        }
        after.add(blockString);
        const existed = village.pathNodes[blockString] !== void 0;
        village.pathNodes[blockString] ??= { neighbors: [] };
        village.link(key, blockString);
        if (!alreadyCheckedLocations.has(blockString)) {
          alreadyCheckedLocations.add(blockString);
          if (overwrite || !existed) {
            checkBlockList.push(block);
          }
        }
      }
      for (const oldKey of before) {
        if (after.has(oldKey)) {
          continue;
        }
        village.unlink(key, oldKey);
        if (!overwrite && !alreadyCheckedLocations.has(oldKey)) {
          const neighbor = dimension.getBlockSafe(stringToVector(oldKey));
          if (neighbor && isValidPath(neighbor, villageBounds)) {
            alreadyCheckedLocations.add(oldKey);
            checkBlockList.push(neighbor);
          }
        }
      }
      yield;
    }
  } finally {
    if (callback !== void 0) {
      callback();
    }
  }
}
function getNodeRequirement(block) {
  const below = block.belowSafe();
  const above = block.aboveSafe();
  if (below?.destroyableLeaf()) {
    return { whiteList: false, types: ["tektopia:lumberjack"] };
  }
  if (Registry.leafTypes.includesFast(block.typeId) || above !== void 0 && Registry.leafTypes.includesFast(above.typeId)) {
    return { whiteList: true, types: ["tektopia:lumberjack"] };
  }
  return void 0;
}
function getNodeNeighbors(nodeBlock) {
  const north = nodeBlock.northSafe();
  const east = nodeBlock.eastSafe();
  const south = nodeBlock.southSafe();
  const west = nodeBlock.westSafe();
  const sides = [north, east, south, west];
  const neighborList = [];
  for (const block of sides) {
    if (block !== void 0) {
      neighborList.push(block);
    }
  }
  for (const block of [...sides, nodeBlock]) {
    const below = block?.belowSafe();
    if (below !== void 0) {
      neighborList.push(below);
    }
  }
  for (const block of [...sides, nodeBlock]) {
    const above = block?.aboveSafe();
    if (above !== void 0) {
      neighborList.push(above);
    }
  }
  const diagonals = [
    north?.eastSafe(),
    east?.southSafe(),
    south?.westSafe(),
    west?.northSafe()
  ];
  for (const block of diagonals) {
    if (block !== void 0) {
      neighborList.push(block);
    }
  }
  return neighborList;
}
function pathFindTo(villager, targetLocation) {
  if (villager.isPathing) {
    return;
  }
  const village = villager.getVillage();
  if (village === void 0) {
    return;
  }
  villager.isPathing = true;
  const token = { cancelled: false };
  let finished = false;
  function cancelPath() {
    if (finished) {
      return;
    }
    finished = true;
    system3.clearRun(timeoutId);
    token.cancelled = true;
    villager.blockedTimer = 0;
    villager.setAnimation(void 0);
    villager.isPathing = false;
    if (villager.pathTickId !== void 0) {
      system3.clearRun(villager.pathTickId);
    }
    villager.pathTickId = void 0;
    villager.stopPath = () => {
    };
  }
  villager.stopPath = cancelPath;
  const timeoutId = system3.runTimeout(() => {
    if (!finished) {
      cancelPath();
    }
  }, 1200);
  try {
    let startLocation = floorVector(villager.location);
    if (village.pathNodes[vectorToString(startLocation)] === void 0) {
      const entityStandingOnBlocks = villager.getAllBlocksStandingOn();
      for (let i = 0; i < entityStandingOnBlocks.length; i++) {
        const blockAbove = entityStandingOnBlocks[i].aboveSafe();
        if (blockAbove === void 0) {
          continue;
        }
        const blockAboveLocationString = vectorToString(blockAbove);
        if (village.pathNodes[blockAboveLocationString]) {
          startLocation = blockAbove.location;
          break;
        }
      }
    }
    generatePath(villager, startLocation, targetLocation, token).then((result) => {
      if (finished) {
        return;
      }
      if (typeof result === "string") {
        if (result !== "cancelled") {
          villager.pathError = result;
        }
        cancelPath();
        return;
      }
      if (result.length === 0) {
        cancelPath();
        return;
      }
      startFollowing(villager, result, targetLocation, cancelPath, () => finished);
    }).catch((error) => {
      console.warn("pathFindTo failed: ", error);
      cancelPath();
    });
  } catch (error) {
    console.warn("pathFindTo setup failed: ", error);
    cancelPath();
  }
}
function startFollowing(villager, pathNodeList, targetLocation, cancelPath, isFinished) {
  const village = villager.getVillage();
  if (village === void 0) {
    cancelPath();
    return;
  }
  const dimension = villager.dimension;
  const dimensionId = dimension.id;
  const villageBounds = village.bounds;
  function tickFollowPath() {
    if (isFinished()) {
      return;
    }
    try {
      if (!villager.isValid || !villager.isPathing) {
        cancelPath();
        return;
      }
      const targetBlock = dimension.getBlockSafe(targetLocation);
      if (targetBlock && !isValidPath(targetBlock, villageBounds) && calculateDistance(centerVector(targetLocation), villager.location) <= 1.25) {
        cancelPath();
        return;
      }
      villager.pathTickId = system3.run(tickFollowPath);
      if (pathNodeList.length === 0) {
        cancelPath();
        return;
      }
      if (system3.currentTick % 20 === 0) {
        pathNodeList.forEach((pathNode) => {
          try {
            dimension.spawnParticle(
              "minecraft:villager_angry",
              centerVector(pathNode)
            );
          } catch {
          }
        });
      }
      const currentPathNode = centerVector(pathNodeList[0], true);
      const entityLocation = villager.location;
      if (villager.isOnGround) {
        villager.lookAt(currentPathNode, true);
      }
      const direction = villager.getViewDirection();
      const speed = villager.isOnGround ? 0.2 : 0.015;
      const moveVector = multiplyVector(direction, "xyz", speed);
      const checkEntityList = getCheckPathEntities(dimensionId, villager);
      const pathNodeBlock = dimension.getBlockSafe(currentPathNode);
      if (pathNodeBlock !== void 0) {
        if (!isValidPath(pathNodeBlock, villageBounds)) {
          checkNodeValidity(village, vectorToString(pathNodeBlock));
          cancelPath();
          return;
        }
        const pathNodeBlockBelowTypeId = pathNodeBlock.belowSafe()?.typeId;
        if (pathNodeBlockBelowTypeId !== void 0 && (Registry.slabTypes.includesFast(pathNodeBlockBelowTypeId) || Registry.stairTypes.includesFast(pathNodeBlockBelowTypeId))) {
          currentPathNode.y -= 0.5;
        }
      }
      if (calculateDistance(currentPathNode, entityLocation) >= 2) {
        cancelPath();
        return;
      }
      let isBlocked = false;
      let blockedByTektopiaVillager = false;
      for (let i = 0; i < checkEntityList.length; i++) {
        const checkEntity = checkEntityList[i];
        if (checkEntity.isBlocked === void 0 || !checkEntity.isBlocked) {
          const checkEntityLocation = checkEntity.location;
          const checkEntityIsTektopiaVillager = checkEntity.typeId.startsWith("tektopia:");
          if (calculateSquareDistance(checkEntityLocation, currentPathNode) < 1.75) {
            if (checkEntity.cancelPath) {
              cancelPath();
              return;
            }
            blockedByTektopiaVillager = checkEntityIsTektopiaVillager;
            isBlocked = true;
            break;
          }
        }
      }
      villager.unblockTimer ??= 0;
      if (blockedByTektopiaVillager) {
        villager.unblockTimer = 20;
      } else if (!isBlocked && villager.unblockTimer > 0) {
        villager.unblockTimer--;
        isBlocked = true;
      }
      villager.isBlocked = isBlocked;
      const isMoving = villager.getMoveSpeed(true) > 1e-4;
      if (!isMoving || isBlocked) {
        villager.blockedTimer = (villager.blockedTimer | 0) + 1;
      } else {
        villager.blockedTimer = 0;
      }
      if (isBlocked) {
        if (!isMoving) {
          villager.setAnimation(void 0);
        }
      } else {
        villager.setAnimation("walking");
        if (villager.isOnGround) {
          villager.applyKnockback(moveVector, 0);
          if (currentPathNode.y - villager.location.y > 0.55) {
            villager.applyImpulse({ x: 0, y: 0.44, z: 0 });
          }
        } else {
          villager.applyImpulse({ x: moveVector.x, y: 0, z: moveVector.z });
        }
      }
      if (villager.blockedTimer > 40) {
        cancelPath();
        return;
      }
      if (calculateSquareDistance(currentPathNode, villager.location) <= 0.5) {
        pathNodeList.shift();
      }
    } catch (error) {
      console.warn("Path follow failed: ", error);
      cancelPath();
    }
  }
  villager.pathTickId = system3.run(tickFollowPath);
}
var pathCheckEntities, PriorityQueue, updatePathNodeList;
var init_path = __esm({
  "src/path.ts"() {
    "use strict";
    init_utils();
    init_villager();
    init_variables();
    init_registry();
    pathCheckEntities = {};
    system3.runInterval(() => {
      for (let i = 0; i < Registry.dimensionTypes.length; i++) {
        const dimensionId = Registry.dimensionTypes[i];
        const dimension = world3.getDimension(dimensionId);
        const entities2 = dimension.getEntities({
          excludeTypes: pathIgnoreEntityTypes
        });
        pathCheckEntities[dimensionId] = [];
        for (let i2 = 0; i2 < entities2.length; i2++) {
          const entity = entities2[i2];
          if (entity instanceof Player && entity.getGameMode() === GameMode.Spectator) {
            continue;
          }
          pathCheckEntities[dimensionId].push({
            location: entity.location,
            id: entity.id,
            typeId: entity.typeId,
            cancelPath: pathCancelEntityTypes.includesFast(entity.typeId)
          });
        }
      }
    });
    PriorityQueue = class {
      heap = [];
      enqueue(element, priority) {
        const node = { element, priority };
        this.heap.push(node);
        this.bubbleUp();
      }
      dequeue() {
        const min = this.heap[0];
        const end = this.heap.pop();
        if (this.heap.length > 0) {
          this.heap[0] = end;
          this.bubbleDown();
        }
        return min.element;
      }
      bubbleUp() {
        let index = this.heap.length - 1;
        const element = this.heap[index];
        while (index > 0) {
          const parentIndex = Math.floor((index - 1) / 2);
          const parent = this.heap[parentIndex];
          if (element.priority >= parent.priority) {
            break;
          }
          this.heap[index] = parent;
          index = parentIndex;
        }
        this.heap[index] = element;
      }
      bubbleDown() {
        let index = 0;
        const length = this.heap.length;
        const element = this.heap[0];
        while (true) {
          const leftChildIndex = 2 * index + 1;
          const rightChildIndex = 2 * index + 2;
          let swap = null;
          if (leftChildIndex < length) {
            const leftChild = this.heap[leftChildIndex];
            if (leftChild.priority < element.priority) {
              swap = leftChildIndex;
            }
          }
          if (rightChildIndex < length) {
            const rightChild = this.heap[rightChildIndex];
            if (swap === null && rightChild.priority < element.priority || swap !== null && rightChild.priority < this.heap[swap].priority) {
              swap = rightChildIndex;
            }
          }
          if (swap === null) {
            break;
          }
          this.heap[index] = this.heap[swap];
          index = swap;
        }
        this.heap[index] = element;
      }
      isEmpty() {
        return this.heap.length === 0;
      }
    };
    updatePathNodeList = [];
    world3.afterEvents.playerInteractWithBlock.subscribe((event) => {
      const block = event.block;
      updatePathNodes(
        [block, block.aboveSafe(), block.belowSafe()].filter(
          (block2) => block2 !== void 0
        )
      );
    });
    world3.afterEvents.playerPlaceBlock.subscribe((event) => {
      const block = event.block;
      updatePathNodes([block, block.aboveSafe(), block.belowSafe()].filter((block2) => block2 !== void 0));
    });
    world3.afterEvents.playerBreakBlock.subscribe((event) => {
      const block = event.block;
      updatePathNodes(
        [block, block.aboveSafe(), block.belowSafe()].filter(
          (block2) => block2 !== void 0
        )
      );
    });
    world3.afterEvents.explosion.subscribe((event) => {
      const impactedBlocks = event.getImpactedBlocks();
      updatePathNodes(
        impactedBlocks.flatMap(
          (block) => [block, block.aboveSafe(), block.belowSafe()].filter(
            (block2) => block2 !== void 0
          )
        )
      );
    });
    system3.run(tickUpdateNodes);
  }
});

// src/main.ts
import {
  Block as Block4,
  Dimension as Dimension2,
  DimensionTypes as DimensionTypes2,
  Entity as Entity2,
  ItemComponentTypes,
  ItemStack,
  MolangVariableMap,
  system as system4,
  World as World3,
  world as world4
} from "@minecraft/server";
var require_main = __commonJS({
  "src/main.ts"() {
    var import_lz_string = __toESM(require_lz_string());
    init_generated();
    init_utils();
    init_variables();
    init_village();
    init_path();
    init_registry();
    system4.beforeEvents.watchdogTerminate.subscribe((event) => {
      event.cancel = true;
      world4.sendMessage(`\xA7cWatch dog tried to terminate: ${event.terminateReason}`);
    });
    var itemFrameRotations = {
      2: "south",
      3: "north",
      4: "east",
      5: "west"
    };
    var cardinalDirectionList = ["north", "east", "south", "west"];
    World3.prototype.saveData = function() {
      if (!this.loadedData) {
        return;
      }
      const worldSaveDataIdList = this.getDynamicPropertyIds();
      const propertiesToDelete = [];
      for (let i = 0; i < worldSaveDataList.length; i++) {
        const property = worldSaveDataList[i];
        let value = this[property.property];
        if (property.compression !== void 0) {
          try {
            value = property.compression.compress(value);
          } catch (error) {
            console.error(`Failed to compress ${property.property}, keeping the previous save:`, error);
            continue;
          }
        }
        const valueString = import_lz_string.default.compressToBase64(JSON.stringify(value));
        let startingIndex = 0;
        if (valueString.length > 32767) {
          const stringList = splitString(valueString, 32767);
          for (let j = 0; j < stringList.length; j++) {
            const saveString = stringList[j];
            this.setDynamicProperty(`${property.property}:${j}`, saveString);
          }
          startingIndex = stringList.length;
          propertiesToDelete.push(property.property);
        } else {
          this.setDynamicProperty(property.property, valueString);
        }
        for (let j = startingIndex; worldSaveDataIdList.includes(`${property.property}:${j}`); j++) {
          propertiesToDelete.push(`${property.property}:${j}`);
        }
      }
      for (let i = 0; i < propertiesToDelete.length; i++) {
        const propertyId = propertiesToDelete[i];
        if (worldSaveDataIdList.includes(propertyId)) {
          this.setDynamicProperty(propertyId);
        }
      }
    };
    World3.prototype.loadData = function() {
      const ids = new Set(this.getDynamicPropertyIds());
      const readRaw = (key) => {
        if (ids.has(key)) {
          return this.getDynamicProperty(key);
        }
        if (!ids.has(`${key}:0`)) {
          return void 0;
        }
        let data = "";
        for (let i = 0; ids.has(`${key}:${i}`); i++) {
          data += this.getDynamicProperty(`${key}:${i}`);
        }
        return data;
      };
      for (const property of worldSaveDataList) {
        const raw = readRaw(property.property);
        const json = raw === void 0 ? null : import_lz_string.default.decompressFromBase64(raw);
        let value = json !== void 0 && json !== null && json !== "null" ? JSON.parse(json) : copy(property.default);
        if (property.compression) {
          value = property.compression.decompress(value);
        }
        this[property.property] = value;
      }
      this.loadedData = true;
    };
    system4.beforeEvents.shutdown.subscribe(() => {
      world4.saveData();
    });
    system4.runInterval(() => {
      world4.saveData();
    }, 1200);
    function requirementColor(requirement) {
      if (!requirement?.types?.length) {
        return { red: 0, green: 0, blue: 0 };
      }
      const key = [...requirement.types].sort().join(",") + (requirement.whiteList ? "+w" : "+b");
      const hash = hashString(key);
      let red = hash * 197 % 256;
      let green = hash * 293 % 256;
      let blue = hash * 503 % 256;
      if (!requirement.whiteList) {
        red = red ^ 137;
        green = green ^ 251;
        blue = blue ^ 61;
      }
      return { red: red / 255, green: green / 255, blue: blue / 255 };
      function hashString(str) {
        let hash2 = 0;
        for (let i = 0; i < str.length; i++) {
          hash2 = hash2 * 31 + str.charCodeAt(i) | 0;
        }
        return hash2 >>> 0;
      }
    }
    system4.runInterval(() => {
      if (!world4.loadedData) {
        return;
      }
      if (!world4.loadedData) {
        return;
      }
      world4.itemFrameList = world4.itemFrameList.filter((itemFrame) => {
        const dimension = world4.getDimension(itemFrame.dimensionId);
        const block = dimension.getBlockSafe(itemFrame.location);
        return !block || minecraftFrameTypes.includes(block.typeId);
      });
      const itemEntities = world4.getEntities({ type: "item" });
      for (let i = 0; i < itemEntities.length; i++) {
        const entity = itemEntities[i];
        if (entity.unreachable) {
          entity.unreachable--;
        }
      }
      const players = world4.getAllPlayers();
      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const playerLocation = player.location;
        const villageList = world4.getVillages();
        for (let i2 = 0; i2 < villageList.length; i2++) {
          const village = villageList[i2];
          const boundaryLocationList = getBoundaryLocations(
            village.bounds.start,
            village.bounds.end,
            true
          );
          for (const location of boundaryLocationList) {
            location.y = playerLocation.y;
            if (calculateDistance(location, playerLocation) < 20) {
              try {
                player.spawnParticle(
                  "minecraft:rising_border_dust_particle",
                  addVector(location, "y", randomInt(-10, 10))
                );
              } catch {
              }
            }
          }
        }
      }
    }, 20);
    function _tickDrawDebug() {
      system4.runJob(drawDebug(_tickDrawDebug));
    }
    system4.run(_tickDrawDebug);
    function* drawDebug(callback) {
      try {
        if (!world4.loadedData) {
          callback();
          return;
        }
        const players = world4.getAllPlayers();
        const rotate45 = new MolangVariableMap();
        rotate45.setFloat("rotation", 45);
        const rotate90 = new MolangVariableMap();
        rotate90.setFloat("rotation", 90);
        const rotate135 = new MolangVariableMap();
        rotate135.setFloat("rotation", 135);
        const villageList = world4.getVillages();
        for (const player of players) {
          const playerPos = player.location;
          const nearbyRange = 4;
          const minY = Math.floor(playerPos.y) - 1;
          const maxY = Math.floor(playerPos.y) + 1;
          for (const village of villageList) {
            for (let dx = -nearbyRange; dx <= nearbyRange; dx++) {
              for (let dy = minY - Math.floor(playerPos.y); dy <= maxY - Math.floor(playerPos.y); dy++) {
                for (let dz = -nearbyRange; dz <= nearbyRange; dz++) {
                  const checkPos = {
                    x: Math.floor(playerPos.x + dx),
                    y: Math.floor(playerPos.y + dy),
                    z: Math.floor(playerPos.z + dz)
                  };
                  const key = vectorToString(checkPos);
                  if (!village.pathNodes.hasOwnProperty(key)) {
                    continue;
                  }
                  const node = village.pathNodes[key];
                  if (node === void 0) {
                    continue;
                  }
                  const particlePos = addVector(
                    centerVector(checkPos, true),
                    "y",
                    0.01
                  );
                  const colorMap = new MolangVariableMap();
                  let color;
                  if (node.requirement !== void 0) {
                    color = requirementColor(node.requirement);
                  }
                  if (color === void 0) {
                    color = {
                      red: 122 / 255,
                      green: 122 / 255,
                      blue: 122 / 255
                    };
                  }
                  colorMap.setColorRGB("color", color);
                  player.spawnParticle("tektopia:path_node", particlePos, colorMap);
                  const directionSet = new Set(
                    node.neighbors.map(
                      (neighborString) => vectorToDirection(
                        subtractVectors(stringToVector(neighborString), checkPos)
                      )
                    )
                  );
                  const spawnConnection = (offsetX, offsetY, offsetZ, dir) => {
                    const pos = addVectors(
                      addVector(centerVector(checkPos, true), "y", 0.02),
                      { x: offsetX, y: offsetY, z: offsetZ }
                    );
                    try {
                      if (typeof dir === "string") {
                        player.spawnParticle(`tektopia:node_connection_${dir}`, pos);
                      } else {
                        player.spawnParticle("tektopia:node_connection", pos, dir);
                      }
                    } catch {
                    }
                  };
                  if (directionSet.has("north")) {
                    spawnConnection(-0.1, 0, -0.5);
                  }
                  if (directionSet.has("east")) {
                    spawnConnection(0.5, 0, -0.1, rotate90);
                  }
                  if (directionSet.has("south")) {
                    spawnConnection(0.1, 0, 0.5);
                  }
                  if (directionSet.has("west")) {
                    spawnConnection(-0.5, 0, 0.1, rotate90);
                  }
                  if (directionSet.has("northeast")) {
                    spawnConnection(0.43, 0, -0.57, rotate135);
                  }
                  if (directionSet.has("northwest")) {
                    spawnConnection(-0.57, 0, -0.43, rotate45);
                  }
                  if (directionSet.has("southeast")) {
                    spawnConnection(0.57, 0, 0.43, rotate45);
                  }
                  if (directionSet.has("southwest")) {
                    spawnConnection(-0.43, 0, 0.57, rotate135);
                  }
                  if (directionSet.has("northdown")) {
                    spawnConnection(-0.1, -0.5, -0.5, "north");
                  }
                  if (directionSet.has("eastdown")) {
                    spawnConnection(0.5, -0.5, -0.1, "east");
                  }
                  if (directionSet.has("southdown")) {
                    spawnConnection(0.1, -0.5, 0.5, "south");
                  }
                  if (directionSet.has("westdown")) {
                    spawnConnection(-0.5, -0.5, 0.1, "west");
                  }
                  if (directionSet.has("northup")) {
                    spawnConnection(-0.1, 0.5, -0.5, "south");
                  }
                  if (directionSet.has("eastup")) {
                    spawnConnection(0.5, 0.5, -0.1, "west");
                  }
                  if (directionSet.has("southup")) {
                    spawnConnection(0.1, 0.5, 0.5, "north");
                  }
                  if (directionSet.has("westup")) {
                    spawnConnection(-0.5, 0.5, 0.1, "east");
                  }
                  yield;
                }
              }
            }
          }
        }
      } finally {
        if (callback !== void 0) {
          callback();
        }
      }
    }
    ItemStack.prototype.makeVillageItem = function() {
      this.nameTag = `\xA7r\xA7a${formatTypeId(this.typeId)}`;
      this.setLore(["\xA7r\xA77Village Item"]);
    };
    var minecraftNonSolidBlocksSet = new Set(minecraftNonSolidBlocks);
    var averageTickRateList = [];
    var lastTickTime = Date.now();
    Block4.prototype.destroy = function() {
      if (!this.isValid) {
        return;
      }
      const lootTableManager = world4.getLootTableManager();
      const itemList = lootTableManager.generateLootFromBlock(this) ?? [];
      const dimension = this.dimension;
      for (let i = 0; i < itemList.length; i++) {
        const item = itemList[i];
        item.makeVillageItem();
        dimension.spawnItem(item, this.center());
      }
      this.soundEvent("break");
      this.setType("air");
    };
    Block4.prototype.replace = function(blockType) {
      this.setType(blockType);
      this.soundEvent("place");
    };
    World3.prototype.getEntities = function(options) {
      return DimensionTypes2.getAll().flatMap(
        (dimension) => world4.getDimension(dimension.typeId).getEntities(options)
      );
    };
    Block4.prototype.soundEvent = function(eventId, soundOptions) {
      if (this.isAir) {
        return;
      }
      const sound = blockSounds[removeIdentifier(this.typeId)]?.[eventId];
      if (sound === void 0) {
        console.warn(`Missing sound: ${this.typeId}`);
        return;
      }
      if (soundOptions === void 0 && typeof sound === "object" && sound !== null) {
        soundOptions = {};
        soundOptions.pitch = sound.pitch !== void 0 ? resolveValue(sound.pitch) : 1;
        soundOptions.volume = sound.volume !== void 0 ? resolveValue(sound.volume) : 1;
      }
      function resolveValue(value) {
        if (Array.isArray(value)) {
          return randomInt(value[0] * 10, value[1] * 10) / 10;
        }
        return value;
      }
      if (sound !== null) {
        this.playSound(typeof sound === "string" ? sound : sound.sound, soundOptions);
      }
    };
    Block4.prototype.playSound = function(soundId, soundOptions) {
      this.dimension.playSound(soundId, this.center(), soundOptions);
    };
    Entity2.prototype.lookAt = function(location, ignoreY = false) {
      const entity = this;
      const entityLocation = entity.location;
      const dx = location.x - entityLocation.x;
      const dy = location.y - entityLocation.y;
      const dz = location.z - entityLocation.z;
      const yaw = Math.atan2(dz, dx) * (180 / Math.PI) - 90;
      const pitch = -Math.atan2(dy, Math.sqrt(dx * dx + dz * dz)) * (180 / Math.PI);
      entity.setRotation({ x: ignoreY ? entity.getRotation().x : pitch, y: yaw });
    };
    var setCache = /* @__PURE__ */ new WeakMap();
    Array.prototype.includesFast = function(value) {
      let set = setCache.get(this);
      if (!set) {
        set = new Set(this);
        setCache.set(this, set);
      }
      return set.has(value);
    };
    Block4.prototype.canWalkThrough = function() {
      return (this.isAir || minecraftNonSolidBlocksSet.has(this.typeId) || this.destroyableLeaf()) && !this.isDangerous() && !this.isLiquid && !this.isWaterlogged;
    };
    Block4.prototype.isDangerous = function() {
      return minecraftDangerousBlockTypes.includesFast(this.typeId);
    };
    function getBoundaryLocations(vector1, vector2, ignoreY = false) {
      const minV = floorVector(minVectors(vector1, vector2));
      const maxV = ceilVector(maxVectors(vector1, vector2));
      const { x: minX, y: minY, z: minZ } = minV;
      const { x: maxX, y: maxY, z: maxZ } = maxV;
      const boundary = [];
      if (ignoreY) {
        const y = minY;
        for (let x = minX; x <= maxX; x++) {
          boundary.push({ x, y, z: minZ });
          if (minZ !== maxZ) {
            boundary.push({ x, y, z: maxZ });
          }
        }
        for (let z = minZ + 1; z < maxZ; z++) {
          boundary.push({ x: minX, y, z });
          if (minX !== maxX) {
            boundary.push({ x: maxX, y, z });
          }
        }
      } else {
        for (let x = minX; x <= maxX; x++) {
          for (let z = minZ; z <= maxZ; z++) {
            boundary.push({ x, y: minY, z });
            if (minY !== maxY) {
              boundary.push({ x, y: maxY, z });
            }
          }
        }
        for (let y = minY + 1; y < maxY; y++) {
          boundary.push({ x: minX, y, z: minZ });
          if (minZ !== maxZ) {
            boundary.push({ x: minX, y, z: maxZ });
          }
          if (minX !== maxX) {
            boundary.push({ x: maxX, y, z: minZ });
            if (minZ !== maxZ) {
              boundary.push({ x: maxX, y, z: maxZ });
            }
          }
        }
      }
      return boundary;
    }
    world4.afterEvents.playerBreakBlock.subscribe((event) => {
      const block = event.block;
      const blockLocation = block.location;
      const brokenBlockPermutation = event.brokenBlockPermutation;
      const beforeBlockTypeId = brokenBlockPermutation.type.id;
      if (minecraftFrameTypes.includes(beforeBlockTypeId)) {
        const itemFrameIndex = world4.itemFrameList.findIndex(
          (itemFrame) => areVectorsEqual(itemFrame.location, blockLocation)
        );
        if (itemFrameIndex >= 0) {
          world4.itemFrameList.splice(itemFrameIndex, 1);
        }
      }
    });
    world4.afterEvents.playerPlaceBlock.subscribe((event) => {
      const block = event.block;
      const blockLocation = block.location;
      const blockDimension = event.dimension;
      if (minecraftFrameTypes.includes(block.typeId) && !world4.itemFrameList.some(
        (itemFrame) => areVectorsEqual(itemFrame.location, blockLocation)
      )) {
        world4.itemFrameList.push({
          dimensionId: blockDimension.id,
          location: blockLocation
        });
      }
    });
    world4.afterEvents.playerInteractWithBlock.subscribe((event) => {
      const block = event.block;
      const blockLocation = block.location;
      const blockDimension = block.dimension;
      if (minecraftFrameTypes.includes(block.typeId) && !world4.itemFrameList.some((itemFrame) => areVectorsEqual(itemFrame.location, blockLocation))) {
        world4.itemFrameList.push({
          dimensionId: blockDimension.id,
          location: blockLocation
        });
      }
    });
    world4.afterEvents.entityDie.subscribe((event) => {
      const deadEntity = event.deadEntity;
      deadEntity.isDead = true;
    });
    world4.afterEvents.playerSpawn.subscribe((event) => {
      const player = event.player;
      player.isDead = false;
    });
    Array.prototype.remove = function(value) {
      const index = this.indexOf(value);
      if (index !== -1) {
        this.splice(index, 1);
      }
      return this;
    };
    var minecraftFrameTypes = ["minecraft:frame", "minecraft:glow_frame"];
    Block4.prototype.getFrameItem = function() {
      if (minecraftFrameTypes.includes(this.typeId)) {
        const item = this.getItemStack();
        if (item === void 0) {
          return void 0;
        }
        return item.typeId !== this.typeId ? item : void 0;
      }
      return void 0;
    };
    Dimension2.prototype.placeStructureFrame = function(location, structureType, isEnchanted, rotation = "north") {
      const structureManager = world4.structureManager;
      const block = this.getBlockSafe(location);
      if (block) {
        const item = block.getFrameItem();
        const itemIsEnchanted = item !== void 0 && Boolean(
          item.getComponent(ItemComponentTypes.Enchantable)?.getEnchantments().length
        );
        if (!item || item.typeId.replace("tektopia:structure_", "") !== structureType || itemIsEnchanted !== isEnchanted) {
          const structureRotation = rotationToStructureRotation(rotation);
          structureManager.place(
            `mystructure:structure_${structureType}${isEnchanted ? "_enchanted" : ""}`,
            this,
            location,
            { rotation: structureRotation }
          );
        }
      }
    };
    Block4.prototype.northSafe = function() {
      try {
        return this.north();
      } catch {
        return void 0;
      }
    };
    Block4.prototype.eastSafe = function() {
      try {
        return this.east();
      } catch {
        return void 0;
      }
    };
    Block4.prototype.southSafe = function() {
      try {
        return this.south();
      } catch {
        return void 0;
      }
    };
    Block4.prototype.westSafe = function() {
      try {
        return this.west();
      } catch {
        return void 0;
      }
    };
    Block4.prototype.aboveSafe = function() {
      try {
        return this.above();
      } catch {
        return void 0;
      }
    };
    Block4.prototype.belowSafe = function() {
      try {
        return this.below();
      } catch {
        return void 0;
      }
    };
    Block4.prototype.offsetSafe = function(offset) {
      try {
        return this.offset(offset);
      } catch {
        return void 0;
      }
    };
    Dimension2.prototype.getBlockSafe = function(location) {
      try {
        return this.getBlock(location);
      } catch {
        return void 0;
      }
    };
    function main() {
      world4.loadData();
      Block4.prototype.getIsSolid = function() {
        return this.isSolid || Registry.solidBlocksSet.has(this.typeId);
      };
      Block4.prototype.canPathThrough = function() {
        return this.canWalkThrough() || Registry.doorTypes.includesFast(this.typeId);
      };
      Block4.prototype.destroyableLeaf = function() {
        return Registry.leafTypes.includesFast(this.typeId) && !this.permutation.getState("persistent_bit");
      };
      system4.runInterval(() => {
        if (!world4.loadedData) {
          return;
        }
        const tickSpeed = Math.floor(1e3 / (Date.now() - lastTickTime));
        lastTickTime = Date.now();
        averageTickRateList.push(tickSpeed);
        if (averageTickRateList.length > 20) {
          averageTickRateList.shift();
        }
        const averageTickRate = calculateAverage(averageTickRateList);
        const players = world4.getAllPlayers();
        for (const player of players) {
          player.onScreenDisplay.setActionBar(fix(averageTickRate).toString());
        }
        const villagers = world4.getVillagers();
        for (let i = 0; i < villagers.length; i++) {
          const villager = villagers[i];
          try {
            villager.tickAI();
          } catch (error) {
            console.warn("Villager tick failed: ", error);
          }
        }
      });
      system4.runInterval(() => {
        if (!world4.loadedData) {
          return;
        }
        const villageList = world4.getVillages();
        for (let i = 0; i < villageList.length; i++) {
          const village = villageList[i];
          const dimension = world4.getDimension(village.dimensionId);
          if (!village.searchingBlocks) {
            const doorBlock = dimension.getBlockSafe(village.doorLocation);
            if (doorBlock) {
              village.searchingBlocks = true;
              system4.runJob(
                searchBlocks(village, doorBlock, true, function() {
                  village.searchingBlocks = false;
                })
              );
            }
          }
          if (!village.deletingInvalidNodes) {
            village.deletingInvalidNodes = true;
            system4.runJob(deleteInvalidPathNodes());
            function* deleteInvalidPathNodes() {
              const allVillagePathNodes = Object.keys(village.pathNodes);
              try {
                for (let j = 0; j < allVillagePathNodes.length; j++) {
                  if (!village.isValid) {
                    return;
                  }
                  const pathNodeLocation = allVillagePathNodes[j];
                  checkNodeValidity(village, pathNodeLocation);
                  yield;
                }
              } finally {
                village.deletingInvalidNodes = false;
              }
            }
          }
        }
      }, 100);
      function tickScanItemFrames() {
        system4.runJob(scanItemFrames(() => system4.runTimeout(tickScanItemFrames, 100)));
      }
      system4.run(tickScanItemFrames);
      function* scanItemFrames(callback) {
        try {
          const villageItemFrameLocations = [];
          for (let i = 0; i < world4.itemFrameList.length; i++) {
            const itemFrame = world4.itemFrameList[i];
            const dimension = world4.getDimension(itemFrame.dimensionId);
            const itemFrameBlock = dimension.getBlockSafe(itemFrame.location);
            if (itemFrameBlock !== void 0) {
              const block = itemFrameBlock;
              const item = block.getFrameItem();
              const blockCenter = block.center();
              const blockCenterString = vectorToString(blockCenter);
              if (item !== void 0 && item.typeId.startsWith("tektopia:structure_")) {
                const facingDirection = block.permutation.getState("facing_direction");
                if (!(facingDirection in itemFrameRotations)) {
                  if (item.typeId === "tektopia:structure_townhall") {
                    villageItemFrameLocations.push(blockCenterString);
                  }
                  continue;
                }
                const rotation = itemFrameRotations[facingDirection];
                const structureId = item.typeId.replace("tektopia:structure_", "");
                itemFrame.structureId = structureId;
                let doorLocation;
                function* checkStructureValidation() {
                  if (!cardinalDirectionList.includes(rotation)) {
                    return false;
                  }
                  const itemFrameOnBlock = block.offsetSafe(
                    directionToVector(rotation)
                  );
                  if (!itemFrameOnBlock) {
                    return false;
                  }
                  const oppositeRotation = getOppositeDirection(rotation);
                  const offsetList = [{ x: 0, y: -1, z: 0 }].concat(
                    cardinalDirectionList.filter(
                      (direction) => direction !== rotation && direction !== oppositeRotation
                    ).map((direction) => directionToVector(direction))
                  );
                  let foundDoor;
                  for (let i2 = 0; i2 < offsetList.length; i2++) {
                    const offset = offsetList[i2];
                    const checkBlock = itemFrameOnBlock.offsetSafe(offset);
                    if (!checkBlock) {
                      return false;
                    }
                    if (Registry.doorTypes.includes(checkBlock.typeId)) {
                      foundDoor = checkBlock;
                    }
                  }
                  if (!foundDoor) {
                    return false;
                  }
                  doorLocation = addVector(foundDoor.location, "y", -1);
                  const doorBlock = dimension.getBlockSafe(doorLocation);
                  if (doorBlock === void 0) {
                    return void 0;
                  }
                  if (!Registry.doorTypes.includes(doorBlock.typeId)) {
                    return false;
                  }
                  const villageList = world4.getVillages();
                  if (structureId === "townhall") {
                    if (villageList.filter((village) => village.centerString !== blockCenterString).some((village) => calculateSquareDistance(village.center, blockCenter, true) < 200)) {
                      return false;
                    }
                  } else {
                    if (!villageList.some((village) => calculateSquareDistance(village.center, blockCenter, true) <= 100)) {
                      return false;
                    }
                  }
                  const floorBlockList = [];
                  const startingLocation = addVectors(
                    doorBlock,
                    directionToVector(rotation)
                  );
                  const checkLocationList = [
                    {
                      floor: getFloorBlock(startingLocation),
                      ceiling: getCeilingBlock(startingLocation)
                    }
                  ];
                  const alreadyCheckedLocations = /* @__PURE__ */ new Set([vectorToString(addVector(doorLocation, "y", -1))]);
                  let steps = 0;
                  while (checkLocationList.length) {
                    const currentLocation = checkLocationList.shift();
                    if (currentLocation !== void 0) {
                      if (currentLocation.ceiling && currentLocation.floor) {
                        if (currentLocation.ceiling.y - currentLocation.floor.y > 2) {
                          const floorLocationString = vectorToString(
                            currentLocation.floor
                          );
                          if (!alreadyCheckedLocations.has(floorLocationString)) {
                            alreadyCheckedLocations.add(floorLocationString);
                            floorBlockList.push(currentLocation.floor.aboveSafe());
                            const offsetList2 = [
                              { x: 1, y: 0, z: 0 },
                              { x: -1, y: 0, z: 0 },
                              { x: 0, y: 0, z: 1 },
                              { x: 0, y: 0, z: -1 }
                            ];
                            for (let i2 = 0; i2 < offsetList2.length; i2++) {
                              const offset = offsetList2[i2];
                              const offsetLocation = addVectors(
                                currentLocation.floor,
                                offset
                              );
                              if (!alreadyCheckedLocations.has(
                                vectorToString(offsetLocation)
                              )) {
                                const checkLocation = addVector(offsetLocation, "y", 1);
                                let floorBlock = getFloorBlock(checkLocation)?.aboveSafe();
                                while (floorBlock?.isSolid) {
                                  floorBlock = floorBlock.aboveSafe();
                                }
                                if (!floorBlock) {
                                  return void 0;
                                }
                                const ceilingBlock = getCeilingBlock(
                                  floorBlock.location
                                );
                                floorBlock = floorBlock.belowSafe();
                                if (floorBlock && ceilingBlock && ceilingBlock.y - floorBlock.y > 2 && currentLocation.ceiling.y - floorBlock.y > 2 && ceilingBlock.y - checkLocation.y >= 2) {
                                  checkLocationList.push({
                                    floor: floorBlock,
                                    ceiling: ceilingBlock
                                  });
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                    if (++steps % 5 === 0) {
                      yield;
                    }
                  }
                  if (floorBlockList.length < 9) {
                    return false;
                  }
                  return true;
                  function getFloorBlock(location) {
                    return dimension.getBlockBelow(location, {
                      maxDistance: 32,
                      includeLiquidBlocks: false,
                      includePassableBlocks: false
                    });
                  }
                  function getCeilingBlock(location) {
                    return dimension.getBlockAbove(location, {
                      maxDistance: 32,
                      includeLiquidBlocks: false,
                      includePassableBlocks: false
                    });
                  }
                }
                const result = yield* checkStructureValidation();
                if (!block.isValid) {
                  if (item.typeId === "tektopia:structure_townhall") {
                    villageItemFrameLocations.push(blockCenterString);
                  }
                  continue;
                }
                if (result !== void 0) {
                  if (result && doorLocation !== void 0) {
                    if (structureId === "townhall") {
                      villageItemFrameLocations.push(blockCenterString);
                      const villageList = world4.getVillages();
                      const villageStringCenterList = villageList.map(
                        (village) => village.centerString
                      );
                      if (!villageStringCenterList.includes(blockCenterString)) {
                        world4.villageList.push(
                          Village.createData(blockCenter, dimension.id, doorLocation)
                        );
                      }
                    }
                  }
                  dimension.placeStructureFrame(
                    block.location,
                    structureId,
                    result,
                    rotation
                  );
                } else if (structureId === "townhall") {
                  villageItemFrameLocations.push(blockCenterString);
                }
              } else {
                itemFrame.structureId = void 0;
              }
            } else if (itemFrame.structureId === "townhall") {
              villageItemFrameLocations.push(
                vectorToString(centerVector(itemFrame.location))
              );
            }
            yield;
          }
          const keep = new Set(villageItemFrameLocations);
          for (let i = world4.villageList.length - 1; i >= 0; i--) {
            if (!keep.has(vectorToString(world4.villageList[i].center))) {
              world4.villageList.splice(i, 1);
            }
          }
        } finally {
          if (callback !== void 0) {
            callback();
          }
        }
      }
      function tickUpdateVillage() {
        system4.runJob(updateVillageBlocks(tickUpdateVillage));
      }
      system4.run(tickUpdateVillage);
      function* updateVillageBlocks(callback) {
        try {
          if (!world4.loadedData) {
            return;
          }
          const villageList = world4.getVillages();
          for (const village of villageList) {
            if (!village.isValid) {
              continue;
            }
            const dimension = world4.getDimension(village.dimensionId);
            for (let i = 0; i < village.saplingLocations.length; i++) {
              const locationString = village.saplingLocations[i];
              const location = stringToVector(locationString);
              const block = dimension.getBlockSafe(location);
              if (block === void 0) {
                continue;
              }
              if (Registry.logTypes.includesFast(block.typeId)) {
                village.saplingLocations.splice(i, 1);
                i--;
                village.treeLocations.push(locationString);
              } else if (!Registry.saplingTypes.includesFast(block.typeId)) {
                village.saplingLocations.splice(i, 1);
                i--;
              }
              yield;
            }
            yield;
          }
        } finally {
          if (callback !== void 0) {
            callback();
          }
        }
      }
    }
    world4.afterEvents.worldLoad.subscribe(() => {
      main();
    });
  }
});
export default require_main();
//# sourceMappingURL=main.js.map
