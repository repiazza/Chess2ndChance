import "./types.js";
/**
 * @constant {number} @default
 */
export const MOVEMENT_CHAIN_ORIGIN = 0;
/**
 * @constant {number} @default
 */
export const MOVEMENT_CHAIN_DESTINATION = 1;
/**
 * @constant {number} @default
 */
export const DEFAULT_MOVEMENT_SELECTION = 1;
/**
 * @constant {number} @default
 */
export const CASTLE_MOVEMENT_SELECTION = 2;
/**
 * @constant {number} @default
 */
export const EN_PASSANT_MOVEMENT_SELECTION = 3;
/**
 * @constant {number} @default
 */
export const PROMOTION_MOVEMENT_SELECTION = 4;
/**
 * @constant {number} @default
 */
export const SHORT_CASTLE_TYPE = 0x01;
/**
 * @constant {number} @default
 */
export const LONG_CASTLE_TYPE = 0x02;
/**
 * @constant {number} @default SHORT_CASTLE_TYPE | LONG_CASTLE_TYPE;
 */
export const BOTH_CASTLE_TYPE = SHORT_CASTLE_TYPE | LONG_CASTLE_TYPE;
/**
 * @constant {boolean} @default false
 */
export const GET_BOOLEAN_POSSIBILITY = false;
/**
 * @constant {boolean} @default false
 */
export const GET_POSSIBLE_TYPES = true;
/**
 * @constant {boolean} @default false
 */
export const CONSIDER_COLISION = false;
/**
 * @constant {boolean} @default true
 */
export const IGNORE_COLISION = true;
/**
 * @constant {number} @default
 */
export const WEST = 0;
/**
 * @constant {number} @default
 */
export const EAST = 1;
/**
 * @constant {number} @default
 */
export const NORTH = 2;
/**
 * @constant {number} @default
 */
export const SOUTH = 3;
/**
 * @constant {Array} @default
 */
export const NORTH_WEST = [WEST, NORTH];
/**
 * @constant {Array} @default
 */
export const NORTH_EAST = [EAST, NORTH];
/**
 * @constant {Array} @default
 */
export const SOUTH_WEST = [WEST, SOUTH];
/**
 * @constant {Array} @default
 */
export const SOUTH_EAST = [EAST, SOUTH];
/**
 * @constant {[][]}
 * @default [ [ EAST ] [ EAST EAST ] [ EAST EAST EAST ] ]
 */
export const LONG_CASTLE = [[EAST], [EAST, EAST], [EAST, EAST, EAST]];
/**
 * @constant {[][]}
 * @default [ [ WEST ] [ WEST WEST ] ]
 */
export const SHORT_CASTLE = [[WEST], [WEST, WEST]];
/**
 * @constant {[][]}
 * @default [ LONG_CASTLE SHORT_CASTLE ]
 */
export const BOTH_CASTLE = [LONG_CASTLE, SHORT_CASTLE];
/**
 * @constant {Array} @default [ NORTH SOUTH ]
 */
export const DIRECTION_VERTICAL = [NORTH, SOUTH];
/**
 * @constant {Array} @default
 */
export const DIRECTION_HORIZONTAL = [WEST, EAST];
/**
 * @constant {Array} @default
 */
export const DIRECTION_DIAGONAL = [NORTH_EAST, NORTH_WEST, SOUTH_WEST, SOUTH_EAST];

export const FIRST_L_QUADRANT = [
  [NORTH_WEST, NORTH],
  [NORTH_EAST, NORTH],
];
export const SECOND_L_QUADRANT = [
  [NORTH_EAST, EAST],
  [SOUTH_EAST, EAST],
];
export const THIRD_L_QUADRANT = [
  [SOUTH_EAST, SOUTH],
  [SOUTH_WEST, SOUTH],
];
export const FOURTH_L_QUADRANT = [
  [SOUTH_WEST, WEST],
  [NORTH_WEST, WEST],
];
export const L_ROTATE = [
  FIRST_L_QUADRANT,
  SECOND_L_QUADRANT,
  THIRD_L_QUADRANT,
  FOURTH_L_QUADRANT,
];

