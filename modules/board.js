// Board Composition
//  - Dimensions (sqxsq)
//  - Rows       (indexed by number (1-8))
//  - Columns    (indexed by letters(a-h))
//  - Squares    (composed by Column letter + Row Index)

// Square attributes:
// pn = PieceName
// pc = PieceColor
//

/**
 * @constant {number} @default
 */
export const TOTAL_PIECE_COUNT = 32;
/**
 * @constant {number} @default
 */
export const PLAYER_PIECE_COUNT = TOTAL_PIECE_COUNT / 2;
/**
 * @constant {number} @default
 */
export const ROW_SQUARE_COUNT = 8;
/**
 * @constant {number} @default
 */
export const COLUMN_SQUARE_ROW = 8;
/**
 * @constant {number} @default
 */
export const DARK_BGCOLOR = 0;
/**
 * @constant {number} @default
 */
export const LIGHT_BGCOLOR = 1;
/**
 * @constant {Array of Strings}
 * @default [ "columnmovhl" "linemovhl" "diagonalmovhl" "knightmovhl" "linemovhldark" ...]
 */
export const highlightStyles = [
  "columnmovhl",
  "linemovhl",
  "diagonalmovhl",
  "knightmovhl",
  "linemovhldark",
  "columnmovhldark",
  "diagonalmovhldark",
  "knightmovhldark",
  "capturehl",
  "capturehldark",
  "goldenrod",
  "goldenroddark",
  "silverbuenao",
  "silverbuenaodark",
];

/**
 * @constant @type {Array of Strings}
 * @default [ "capturehl" "capturehldark" ]
 */
export const captureStyles = ["capturehl", "capturehldark"];
/**
 * @constant @type {Array of Strings}
 * @default [ "goldenrod" "goldenroddark" "silverbuenao" "silverbuenaodark" ];
 */
export const specialPieceStyles = [
  "goldenrod",
  "goldenroddark",
  "silverbuenao",
  "silverbuenaodark",
];
/**
 * @constant @type {Array of Strings}
 * @default [ "darksquarecolor" "lightsquarecolor" ]
 */
export const bgBoardColors = ["darksquarecolor", "lightsquarecolor"];
/**
 * @constant @type {Array of chars}
 * @default [ "a" "b" "c" "d" "e" "f" "g" "h" ]
 */
export const columnArray = ["a", "b", "c", "d", "e", "f", "g", "h"];
/**
 * @constant @type {Array of chars}
 * @default [ "a" "b" "c" "d" "e" "f" "g" "h" ]
 */
export const revColumn = ["h", "g", "f", "e", "d", "c", "b", "a"];
/**
 * @constant {string} @default
 */
export const SQUARE_TYPE_BLACK_PIECE = "BLACKPIECE";
/**
 * @constant {string} @default
 */
export const SQUARE_TYPE_WHITE_PIECE = "WHITEPIECE";
/**
 * @constant {number} @default
 */
export const BLANK_SQUARE_COLOR = 0;
/**
 * @constant @type {Array of chars}
 * @default [ "2" "7" ];
 */
export const PAWN_INIT_ROWS = ["2", "7"];
/**
 * @constant @type {Array of chars}
 * @default [ "1" "8" ];
 */
export const HIGHVALUE_INIT_ROWS = ["1", "8"];
/**
 * @constant @type {Array of chars}
 * @default [ "1" "2" ];
 */
export const WHITEPIECE_INIT_ROWS = ["1", "2"];
/**
 * @constant @type {Array of chars}
 * @default [ "7" "8" ];
 */
export const BLACKPIECE_INIT_ROWS = ["7", "8"];
/**
 * @constant @type {Array of chars}
 * @default [ "3" "4" "5" "6" ];
 */
export const BLANKSQUARE_INIT_ROWS = ["3", "4", "5", "6"];
/**
 * @constant {number} @default
 */
export const GAME_CONTEXT_INITIAL = 0;
/**
 * @constant {number} @default
 */
export const GAME_CONTEXT_PLAYING = 1;
/**
 * @constant {number} @default
 */
export const GAME_CONTEXT_SKIP_PIECES = 2;
/**
 * @constant {number} @default
 */
export const GAME_CONTEXT_SKIP_SIDEPIECES = 3;
/**
 * @constant {string} @default
 */
export const VISIBILITY_VISIBLE = "visible";
/**
 * @constant {string} @default
 */
export const VISIBILITY_HIDDEN = "hidden";
/**
 * @constant {string} @default
 */
export const SQUARE_TYPE_PAWN_PIECE = "PAWNPIECE";
/**
 * @constant {string} @default
 */
export const SQUARE_TYPE_HIGHVALUE_PIECE = "NOTPAWNPIECE";
/**
 * @constant {string} @default
 */
export const SQUARE_TYPE_KNIGHT_PIECE = "KNIGHTPIECE";
/**
 * @constant {string} @default
 */
export const SQUARE_TYPE_BISHOP_PIECE = "BISHOPPIECE";
/**
 * @constant {string} @default
 */
export const SQUARE_TYPE_QUEEN_PIECE = "QUEENPIECE";
/**
 * @constant {string} @default
 */
export const SQUARE_TYPE_KING_PIECE = "KINGPIECE";
/**
 * @constant {string} @default
 */
export const SQUARE_TYPE_ROOK_PIECE = "ROOKPIECE";
/**
 * @constant {string} @default
 */
export const SQUARE_TYPE_BLANK = "BLANK";
/**
 * @constant {number} @default
 */
export const SQUARE_ALPHABETICAL_NDX = 0;
/**
 * @constant {number} @default
 */
export const SQUARE_NUMERIC_NDX = 1;
/**
 * @constant @type {Array of Strings}
 * @default [ "a1" "a8" ]
 */
export const LONG_CASTLE_INIT_SQUARES = ["a1", "a8"];
/**
 * @constant @type {Array of Strings}
 * @default [ "h1" "h8" ]
 */
export const SHORT_CASTLE_INIT_SQUARES = ["h1", "h8"];
/**
 * @constant @type {Array of Strings}
 * @default [ "d1" "d8" ]
 */
export const LONG_CASTLE_ROOK_SQUARES = ["d1", "d8"];
/**
 * @constant @type {Array of Strings}
 * @default [ "f1" "f8" ]
 */
export const SHORT_CASTLE_ROOK_SQUARES = ["f1", "f8"];
/**
 * @constant @type {Array of Strings}
 * @default [ "c1" "c8" ]
 */
export const LONG_CASTLE_KING_SQUARES = ["c1", "c8"];
/**
 * @constant @type {Array of Strings}
 * @default [ "g1" "g8" ]
 */
export const SHORT_CASTLE_KING_SQUARES = ["g1", "g8"];
/**
 * @constant @type {Array of chars}
 * @default "columnArray.slice(0, 5);"
 */
export const LONG_CASTLE_COLUMNS = columnArray.slice(0, 5);
/**
 * @constant @type {Array of chars}
 * @default "columnArray.slice(0, 5);"
 */
export const SHORT_CASTLE_COLUMNS = columnArray.slice(4, 8);
/**
 * @constant {number} @default
 */
export const LONG_CASTLE_NDX = 0;
/**
 * @constant {number} @default
 */
export const SHORT_CASTLE_NDX = 1;
/**
 * @constant {Array of Array} @default "[ LONG_CASTLE_INIT_SQUARES SHORT_CASTLE_INIT_SQUARES ]"
 */
export const CASTLE_INIT_SQUARES = [LONG_CASTLE_INIT_SQUARES, SHORT_CASTLE_INIT_SQUARES];
