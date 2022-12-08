import "./types.js";

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

import { playerColor } from "../mainboard.js";

////////////////////////////////
//
//  ROOK - TORRE
//

/**
 * @constant @type {bitwiseCumullativeFlag}
 *
 * Movimento Inicial da Torre.
 *
 * Move-se nas direções:
 *  - Linha(W - E).
 *  - Coluna(S - N).
 *  - Pode mover-se em todos os sentidos
 *  - Roque:
 *    º Linha ou W - E.
 *    º Move-se ao mesmo tempo do rei (move duas peças com um lance).
 *    º Termina em uma posição alternada com o monarca.
 *    º As torres da coluna 'a' executam o roque grande. Termina na coluna 'd';
 *    º As torres da coluna 'h' executam o roque curto. Termina na coluna 'f';
 *    º A condição dura enquanto esta torre ou o rei não se mover.
 *    º Não pode ser executado se as casas que o rei irá cruzar estiverem sobre ataque.
 *    º Só pode ser executado uma vez no jogo, dado que, ao se mover, este efeito encerra.
 *    º Apenas uma das torres irá executar este movimento, pois ao mover o Rei, o efeito encerra.
 *
 * @default MOVEMENT_DIRECTION_COLUMN | MOVEMENT_DIRECTION_LINE | SPECIAL_MOVEMENT_CASTLE;
 * ou 0x01 | 0x02 | 0x4000 (= 100000000000011)
 *
 */
export const ROOK_INITIAL_MOVEMENT =
  MOVEMENT_DIRECTION_COLUMN | MOVEMENT_DIRECTION_LINE | SPECIAL_MOVEMENT_CASTLE;

/**
 * @constant @type {bitwiseCumullativeFlag}
 *
 * Movimento da Torre sem a condição de executar o roque.
 *
 * Move-se nas direções:
 *  - Linha(W - E)
 *  - Coluna(S - N)
 *  - Pode mover-se em todos os sentidos
 *
 * @default ROOK_INITIAL_MOVEMENT ^ SPECIAL_MOVEMENT_CASTLE
 * ou 0x4003 ^ 0x4000 (= 0x03) (= 0011)
 *
 */
export const ROOK_CASTLED_MOVEMENT = ROOK_INITIAL_MOVEMENT ^ SPECIAL_MOVEMENT_CASTLE;
/**
 * @constant @type {number}
 *
 * Alcance(range) do movimento da torre.
 *
 * Seu alcance limita-se aos lugares que não pode ver.
 * Em outras palavras, move-se enqunato nao encontrar paredes ou inimigos
 * Ou ainda: Caso puder, move-se o maximo possivel, 8 casas
 *
 * @default LINE_OF_SIGHT
 * (=8 sqmax)
 */
export const ROOK_MOVEMENT_RANGE = LINE_OF_SIGHT;

////////////////////////////////
//
//  KNIGHT - CAVALO
//

/**
 * @constant @type {bitwiseCumullativeFlag}
 *
 * Movimento de corrida e virada.
 *
 * Formando um 'L'. Corre 2 casas, vira e anda uma.
 *
 * @default MOVEMENT_DIRECTION_L
 * ou (= 0x08) (= 1000)
 */
export const KNIGHT_MOVEMENT = MOVEMENT_DIRECTION_L;
/**
 * @constant @type {bitwiseCumullativeFlag}
 *
 * Dado que LL = destinos possiveis e NN origem, temos :
 *
 * sq LL sq LL sq                          LL sq LL
 * LL sq sq sq LL        ou             LL    sq    LL
 * sq sq NN sq sq  simplificadamente :  sq sq NN sq sq
 * LL sq sq sq LL                       LL    sq    LL
 * sq LL sq LL sq                          LL sq LL
 *
 * Portanto para todo quadrante:
 *       LL
 * NN sq sq
 *       LL
 *
 * Dois movimentos expressados em 4 quadrantes
 *
 * @default L_RANGE
 * (=4 sq)
 *
 */
