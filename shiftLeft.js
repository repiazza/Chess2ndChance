import "types.js";

/**
 * Hexadecimal integer notation for flaggin bitwise
 *
 *   Ex.: "0x10", "0xAF", "0x02"
 * @typedef {number} bitwiseCumullativeFlag
 */

/**
 * @type {bitwiseCumullativeFlag} @default
 * 0x01 == 0001
 */
let lDTerm = 0x1;
/**
 * @type {bitwiseCumullativeFlag} @default
 * 0x02 == 0010
 */
let lCTerm = 0x2;
/**
 * @type {bitwiseCumullativeFlag} @default
 * 0x03 == 0011
 */
let lBTerm = 0x3;
/**
 * @type {bitwiseCumullativeFlag} @default
 * 0x03 == 0011
 */
let lATerm = 0x4;

/**
 * @param @type {bitwiseCumullativeFlag}
 * @returns @type {bitwiseCumullativeFlag}
 */
function shiftLeft(bitwiseFlag) {
  return bitwiseFlag << 1;
}

console.log(shiftLeft(lDTerm));

// Ax^3 + Bx^2 + Cx^1 + D
//
// lATerm^3 + lBTerm^2 + lCTerm^1a + lDTerm
// Distancia -> Reta^ponto
// Reta <-> Distancia
// §Reta -> §Distancia -> Plano
// §Plano -> Solido
//
