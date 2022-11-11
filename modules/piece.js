import {
  SQUARE_RANGE,
  DOUBLE_SQUARE_RANGE,
  L_RANGE,
  LINE_OF_SIGHT,
  MOVEMENT_DIRECTION_COLUMN,
  MOVEMENT_DIRECTION_LINE,
  MOVEMENT_DIRECTION_DIAGONAL,
  MOVEMENT_DIRECTION_L,
  SUBTYPE_DIAG_MAIN_BEGIN,
  SUBTYPE_DIAG_OPPOSITE_END,
  SUBTYPE_COLUMN_NORTH,
  SPECIAL_MOVEMENT_CASTLE,
  SPECIAL_MOVEMENT_EN_PASSANT,
  SPECIAL_MOVEMENT_PROMOTE,
} from "./movement.js";

import {
  SQUARE_TYPE_PAWN_PIECE,
  SQUARE_TYPE_HIGHVALUE_PIECE,
  SQUARE_TYPE_KNIGHT_PIECE,
  SQUARE_TYPE_BISHOP_PIECE,
  SQUARE_TYPE_QUEEN_PIECE,
  SQUARE_TYPE_KING_PIECE,
  SQUARE_TYPE_ROOK_PIECE,
} from "./board.js";

// ROOK
/**
 * @constant {number bitwise flag} @default
 */
export const ROOK_INITIAL_MOVEMENT =
  MOVEMENT_DIRECTION_COLUMN | MOVEMENT_DIRECTION_LINE | SPECIAL_MOVEMENT_CASTLE;
/**
 * @constant {number bitwise flag} @default
 */
export const ROOK_CASTLED_MOVEMENT = ROOK_INITIAL_MOVEMENT ^ SPECIAL_MOVEMENT_CASTLE;
/**
 * @constant {number bitwise flag} @default
 */
export const ROOK_MOVEMENT_RANGE = LINE_OF_SIGHT;

// KNIGHT
/**
 * @constant {number bitwise flag} @default
 */
export const KNIGHT_INITIAL_MOVEMENT = MOVEMENT_DIRECTION_L;
/**
 * @constant {number bitwise flag} @default
 */
export const KNIGHT_MOVEMENT_RANGE = L_RANGE; // 2 movements 4way expressed

// BISHOP
/**
 * @constant {number bitwise flag} @default
 */
export const BISHOP_INITIAL_MOVEMENT = MOVEMENT_DIRECTION_DIAGONAL;
/**
 * @constant {number bitwise flag} @default
 */
export const BISHOP_MOVEMENT_RANGE = LINE_OF_SIGHT;

// QUEEN
/**
 * @constant {number bitwise flag} @default
 */
export const QUEEN_INITIAL_MOVEMENT =
  MOVEMENT_DIRECTION_COLUMN | MOVEMENT_DIRECTION_LINE | MOVEMENT_DIRECTION_DIAGONAL;
/**
 * @constant {number bitwise flag} @default
 */
export const QUEEN_MOVEMENT_RANGE = LINE_OF_SIGHT;

// KING
/**
 * @constant {number bitwise flag} @default
 */
export const KING_INITIAL_MOVEMENT =
  SPECIAL_MOVEMENT_CASTLE |
  MOVEMENT_DIRECTION_COLUMN |
  MOVEMENT_DIRECTION_LINE |
  MOVEMENT_DIRECTION_DIAGONAL;
/**
 * @constant {number bitwise flag} @default
 */
export const KING_CASTLED_MOVEMENT = KING_INITIAL_MOVEMENT ^ SPECIAL_MOVEMENT_CASTLE;
/**
 * @constant {number bitwise flag} @default
 */
export const KING_MOVEMENT_RANGE = SQUARE_RANGE;

// PAWN
/**
 * @constant {number bitwise flag} @default
 */