export const SQUARE_RANGE = 1;
export const DOUBLE_SQUARE_RANGE = 2;
export const L_RANGE = 4;
export const LINE_OF_SIGHT = 8;
export const RANGE_TYPE_NONE = 0;

export const MOVEMENT_TYPE_NONE = 0;

/**
 * @constant @type {bitwiseCumullativeFlag}
 * @default 0x01 (= 0001)
 */
export const MOVEMENT_DIRECTION_COLUMN = 0x01;
/**
 * @constant @type {bitwiseCumullativeFlag}
 * @default 0x02 (= 0010)
 */
export const MOVEMENT_DIRECTION_LINE = 0x02;
/**
 * @constant @type {bitwiseCumullativeFlag}
 * @default 0x04 (= 0100)
 */
export const MOVEMENT_DIRECTION_DIAGONAL = 0x04;
/**
 * @constant @type {bitwiseCumullativeFlag}
 * @default 0x08 (= 1000)
 */
export const MOVEMENT_DIRECTION_L = 0x08;

//
// Notacao de Diagonais segmentadas.
// Algumas peças necessitam mover-se ou
// "conhecer" apenas parte das diagonais.
// Como é o caso da captura do Peão.
// Apenas conhece as partes superiores das
// diagonais principal e oposta.
//
/**
 * @constant @type {bitwiseCumullativeFlag}
 * @default 0x10 (= 0001 0000)
 */
export const SUBTYPE_DIAG_MAIN_BEGIN = 0x10;
/**
 * @constant @type {bitwiseCumullativeFlag}
 * @default 0x20 (= 0010 0000)
 */
export const SUBTYPE_DIAG_MAIN_END = 0x20;
/**
 * @constant @type {bitwiseCumullativeFlag}
 * @default 0x40 (= 0100 0000)
 */
export const SUBTYPE_DIAG_OPPOSITE_BEGIN = 0x40;
/**
 * @constant @type {bitwiseCumullativeFlag}
 * @default 0x80 (= 1000 0000)
 */
export const SUBTYPE_DIAG_OPPOSITE_END = 0x80;

/**
 * @constant @type {bitwiseCumullativeFlag}
 * @default 0x400 (= 0100 0000 0000)
 */
export const SUBTYPE_COLUMN_NORTH = 0x400;
/**
 * @constant @type {bitwiseCumullativeFlag}
 * @default 0x800 (= 1000 0000 0000)
 */
export const SUBTYPE_COLUMN_SOUTH = 0x800;
/**
 * @constant @type {bitwiseCumullativeFlag}
 * @default 0x1000 (= 0001 0000 0000 0000)
 */
export const SUBTYPE_LINE_WEST = 0x1000;
/**
 * @constant @type {bitwiseCumullativeFlag}
 * @default 0x2000 (= 0010 0000 0000 0000)
 */
export const SUBTYPE_LINE_EAST = 0x2000;
//
// Notação dos movimentos especiais do xadrez:
// - Roque
// - En Passant
// - Promoção de peça
//
/**
 * @constant @type {bitwiseCumullativeFlag}
 * @default 0x4000 (= 0100 0000 0000 0000)
 */
export const SPECIAL_MOVEMENT_CASTLE = 0x4000;
/**
 * @constant @type {bitwiseCumullativeFlag}
 * @default 0x8000 (= 1000 0000 0000 0000)
 */
export const SPECIAL_MOVEMENT_EN_PASSANT = 0x8000;
/**
 * @constant @type {bitwiseCumullativeFlag}
 * @default 0x10000 (= 0001 0000 0000 0000 0000)
 */
export const SPECIAL_MOVEMENT_PROMOTE = 0x10000;

export const MOVEMENT_CASTLE_SHORT = 1;
export const MOVEMENT_CASTLE_LONG = 2;
export const MOVEMENT_CASTLE_BOTH = 3;
//
// Notação de movimentos compostos.
// Junção de um ou mais movimentos especificos
//
/**
 * @constant @type {bitwiseCumullativeFlag}
 * @default SPECIAL_MOVEMENT_CASTLE | SPECIAL_MOVEMENT_EN_PASSANT | SPECIAL_MOVEMENT_PROMOTE
 * ou 0x1C000 (= 0001 1100 0000 0000 0000)
 */