export const KNIGHT_MOVEMENT_RANGE = L_RANGE;

////////////////////////////////
//
//  BISHOP - BISPO
//
/**
 * @constant @type {bitwiseCumullativeFlag}
 *
 * Movimento do Bispo.
 *
 * Move-se nas direções:
 *  - Diagonal pricipal(NW - SE)
 *  - Diagonal oposta(SW - NE)
 *  - Pode mover-se em todos os sentidos
 *
 * A particularidade do bispo é que só pode enxergar
 * as casas da sua cor, e cada um dos 2 bispos que cada time possui
 * é de uma das cores das casas (casa clara ou escura)
 *
 * @default MOVEMENT_DIRECTION_DIAGONAL
 * ou (= 0x04) (= 0100)
 */
export const BISHOP_MOVEMENT = MOVEMENT_DIRECTION_DIAGONAL;
/**
 * @constant @type {bitwiseCumullativeFlag}
 *
 *    Alcance(range) do movimento do bispo.
 *
 * Seu alcance limita-se aos lugares que não pode ver.
 * Em outras palavras, move-se enqunato nao encontrar paredes ou inimigos
 * Ou ainda: Caso puder, move-se o maximo possivel, 8 casas
 *
 * @default LINE_OF_SIGHT
 * (=8 sqmax)
 */
export const BISHOP_MOVEMENT_RANGE = LINE_OF_SIGHT;

// QUEEN
/**
 * @constant @type {bitwiseCumullativeFlag}
 *
 * Movimento da Dama.
 *
 * Possui o movimento em todas as direções e
 * pode mover-se no sentido Estrela(STAR_DIRECTION):
 *
 *             \|/
 *             ---
 *             /|\
 *
 *  - Linha(W - E)
 *  - Coluna(S - N)
 *  - Diagonal pricipal (NW - SE)
 *  - Diagonal oposta(SW - NE)
 *
 *
 * @default MOVEMENT_DIRECTION_COLUMN | MOVEMENT_DIRECTION_LINE | MOVEMENT_DIRECTION_DIAGONAL
 * ou 0x01 | 0x02 | 0x04 (= 0x07) (= 0111)
 */
export const QUEEN_MOVEMENT =
  MOVEMENT_DIRECTION_COLUMN | MOVEMENT_DIRECTION_LINE | MOVEMENT_DIRECTION_DIAGONAL;
/**
 * @constant @type {bitwiseCumullativeFlag}
 *
 * Alcance(range) do movimento da dama.
 *
 * Seu alcance limita-se aos lugares que não pode ver.
 * Em outras palavras, move-se enqunato nao encontrar paredes ou inimigos
 * Ou ainda: Caso puder, move-se o maximo possivel, 8 casas
 *
 * @default LINE_OF_SIGHT
 *
 * (=8 sqmax)
 */
export const QUEEN_MOVEMENT_RANGE = LINE_OF_SIGHT;

// KING
/**
 * @constant @type {bitwiseCumullativeFlag}
 *
 *   Movimento inical do Rei.
 *
 * Possui o movimento em todas as direções e
 * pode mover-se no sentido Estrela(STAR_DIRECTION):
 *
 *             \|/
 *             ---
 *             /|\
 *
 *  - Linha(W - E)
 *  - Coluna(S - N)
 *  - Diagonal pricipal (NW - SE)
 *  - Diagonal oposta(SW - NE)
 *  - Não pode mover-se para uma casa sob ataque do inimigo
 *  - Pode mover-se em todos os sentidos
 *  - Roque:
 *    º Linha ou W - E.
 *    º Move-se ao mesmo tempo da torre(move duas peças com um lance).
 *    º Termina em uma posição alternada com a sentinela.
 *    º Executa roque grande com as torres da coluna 'a'. Termina na coluna 'c';
 *    º Executa roque curto com as torres da coluna 'h'. Termina na coluna 'g';
 *    º A condição dura enquanto as torre alvo ou o rei não se moverem.
 *    º Se uma torre apenas se moveu, é possivel fazer o roque com a outra.
 *    º Não pode ser executado se as casas que o rei irá cruzar estiverem sobre ataque.
 *    º Só pode ser executado uma vez no jogo, dado que, ao se mover, este efeito encerra.
 *
 *  @default MOVEMENT_DIRECTION_COLUMN | MOVEMENT_DIRECTION_LINE | MOVEMENT_DIRECTION_DIAGONAL | SPECIAL_MOVEMENT_CASTLE
 *  ou  0x01 | 0x02 | 0x04 | 0x4000 (= 0x4007) (= 0100 0000 0000 0111)
 */
