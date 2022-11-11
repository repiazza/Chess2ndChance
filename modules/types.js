/**
 * Multidimensional Array
 *
 * Ex.: [
 *          [CONTENT1, CONTENT2],
 *          [CONTENT3, CONTENT4],
 *      ]
 * @typedef {Array[]} ArrayOfArray
 */

/**
 * Array of fixed string types
 *
 * Ex.: Array ["value", "other value"]
 * @typedef {Array} ArrayOfString
 */

/**
 * Array of fixed numeric types
 *
 *  Ex.: Array [1, 4, 10, 20018]
 * @typedef {Array} ArrayOfNumber
 */

/**
 * Array of characters types or strings with lenght 1 elements
 *
 *  Ex.: Array ['c', 'a', 'r', 'l']
 * @typedef {Array} ArrayOfChar
 */

/**
 * A string with only uppercase characters
 * Commonly used on defines (consts)
 *
 *  Ex.: "SAMPLE STRING", "THISISUPPERCASE"
 * @typedef {string} upperCaseString
 */

/**
 * A string with only lowercase characters
 * commonly used on primitive types
 *
 *  Ex.: "samplelower", "int", "char"
 * @typedef {string} lowerCaseString
 */

/**
 * A standard for naming variables and functions
 *
 * Ex.: "sampleFunctionName", "myOnlyVariable", "imLovingThis"
 * @typedef {string} camelCaseString
 */

/**
 * Hexadecimal integer notation for flaggin bitwise
 *
 *   Ex.: "0x10", "0xAF", "0x02"
 * @typedef {number} bitwiseCumullativeFlag
 */

export {
  ArrayOfArray,
  ArrayOfChar,
  ArrayOfNumber,
  ArrayOfString,
  bitwiseCumullativeFlag,
  camelCaseString,
  lowerCaseString,
  upperCaseString,
};