export const PAWN_INITIAL_MOVEMENT =
  MOVEMENT_DIRECTION_COLUMN |
  SUBTYPE_COLUMN_NORTH |
  MOVEMENT_DIRECTION_DIAGONAL |
  SUBTYPE_DIAG_MAIN_BEGIN |
  SUBTYPE_DIAG_OPPOSITE_END |
  SPECIAL_MOVEMENT_PROMOTE |
  SPECIAL_MOVEMENT_EN_PASSANT;
/**
 * @constant {number bitwise flag} @default
 */
export const PAWN_PASSE_MOVEMENT = PAWN_INITIAL_MOVEMENT ^ SPECIAL_MOVEMENT_EN_PASSANT;
/**
 * @constant {number bitwise flag} @default
 */
export const PAWN_INITIAL_RANGE = DOUBLE_SQUARE_RANGE;
/**
 * @constant {number bitwise flag} @default
 */
export const PAWN_MOVED_RANGE = SQUARE_RANGE;

/**
 * @constant {number} @default
 * Numero Magico
 */
export const THE_PIECE = 99;

/**
 * @constant {character} @default
 */
export const PIECE_TYPE_ROOK = "R";
/**
 * @constant {character} @default
 */
export const PIECE_TYPE_KNIGHT = "N";
/**
 * @constant {character} @default
 */
export const PIECE_TYPE_BISHOP = "B";
/**
 * @constant {character} @default
 */
export const PIECE_TYPE_QUEEN = "Q";
/**
 * @constant {character} @default
 */
export const PIECE_TYPE_KING = "K";
/**
 * @constant {character} @default
 */
export const PIECE_TYPE_PAWN = "P";
/**
 * @constant {character} @default
 */
export const PIECE_TYPE_NONE = 0;
/**
 * @constant {Array} @default
 */
export const pieceColumnLookup = [
  PIECE_TYPE_ROOK,
  PIECE_TYPE_KNIGHT,
  PIECE_TYPE_BISHOP,
  PIECE_TYPE_QUEEN,
  PIECE_TYPE_KING,
  PIECE_TYPE_PAWN,
  PIECE_TYPE_NONE,
];
/**
 * @constant {Array} @default
 */
export const pieceTypeByColumn = [
  SQUARE_TYPE_ROOK_PIECE, // a
  SQUARE_TYPE_KNIGHT_PIECE, // b
  SQUARE_TYPE_BISHOP_PIECE, // c
  SQUARE_TYPE_QUEEN_PIECE, // d
  SQUARE_TYPE_KING_PIECE, // e
  SQUARE_TYPE_BISHOP_PIECE, // f
  SQUARE_TYPE_KNIGHT_PIECE, // g
  SQUARE_TYPE_ROOK_PIECE, // h
];
/**
 * @constant {string} @default
 */
export const FRIENDLY_SIDE = "FRIENDLY";
/**
 * @constant {string} @default
 */
export const ENEMY_SIDE = "ENEMY";
/**
 * @constant {string} @default
 */
export const BLANK_SIDE = "NEUTRAL";
/**
 * @constant {Array} @default
 */
export const PLAYER_SIDES = [FRIENDLY_SIDE, ENEMY_SIDE];
/**
 * @constant {Array} @default
 */
export const ALL_SIDES = [FRIENDLY_SIDE, ENEMY_SIDE, BLANK_SIDE];
/**
 * @constant {Array} @default
 */
export const EMBEDDED_CASTLE_PIECES = [SQUARE_TYPE_KING_PIECE, SQUARE_TYPE_ROOK_PIECE];
/**
 * @constant {number} @default
 */
export const WHITE_COLOR = 0;
/**
 * @constant {number} @default
 */
export const BLACK_COLOR = 1;
/**
 * @constant {Array} @default
 */
export const avaliableColors = ["WHITEPIECE", "BLACKPIECE"];
/**
 * @constant {string} @default
 */
export const PROMOTION_PIECES = pieceTypeByColumn.slice(0, 4);