export const KING_INITIAL_MOVEMENT =
  MOVEMENT_DIRECTION_COLUMN |
  MOVEMENT_DIRECTION_LINE |
  MOVEMENT_DIRECTION_DIAGONAL |
  SPECIAL_MOVEMENT_CASTLE;
/**
 * @constant @type {bitwiseCumullativeFlag}
 *
 *  Movimento do Rei sem a condição de executar o roque.
 *
 * Move-se nas direções:
 *  - Linha(W - E)
 *  - Coluna(S - N)
 *  - Diagonal pricipal (NW - SE)
 *  - Diagonal oposta(SW - NE)
 *  - Não pode mover-se para uma casa sob ataque do inimigo
 *  - Pode mover-se em todos os sentidos
 *
 * @default KING_INITIAL_MOVEMENT ^ SPECIAL_MOVEMENT_CASTLE
 * ou 0x4007 ^ 0x4000 (= 0x07) (= 0111)
 */
export const KING_CASTLED_MOVEMENT = KING_INITIAL_MOVEMENT ^ SPECIAL_MOVEMENT_CASTLE;
/**
 * @constant @type {bitwiseCumullativeFlag}
 *
 *  Alcance(range) do movimento do Rei.
 *
 *  Move-se apenas 1 casa;
 *
 * @default SQUARE_RANGE
 * (=1 sq)
 */
export const KING_MOVEMENT_RANGE = SQUARE_RANGE;

// PAWN
/**
 * @constant @type {bitwiseCumullativeFlag} @default
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
 * @constant @type {bitwiseCumullativeFlag} @default
 */
export const PAWN_PASSE_MOVEMENT = PAWN_INITIAL_MOVEMENT ^ SPECIAL_MOVEMENT_EN_PASSANT;
/**
 * @constant @type {bitwiseCumullativeFlag} @default
 */
export const PAWN_INITIAL_RANGE = DOUBLE_SQUARE_RANGE;
/**
 * @constant @type {bitwiseCumullativeFlag} @default
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
 * @constant {Array} @default
 */
export const EMBEDDED_CASTLE_PIECES = [SQUARE_TYPE_KING_PIECE, SQUARE_TYPE_ROOK_PIECE];
/**
 * @constant {number} @default 0
 */
export const WHITE_COLOR = 0;
/**
 * @constant {number} @default 1
 */
export const BLACK_COLOR = 1;
/**
 * @constant {Array} @default [WHITEPIECE, BLACKPIECE]
 */
export const avaliableColors = ["WHITEPIECE", "BLACKPIECE"];
/**
 * @constant {string} @default
 */
export const PROMOTION_PIECES = pieceTypeByColumn.slice(0, 4);

export function getKingPieceLocation(pieceSide) {
  let enemyColor =
    playerColor == avaliableColors[BLACK_COLOR]
      ? avaliableColors[WHITE_COLOR]
      : avaliableColors[BLACK_COLOR];
  let queryColor = pieceSide == FRIENDLY_SIDE ? playerColor : enemyColor;

  let queryStr = '[sqtype="KINGPIECE"][sqcolor="' + queryColor + '"]';

  return document.querySelector(queryStr);
}