export const SPECIAL_MOVEMENT_ALL =
  SPECIAL_MOVEMENT_CASTLE | SPECIAL_MOVEMENT_EN_PASSANT | SPECIAL_MOVEMENT_PROMOTE;

/**
 * @constant @type {bitwiseCumullativeFlag}
 *
 * Todas as subdiagonais
 *
 * @default 0xF0 (= 1111 0000)
 */
export const SUBTYPE_DIAG_ALL =
  SUBTYPE_DIAG_MAIN_BEGIN |
  SUBTYPE_DIAG_MAIN_END |
  SUBTYPE_DIAG_OPPOSITE_BEGIN |
  SUBTYPE_DIAG_OPPOSITE_END;

export const MAIN_DIAGONAL = SUBTYPE_DIAG_MAIN_BEGIN | SUBTYPE_DIAG_MAIN_END;
export const OPPOSITE_DIAGONAL = SUBTYPE_DIAG_OPPOSITE_BEGIN | SUBTYPE_DIAG_OPPOSITE_END;
//
// Full movement notation
//
export const MOVEMENT_DIAGONAL_X = MAIN_DIAGONAL | OPPOSITE_DIAGONAL;
export const MOVEMENT_DIRECTION_ALL =
  MOVEMENT_DIRECTION_COLUMN |
  MOVEMENT_DIRECTION_LINE |
  MOVEMENT_DIRECTION_DIAGONAL |
  MOVEMENT_DIRECTION_L;

export const MOVEMENT_COLUMN_ALL = SUBTYPE_COLUMN_NORTH | SUBTYPE_COLUMN_SOUTH;
export const MOVEMENT_LINE_ALL = SUBTYPE_LINE_WEST | SUBTYPE_LINE_EAST;
export const MOVEMENT_MAIN_ALL =
  MOVEMENT_COLUMN_ALL | MOVEMENT_LINE_ALL | SUBTYPE_DIAG_ALL;

export const MOVEMENT_DIRECTION_SUBTYPE_ALL = MOVEMENT_DIRECTION_ALL | MOVEMENT_MAIN_ALL;
export const MOVEMENT_TYPE_ALL =
  MOVEMENT_DIRECTION_ALL | MOVEMENT_MAIN_ALL | SPECIAL_MOVEMENT_ALL;

//
// Movement coordinates
//

export const NORTH_EAST_DIRECTION = "nesq";
export const NORTH_WEST_DIRECTION = "nwsq";
export const SOUTH_EAST_DIRECTION = "sesq";
export const SOUTH_WEST_DIRECTION = "swsq";
export const NORTH_DIRECTION = "nsq"; // nsq = (N)orth (Sq)uare
export const WEST_DIRECTION = "wsq";
export const SOUTH_DIRECTION = "ssq";
export const EAST_DIRECTION = "esq";
export const LINE_DIRECTION = [WEST_DIRECTION, EAST_DIRECTION];
export const COLUMN_DIRECTION = [SOUTH_DIRECTION, NORTH_DIRECTION];
export const MAIN_DIAGONAL_DIRECTION = [NORTH_WEST_DIRECTION, SOUTH_EAST_DIRECTION];
export const OPPOSITE_DIAGONAL_DIRECTION = [SOUTH_WEST_DIRECTION, NORTH_EAST_DIRECTION];
export const DIAGONAL_DIRECTION = [MAIN_DIAGONAL_DIRECTION, OPPOSITE_DIAGONAL_DIRECTION];
export const ALL_DIRECTION = [
  NORTH_EAST_DIRECTION,
  NORTH_WEST_DIRECTION,
  SOUTH_EAST_DIRECTION,
  SOUTH_WEST_DIRECTION,
  NORTH_DIRECTION,
  WEST_DIRECTION,
  SOUTH_DIRECTION,
  EAST_DIRECTION,
];

export const CROSS_DIRECTION = LINE_DIRECTION.concat(COLUMN_DIRECTION);
export const STAR_DIRECTION = CROSS_DIRECTION.concat(MAIN_DIAGONAL_DIRECTION).concat(
  OPPOSITE_DIAGONAL_DIRECTION
);
