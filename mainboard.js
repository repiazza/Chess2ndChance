import {
  ROW_SQUARE_COUNT,
  DARK_BGCOLOR,
  LIGHT_BGCOLOR,
  highlightStyles,
  captureStyles,
  specialPieceStyles,
  bgBoardColors,
  columnArray,
  revColumn,
  SQUARE_PIECE_COLOR_BLACK,
  SQUARE_PIECE_COLOR_WHITE,
  BLANK_SQUARE_COLOR,
  PAWN_INIT_ROWS,
  HIGHVALUE_INIT_ROWS,
  WHITEPIECE_INIT_ROWS,
  BLACKPIECE_INIT_ROWS,
  BLANKSQUARE_INIT_ROWS,
  GAME_CONTEXT_INITIAL,
  GAME_CONTEXT_PLAYING,
  GAME_CONTEXT_SKIP_PIECES,
  GAME_CONTEXT_SKIP_SIDEPIECES,
  GAME_CONTEXT_SKIP_COLOR,
  GAME_CONTEXT_CUSTOM,
  PRESET_CONTEXT_SKIP_SIDEPIECES,
  SQUARE_TYPE_PAWN_PIECE,
  SQUARE_TYPE_HIGHVALUE_PIECE,
  SQUARE_TYPE_KNIGHT_PIECE,
  SQUARE_TYPE_BISHOP_PIECE,
  SQUARE_TYPE_QUEEN_PIECE,
  SQUARE_TYPE_KING_PIECE,
  SQUARE_TYPE_ROOK_PIECE,
  SQUARE_TYPE_BLANK,
  SQUARE_ALPHABETICAL_NDX,
  SQUARE_NUMERIC_NDX,
  LONG_CASTLE_ROOK_SQUARES,
  SHORT_CASTLE_ROOK_SQUARES,
  LONG_CASTLE_KING_SQUARES,
  SHORT_CASTLE_KING_SQUARES,
  LONG_CASTLE_COLUMNS,
  SHORT_CASTLE_COLUMNS,
  LONG_CASTLE_NDX,
  SHORT_CASTLE_NDX,
  CASTLE_INIT_SQUARES,
  FRIENDLY_SIDE,
  ENEMY_SIDE,
  BLANK_SIDE,
} from "./modules/board.js";

import { FEN_MODE } from "./modules/uci.js";

import {
  MOVEMENT_CHAIN_ORIGIN,
  MOVEMENT_CHAIN_DESTINATION,
  DEFAULT_MOVEMENT_SELECTION,
  CASTLE_MOVEMENT_SELECTION,
  SHORT_CASTLE_TYPE,
  LONG_CASTLE_TYPE,
  GET_BOOLEAN_POSSIBILITY,
  GET_POSSIBLE_TYPES,
  CONSIDER_COLISION,
  IGNORE_COLISION,
  WEST,
  EAST,
  NORTH,
  SOUTH,
  NORTH_WEST,
  NORTH_EAST,
  SOUTH_WEST,
  SOUTH_EAST,
  LONG_CASTLE,
  SHORT_CASTLE,
  DIRECTION_VERTICAL,
  DIRECTION_HORIZONTAL,
  L_ROTATE,
  SQUARE_RANGE,
  LINE_OF_SIGHT,
  MOVEMENT_TYPE_NONE,
  MOVEMENT_DIRECTION_COLUMN,
  MOVEMENT_DIRECTION_LINE,
  MOVEMENT_DIRECTION_DIAGONAL,
  MOVEMENT_DIRECTION_L,
  SUBTYPE_DIAG_MAIN_BEGIN,
  SUBTYPE_DIAG_MAIN_END,
  SUBTYPE_DIAG_OPPOSITE_BEGIN,
  SUBTYPE_DIAG_OPPOSITE_END,
  SUBTYPE_DIAG_ALL,
  SUBTYPE_COLUMN_NORTH,
  SUBTYPE_COLUMN_SOUTH,
  SUBTYPE_LINE_WEST,
  SUBTYPE_LINE_EAST,
  SPECIAL_MOVEMENT_CASTLE,
  SPECIAL_MOVEMENT_EN_PASSANT,
  SPECIAL_MOVEMENT_ALL,
  MOVEMENT_COLUMN_ALL,
  MOVEMENT_LINE_ALL,
  NORTH_EAST_DIRECTION,
  NORTH_WEST_DIRECTION,
  SOUTH_EAST_DIRECTION,
  SOUTH_WEST_DIRECTION,
  NORTH_DIRECTION,
  WEST_DIRECTION,
  SOUTH_DIRECTION,
  EAST_DIRECTION,
  LINE_DIRECTION,
  COLUMN_DIRECTION,
  MAIN_DIAGONAL_DIRECTION,
  OPPOSITE_DIAGONAL_DIRECTION,
  ALL_DIRECTION,
  ALL_OPOSITE_EQUIVALENT,
} from "./modules/movement.js";

import {
  ROOK_INITIAL_MOVEMENT,
  ROOK_CASTLED_MOVEMENT,
  ROOK_MOVEMENT_RANGE,
  KNIGHT_MOVEMENT,
  KNIGHT_MOVEMENT_RANGE,
  BISHOP_MOVEMENT,
  BISHOP_MOVEMENT_RANGE,
  QUEEN_MOVEMENT,
  QUEEN_MOVEMENT_RANGE,
  KING_INITIAL_MOVEMENT,
  KING_CASTLED_MOVEMENT,
  KING_MOVEMENT_RANGE,
  PAWN_INITIAL_MOVEMENT,
  PAWN_INITIAL_RANGE,
  PAWN_MOVED_RANGE,
  THE_PIECE,
  PIECE_TYPE_ROOK,
  PIECE_TYPE_KNIGHT,
  PIECE_TYPE_BISHOP,
  PIECE_TYPE_QUEEN,
  PIECE_TYPE_KING,
  PIECE_TYPE_PAWN,
  PIECE_TYPE_NONE,
  pieceColumnLookup,
  pieceTypeByColumn,
  WHITE_COLOR,
  BLACK_COLOR,
  avaliableColors,
  PROMOTION_PIECES,
  getKingPieceLocation,
} from "./modules/piece.js";

import "./modules/types.js";

import {
  sendWSMessage,
  sockConn,
  SOCKET_OPEN,
  SOCKET_MESSAGE_TYPE_COMMAND,
} from "./modules/socket.js";

// import { setSupervisorDiv, toggleSupervisor } from "./modules/supervisor.js";

let capturedPieces = "";
export let playerColor = "WHITEPIECE";
export let lastColor = "";
let blankFrameStr = 'sqtype="BLANK" sqcolor="0"></div>';
let enemyScan = false;
let isOnCheck = false;
let stockfishLayout = FEN_MODE;

const ALLY_TURN = 0;
const ENEMY_TURN = 1;

let TURN_CONTROL = ALLY_TURN;

const SUBTITLE_HORIZONTAL = 1;
const SUBTITLE_VERTICAL = 2;
const SUBTITLE_BOTH = 3;

/**
 * Toca um áudio com o nome da casa.
 * @todo Pegar em uma origem como o google translate as demais.
 * Hoje temos e2 e e4, ficam localizados no diretorio ./sounds
 * @param {string|HTMLObjectElement} sqObjElem
 */
function playSquareNameSound(sqObjElem) {
  let mySquare = getElementFromSquareOrSquareId(sqObjElem);
  var audio = new Audio();
  audio.src = "sounds/" + mySquare.id + ".wav";
  audio.play();
}
function generateFrame(sqType, sqColor) {
  return (
    'sqtype="' +
    sqType +
    '" sqcolor="' +
    sqColor +
    '">' +
    sqType.split("PIECE")[0] +
    "</div>"
  );
}
function getElementFromSquareOrSquareId(elementOrId, getActualStatus = null) {
  if (elementOrId == null) return null;

  if (
    typeof elementOrId === "object" &&
    elementOrId.id !== undefined &&
    elementOrId.id != null &&
    elementOrId.id != ""
  )
    return getActualStatus == null
      ? elementOrId
      : document.getElementById(elementOrId.id);

  return document.getElementById(elementOrId);
}
//
//   Begin validation block
//
function validateIsSelected() {
  return getAllSelectedElements() != false;
}
function validateIsBlank(square) {
  let mySquare = getElementFromSquareOrSquareId(square);
  return getSquareType(mySquare) == SQUARE_TYPE_BLANK;
}
function validateIsNotBlank(square) {
  return !validateIsBlank(square);
}
function validateIsCaptureSquare(square) {
  if (!square.hasAttribute("cpt")) {
    return false;
  }
  return true;
}
function validateIsMoveSquare(square) {
  if (!square.hasAttribute("mvsl")) {
    return false;
  }
  return true;
}
function validateIsCastleSquare(square) {
  if (!validateIsMoveSquare(square)) {
    return false;
  }
  if (validateIsSelected()) {
    if (Number(square.getAttribute("mvsl")) != CASTLE_MOVEMENT_SELECTION) return false;
  }

  return true;
}
function matchCastleType(castleType, squareCastleType) {
  return castleType & squareCastleType;
}
// O rei e a torre envolvida não podem ter se movimentado nenhuma vez desde o início do jogo;
// As casas entre o rei e a torre devem estar desocupadas;
// O rei não pode estar em xeque, e também não pode ficar em xeque depois do roque;
// Nenhuma das casas onde o rei passar ou ficar deverá estar no raio de ação de uma peça adversária.
// Isto não se aplica à torre envolvida.
function validateCastleFromSquare(sqObjElem, possibleCastles = false) {
  let square = getElementFromSquareOrSquareId(sqObjElem);
  let kpos = square.getAttribute("kpos");
  let sqType = getSquareType(square);
  let rookOne = document.getElementById(columnArray[0] + square.id[SQUARE_NUMERIC_NDX]);
  let rookTwo = document.getElementById(
    columnArray[columnArray.length - 1] + square.id[SQUARE_NUMERIC_NDX]
  );

  if (hasMoved(square.id) || square.getAttribute("initsq") != square.id) return false;

  if (sqType != SQUARE_TYPE_KING_PIECE && sqType != SQUARE_TYPE_ROOK_PIECE) return false;

  let cstlType;
  // Somos o Rei
  if (!kpos) {
    if (hasMoved(rookOne) && hasMoved(rookTwo)) return false;

    let i = 0;
    let j = 0;
    if (getSquareType(rookOne) == SQUARE_TYPE_ROOK_PIECE) {
      rookOne
        .getAttribute("lcstl")
        .split(",")
        .forEach((sq) => {
          if (getSquareType(sq) == SQUARE_TYPE_BLANK) i++;
        });
    }
    if (getSquareType(rookTwo) == SQUARE_TYPE_ROOK_PIECE) {
      rookTwo
        .getAttribute("scstl")
        .split(",")
        .forEach((sq) => {
          if (getSquareType(sq) == SQUARE_TYPE_BLANK) j++;
        });
    }

    if (i < 3 && j < 2) return false;

    if (possibleCastles) {
      let retCastleTypes = 0;
      if (i >= 3) retCastleTypes |= LONG_CASTLE_TYPE;
      if (j >= 2) retCastleTypes |= SHORT_CASTLE_TYPE;

      return retCastleTypes;
    }
    return true;
  } else {
    cstlType = square.id[SQUARE_ALPHABETICAL_NDX] == "a" ? "lcstl" : "scstl";
    let cstlID = cstlType == "lcstl" ? LONG_CASTLE_TYPE : SHORT_CASTLE_TYPE;
    if (
      getSquareType(kpos) !== SQUARE_TYPE_KING_PIECE ||
      hasMoved(document.getElementById(kpos)) ||
      validateCastleRangeIsSafe(cstlID) == false
    )
      return false;
  }

  let isCleanPath = true;

  square
    .getAttribute(cstlType)
    .split(",")
    .forEach((sq) => {
      if (getSquareType(sq) !== SQUARE_TYPE_BLANK) isCleanPath = false;
    });

  if (possibleCastles) {
    if (isCleanPath) return cstlType == "lcstl" ? LONG_CASTLE_TYPE : SHORT_CASTLE_TYPE;
  }
  return isCleanPath;
}
function validatePassableEnemies(square, possibleDirection = false) {
  let mySquare = getElementFromSquareOrSquareId(square, true);

  let lSquare = document.getElementById(mySquare.getAttribute(WEST_DIRECTION));
  let rSquare = document.getElementById(mySquare.getAttribute(EAST_DIRECTION));

  if (validateEnemyPieceSquare(lSquare) && lSquare.hasAttribute("ep"))
    return possibleDirection ? NORTH_WEST : true;
  else if (validateEnemyPieceSquare(rSquare) && rSquare.hasAttribute("ep"))
    return possibleDirection ? NORTH_EAST : true;

  return false;
}
function setEnPassantDestination(square) {
  let mySquare = getElementFromSquareOrSquareId(square);
  mySquare.setAttribute("epdst", "1");
}
function validateCastleRangeIsSafe(castleType, possibleCastles = false) {
  if (castleType == false) return false;

  let myColor = getFirstSelectedElement().getAttribute("sqcolor");
  let lndx = 1;
  let i = 0;
  let j = 0;

  if (myColor == avaliableColors[BLACK_COLOR]) lndx = 8;

  if (matchCastleType(SHORT_CASTLE_TYPE, castleType)) {
    SHORT_CASTLE_COLUMNS.map((squareColumn) => {
      if (squareColumn == "h") j++;
      else if (!isSquareIsOnEnemyRange(squareColumn + lndx)) j++;
    });
  }
  if (matchCastleType(LONG_CASTLE_TYPE, castleType)) {
    LONG_CASTLE_COLUMNS.map((squareColumn) => {
      if (squareColumn == "a") i++;
      else if (!isSquareIsOnEnemyRange(squareColumn + lndx)) i++;
    });
  }
  if (possibleCastles) {
    let retCastleTypes = 0;
    if (i >= 5) retCastleTypes |= LONG_CASTLE_TYPE;
    if (j >= 4) retCastleTypes |= SHORT_CASTLE_TYPE;

    return retCastleTypes > 0 ? retCastleTypes : false;
  }

  return i < 5 && j < 4 ? false : true;
}
/**
 *
 * @param {string|HTMLObjectElement} sqObjElem
 * Pode ser o id da casa ou o objeto que contenha a div desta.
 * @returns
 */
function validatePieceMovementAndRange(sqObjElem) {
  let selectedElem = getFirstSelectedElement();
  let myPieceType = getSquareType(selectedElem);
  let moved = hasMoved(selectedElem.id);
  let myMovType = getMovementTypeFromPieceType(
    getPieceTypeFromSquareType(myPieceType),
    moved
  );
  let myMovRange = getMovementRangeFromPieceType(
    getPieceTypeFromSquareType(myPieceType),
    moved
  );

  // Possui movimento especial?
  if (matchMovementDirection(myMovType, SPECIAL_MOVEMENT_ALL)) {
    // Roques
    let castleTypes;
    if (
      matchMovementDirection(myMovType, SPECIAL_MOVEMENT_CASTLE) &&
      (castleTypes = validateCastleFromSquare(sqObjElem, GET_POSSIBLE_TYPES)) != false &&
      (castleTypes = validateCastleRangeIsSafe(castleTypes, GET_POSSIBLE_TYPES)) != false
    ) {
      if (matchCastleType(SHORT_CASTLE_TYPE, castleTypes)) {
        let sCastleSquares;
        if (getSquareType(sqObjElem) == SQUARE_TYPE_KING_PIECE) {
          sCastleSquares = document
            .getElementById(
              columnArray[columnArray.length - 1] + sqObjElem.id[SQUARE_NUMERIC_NDX]
            )
            .getAttribute("scstl");
          // Minha Torre
          setMoveSelection(
            document.getElementById(
              columnArray[columnArray.length - 1] + sqObjElem.id[SQUARE_NUMERIC_NDX]
            ),
            WEST_DIRECTION,
            CASTLE_MOVEMENT_SELECTION
          );
        } else {
          sCastleSquares = sqObjElem.getAttribute("scstl");
          // Meu Rei
          setMoveSelection(
            document.getElementById(sqObjElem.getAttribute("kpos")),
            WEST_DIRECTION,
            CASTLE_MOVEMENT_SELECTION
          );
        }
        sCastleSquares.split(",").forEach((sq) => {
          // Intervalo Rei Torre
          setMoveSelection(sq, WEST_DIRECTION, CASTLE_MOVEMENT_SELECTION);
        });
        // Eu mesmo
        setMoveSelection(sqObjElem, WEST_DIRECTION, CASTLE_MOVEMENT_SELECTION);
      }
      if (matchCastleType(LONG_CASTLE_TYPE, castleTypes)) {
        let lCastleSquares;
        if (getSquareType(sqObjElem) == SQUARE_TYPE_KING_PIECE) {
          lCastleSquares = document
            .getElementById(columnArray[0] + sqObjElem.id[SQUARE_NUMERIC_NDX])
            .getAttribute("lcstl");
          // Minha Torre
          setMoveSelection(
            document.getElementById(columnArray[0] + sqObjElem.id[SQUARE_NUMERIC_NDX]),
            EAST_DIRECTION,
            CASTLE_MOVEMENT_SELECTION
          );
        } else {
          lCastleSquares = sqObjElem.getAttribute("lcstl");
          // Meu Rei
          setMoveSelection(
            document.getElementById(sqObjElem.getAttribute("kpos")),
            EAST_DIRECTION,
            CASTLE_MOVEMENT_SELECTION
          );
        }
        lCastleSquares.split(",").forEach((sq) => {
          // Intervalo Rei Torre
          setMoveSelection(sq, EAST_DIRECTION, CASTLE_MOVEMENT_SELECTION);
        });
        // Eu mesmo
        setMoveSelection(sqObjElem, EAST_DIRECTION, CASTLE_MOVEMENT_SELECTION);
      }
      // highlightSelection();
    }
    // EN PASSANT?
    if (
      matchMovementDirection(myMovType, SPECIAL_MOVEMENT_EN_PASSANT) &&
      validatePassableEnemies(selectedElem, GET_BOOLEAN_POSSIBILITY)
    ) {
      if (validateEnPassantDestSquare(sqObjElem)) return true;
      let enPassantDirection = validatePassableEnemies(selectedElem, GET_POSSIBLE_TYPES);
      let captSq = getSquare(selectedElem, enPassantDirection);
      setCaptureSquare(captSq);
      setEnPassantDestination(captSq);
      highlightCapture(captSq);
    }
  }
  if (matchMovementDirection(myMovType, MOVEMENT_DIRECTION_DIAGONAL)) {
    // Possui movimento absoluto? Se sim, nao possui subtipos
    if (matchMovementDirection(myMovType, SUBTYPE_DIAG_ALL) == 0)
      myMovType = myMovType | SUBTYPE_DIAG_ALL;

    if (matchMovementDirection(myMovType, SUBTYPE_DIAG_MAIN_BEGIN))
      getDirectionFromSquare(
        selectedElem,
        NORTH_WEST_DIRECTION,
        myMovRange,
        CONSIDER_COLISION
      );
    if (matchMovementDirection(myMovType, SUBTYPE_DIAG_MAIN_END))
      getDirectionFromSquare(
        selectedElem,
        SOUTH_EAST_DIRECTION,
        myMovRange,
        CONSIDER_COLISION
      );
    if (matchMovementDirection(myMovType, SUBTYPE_DIAG_OPPOSITE_BEGIN))
      getDirectionFromSquare(
        selectedElem,
        SOUTH_WEST_DIRECTION,
        myMovRange,
        CONSIDER_COLISION
      );
    if (matchMovementDirection(myMovType, SUBTYPE_DIAG_OPPOSITE_END))
      getDirectionFromSquare(
        selectedElem,
        NORTH_EAST_DIRECTION,
        myMovRange,
        CONSIDER_COLISION
      );
  }
  if (matchMovementDirection(myMovType, MOVEMENT_DIRECTION_COLUMN)) {
    if (matchMovementDirection(myMovType, MOVEMENT_COLUMN_ALL) == 0)
      myMovType = myMovType | MOVEMENT_COLUMN_ALL;

    if (matchMovementDirection(myMovType, SUBTYPE_COLUMN_NORTH))
      getDirectionFromSquare(
        selectedElem,
        NORTH_DIRECTION,
        myMovRange,
        CONSIDER_COLISION
      );
    if (matchMovementDirection(myMovType, SUBTYPE_COLUMN_SOUTH))
      getDirectionFromSquare(
        selectedElem,
        SOUTH_DIRECTION,
        myMovRange,
        CONSIDER_COLISION
      );
  }
  if (matchMovementDirection(myMovType, MOVEMENT_DIRECTION_LINE)) {
    if (matchMovementDirection(myMovType, MOVEMENT_LINE_ALL) == 0)
      myMovType = myMovType | MOVEMENT_LINE_ALL;

    if (matchMovementDirection(myMovType, SUBTYPE_LINE_WEST))
      getDirectionFromSquare(selectedElem, WEST_DIRECTION, myMovRange, CONSIDER_COLISION);
    if (matchMovementDirection(myMovType, SUBTYPE_LINE_EAST))
      getDirectionFromSquare(selectedElem, EAST_DIRECTION, myMovRange, CONSIDER_COLISION);
  }
  if (matchMovementDirection(myMovType, MOVEMENT_DIRECTION_L)) {
    getLSquaresFromSquare(selectedElem);
  }
  if (!validateIsMoveSquare(sqObjElem) && !validateIsCaptureSquare(sqObjElem)) {
    return false;
  }
  return true;
}
function validateEnemyPieceSquare(sqObjElem) {
  return validateSquareSide(sqObjElem) == ENEMY_SIDE;
}
function validateFriendlyPieceSquare(sqObjElem) {
  return validateSquareSide(sqObjElem) == FRIENDLY_SIDE;
}
function validateSquareSide(sqObjElem) {
  let mySquare = getElementFromSquareOrSquareId(sqObjElem);
  if (!isValidSquare(mySquare)) return false;

  if (validateIsBlank(mySquare)) return BLANK_SIDE;

  return mySquare.getAttribute("sqcolor") == playerColor ? FRIENDLY_SIDE : ENEMY_SIDE;
}
function validateIsSameSquare(sqObjElem) {
  console.debug(sqObjElem);
  let mySquare = getElementFromSquareOrSquareId(sqObjElem);
  return getFirstSelectedElement().id == mySquare.id;
}
function isValidSquareIndex(sqIndex) {
  if (sqIndex < 1 || sqIndex > ROW_SQUARE_COUNT || isNaN(sqIndex)) return false;

  return true;
}
function isValidSquareAlpha(sqAlpha) {
  if (columnArray.indexOf(sqAlpha) === -1) return false;

  return true;
}
function isValidSquare(sqObjElem) {
  if (sqObjElem == null) return false;

  if (typeof sqObjElem === "object") sqObjElem = sqObjElem.id;

  if (
    isValidSquareAlpha(sqObjElem[SQUARE_ALPHABETICAL_NDX]) &&
    isValidSquareIndex(sqObjElem[SQUARE_NUMERIC_NDX])
  )
    return true;

  return false;
}
function areSquaresFromOpositeSides(sqObjElem1, sqObjElem2) {
  let mySquare1 = getElementFromSquareOrSquareId(sqObjElem1);
  let mySquare2 = getElementFromSquareOrSquareId(sqObjElem2);
  let sq1color = mySquare1.getAttribute("sqcolor");
  let sq2color = mySquare2.getAttribute("sqcolor");

  return (
    (sq1color == "BLACKPIECE" && sq2color == "WHITEPIECE") ||
    (sq1color == "WHITEPIECE" && sq2color == "BLACKPIECE")
  );
}
function validateAndSetCaptureSquare(sqObjElem) {
  let mySquare = getElementFromSquareOrSquareId(sqObjElem);
  let playerPiece = getFirstSelectedElement();

  if (!playerPiece) return false;

  playerPiece = getElementFromSquareOrSquareId(playerPiece, true);
  if (areSquaresFromOpositeSides(playerPiece, mySquare) && !enemyScan) {
    // if (playerPiece.getAttribute("sqcolor"))
    setCaptureSquare(mySquare);
    highlightCapture(mySquare);
  }
}
function validateSquareType(sqObjElem, flag) {
  if (sqObjElem === undefined) return false;

  let mySquare = getElementFromSquareOrSquareId(sqObjElem);
  if (flag === SQUARE_TYPE_PAWN_PIECE) return PAWN_INIT_ROWS.includes(mySquare.id[1]);
  if (flag === SQUARE_TYPE_HIGHVALUE_PIECE)
    return HIGHVALUE_INIT_ROWS.includes(mySquare.id[1]);
  if (flag === SQUARE_TYPE_BLANK) {
    return (
      !validateSquareType(mySquare, SQUARE_TYPE_PAWN_PIECE) &&
      !validateSquareType(mySquare, SQUARE_TYPE_HIGHVALUE_PIECE)
    );
  }

  return false;
}
function validateSquareColor(sqObjElem, flag) {
  let mySquare = getElementFromSquareOrSquareId(sqObjElem);
  if (mySquare == null) return false;

  if (flag === SQUARE_PIECE_COLOR_WHITE)
    return WHITEPIECE_INIT_ROWS.includes(mySquare.id[1]);
  if (flag === SQUARE_PIECE_COLOR_BLACK)
    return BLACKPIECE_INIT_ROWS.includes(mySquare.id[1]);
  if (flag === SQUARE_TYPE_BLANK) return BLANKSQUARE_INIT_ROWS.includes(mySquare.id[1]);

  return false;
}
//
// End Validation block
//
function setCaptureSquare(sqObjElem) {
  let mySquare = getElementFromSquareOrSquareId(sqObjElem);
  mySquare.setAttribute("cpt", "1");
}
function clearCaptureSelection(sqObjElem) {
  let mySquare = getElementFromSquareOrSquareId(sqObjElem);
  mySquare.removeAttribute("cpt");
}
export function setSelection(sqObjElem) {
  let mySquare = getElementFromSquareOrSquareId(sqObjElem);
  mySquare.setAttribute("sltd", "1");
  mySquare.innerHTML = "<b>" + mySquare.innerHTML + "</b>";
}
function clearSelection(sqObjElem) {
  let mySquare = getElementFromSquareOrSquareId(sqObjElem);
  mySquare.removeAttribute("sltd");

  if (mySquare.innerHTML.indexOf("<b>") === -1) return;

  let myInner = mySquare.innerHTML.split("<b>")[1];
  myInner = myInner.split("</b>")[0];
  mySquare.innerHTML = myInner;
}
function setMoveSelection(
  sqObjElem,
  direction,
  specialMoveNmbr = DEFAULT_MOVEMENT_SELECTION
) {
  let mySquare = getElementFromSquareOrSquareId(sqObjElem);
  if (!isValidSquare(mySquare)) return;
  if (
    mySquare.hasAttribute("mvsl") &&
    Number(mySquare.getAttribute("mvsl")) > DEFAULT_MOVEMENT_SELECTION
  ) {
    specialMoveNmbr = mySquare.getAttribute("mvsl");
  }
  /**
   * @todo: Fix EnemyScan
   */
  if (enemyScan) {
    specialMoveNmbr = "E";
    let thrtattr = "";
    if (mySquare.hasAttribute("thrby")) thrtattr = mySquare.getAttribute("thrby") + "|";

    // if (mySquare.id == "e2" && (enemyScan == "d8" || enemyScan == "e7"))

    if (!thrtattr.includes(enemyScan) && areSquaresFromOpositeSides(enemyScan, mySquare))
      mySquare.setAttribute("thrby", thrtattr + enemyScan);
  }

  mySquare.setAttribute("mvsl", specialMoveNmbr);
  setDirectionSelection(mySquare, direction);
}
function clearDirectionSelection(sqObjElem) {
  let mySquare = getElementFromSquareOrSquareId(sqObjElem);
  mySquare.removeAttribute("lmv");
  mySquare.removeAttribute("cmv");
  mySquare.removeAttribute("dmv");
  mySquare.removeAttribute("kmv");
  mySquare.removeAttribute("pmv");
}
function setMovedElem(sqObjElem) {
  let mySquare = getElementFromSquareOrSquareId(sqObjElem);
  mySquare.setAttribute("mvd", "1");
}
function hasMoved(sqObjElem) {
  let mySquare = getElementFromSquareOrSquareId(sqObjElem);

  return document.getElementById(mySquare.id).hasAttribute("mvd");
}
function clearMoveSelection(sqObjElem) {
  let mySquare = getElementFromSquareOrSquareId(sqObjElem);
  mySquare.removeAttribute("mvsl");
  clearDirectionSelection(sqObjElem);
}
function getSquareAfterMultipleMovements(origSqObj, movementArray) {
  if (Array.isArray(movementArray) == false) {
    return getSquare(origSqObj, movementArray);
  }

  let retSq = [];
  let destSq = getElementFromSquareOrSquareId(origSqObj);
  let wrkSq = destSq;
  movementArray.forEach((direction) => {
    wrkSq = getElementFromSquareOrSquareId(origSqObj);

    if (Array.isArray(direction)) {
      wrkSq = getElementFromSquareOrSquareId(origSqObj);
      direction.forEach((subdir) => {
        destSq = getSquare(wrkSq, subdir);
        wrkSq = destSq;
      });
      retSq.push(wrkSq);
    } else {
      destSq = getSquare(wrkSq, direction);
      wrkSq = destSq;
      retSq.push(wrkSq);
    }
  });
  return retSq;
}
function getLSquaresFromSquare(sqObjElem, ignoreColision = false) {
  let LSquares = [];
  L_ROTATE.map((quadrant) => {
    let retSq = getSquareAfterMultipleMovements(sqObjElem, quadrant);
    if (Array.isArray(retSq)) {
      retSq.map((sq) => {
        if (!ignoreColision && isValidSquare(sq) && !validateFriendlyPieceSquare(sq)) {
          validateAndSetCaptureSquare(sq);
          LSquares.push(sq);
          setMoveSelection(sq, MOVEMENT_DIRECTION_L);
        }
      });
    }
  });

  highlightSelection();
}
function setSpecialMovementAttributes() {
  let castlesquare = [];
  let i = 0;

  CASTLE_INIT_SQUARES.map((square, ndx) => {
    if (ndx == LONG_CASTLE_NDX) {
      castlesquare[i++] = getSquareAfterMultipleMovements(square[0], LONG_CASTLE);
      document.getElementById(square[0]).setAttribute("lcstl", castlesquare[i - 1]);
      document
        .getElementById(square[0])
        .setAttribute("cstldst", LONG_CASTLE_ROOK_SQUARES[0]);
      document.getElementById(square[0]).setAttribute("kpos", "e1");
      castlesquare[i++] = getSquareAfterMultipleMovements(square[1], LONG_CASTLE);
      document.getElementById(square[1]).setAttribute("lcstl", castlesquare[i - 1]);
      document
        .getElementById(square[1])
        .setAttribute("cstldst", LONG_CASTLE_ROOK_SQUARES[1]);
      document.getElementById(square[1]).setAttribute("kpos", "e8");
    }
    if (ndx == SHORT_CASTLE_NDX) {
      castlesquare[i++] = getSquareAfterMultipleMovements(square[0], SHORT_CASTLE);
      document.getElementById(square[0]).setAttribute("scstl", castlesquare[i - 1]);
      document
        .getElementById(square[0])
        .setAttribute("cstldst", SHORT_CASTLE_ROOK_SQUARES[0]);
      document.getElementById(square[0]).setAttribute("kpos", "e1");
      castlesquare[i++] = getSquareAfterMultipleMovements(square[1], SHORT_CASTLE);
      document.getElementById(square[1]).setAttribute("scstl", castlesquare[i - 1]);
      document
        .getElementById(square[1])
        .setAttribute("cstldst", SHORT_CASTLE_ROOK_SQUARES[1]);
      document.getElementById(square[1]).setAttribute("kpos", "e8");
    }
  });
}
function getSquareType(sqObjElem) {
  let mySquare = getElementFromSquareOrSquareId(sqObjElem);

  if (mySquare == null) return false;

  if (mySquare.hasAttribute("sqtype")) return mySquare.getAttribute("sqtype");

  return false;
}
function getPieceTypeFromSquareType(type) {
  if (type == SQUARE_TYPE_PAWN_PIECE) return PIECE_TYPE_PAWN;
  else if (type == SQUARE_TYPE_ROOK_PIECE) return PIECE_TYPE_ROOK;
  else if (type == SQUARE_TYPE_BISHOP_PIECE) return PIECE_TYPE_BISHOP;
  else if (type == SQUARE_TYPE_KING_PIECE) return PIECE_TYPE_KING;
  else if (type == SQUARE_TYPE_QUEEN_PIECE) return PIECE_TYPE_QUEEN;
  else if (type == SQUARE_TYPE_KNIGHT_PIECE) return PIECE_TYPE_KNIGHT;

  return PIECE_TYPE_NONE;
}
function getMovementRangeFromPieceType(value, moved = false) {
  switch (value) {
    case PIECE_TYPE_BISHOP:
      return BISHOP_MOVEMENT_RANGE;
    case PIECE_TYPE_KING:
      return KING_MOVEMENT_RANGE;
    case PIECE_TYPE_PAWN:
      return moved ? PAWN_MOVED_RANGE : PAWN_INITIAL_RANGE;
    case PIECE_TYPE_KNIGHT:
      return KNIGHT_MOVEMENT_RANGE;
    case PIECE_TYPE_ROOK:
      return ROOK_MOVEMENT_RANGE;
    case PIECE_TYPE_QUEEN:
      return QUEEN_MOVEMENT_RANGE;
  }
  return MOVEMENT_TYPE_NONE;
}
function getMovementTypeFromSquareType(value, moved = false) {
  return getMovementTypeFromPieceType(getPieceTypeFromSquareType(value, moved), moved);
}
function getMovementRangeFromSquareType(value) {
  return getMovementRangeFromPieceType(getPieceTypeFromSquareType(value), 0);
}
function getMovementDirectionFromSquareType(value) {
  let retDirs = [];
  let myMovType = getMovementTypeFromSquareType(value, 0);
  if (matchMovementDirection(myMovType, MOVEMENT_DIRECTION_COLUMN)) {
    retDirs.push(NORTH_DIRECTION);
    retDirs.push(SOUTH_DIRECTION);
  }
  if (matchMovementDirection(myMovType, MOVEMENT_DIRECTION_LINE)) {
    retDirs.push(WEST_DIRECTION);
    retDirs.push(EAST_DIRECTION);
  }
  if (matchMovementDirection(myMovType, MOVEMENT_DIRECTION_DIAGONAL)) {
    retDirs.push(NORTH_WEST_DIRECTION);
    retDirs.push(SOUTH_EAST_DIRECTION);
    retDirs.push(SOUTH_WEST_DIRECTION);
    retDirs.push(NORTH_EAST_DIRECTION);
  }
  if (matchMovementDirection(myMovType, SUBTYPE_DIAG_MAIN_BEGIN)) {
    retDirs.push(NORTH_WEST_DIRECTION);
  }
  if (matchMovementDirection(myMovType, SUBTYPE_DIAG_MAIN_END)) {
    retDirs.push(SOUTH_EAST_DIRECTION);
  }
  if (matchMovementDirection(myMovType, SUBTYPE_DIAG_OPPOSITE_BEGIN)) {
    retDirs.push(SOUTH_WEST_DIRECTION);
  }
  if (matchMovementDirection(myMovType, SUBTYPE_DIAG_OPPOSITE_END)) {
    retDirs.push(NORTH_EAST_DIRECTION);
  }
  if (retDirs.length > 0) return retDirs;

  return [-1];
}
function getMovementTypeFromPieceType(value, moved = false) {
  switch (value) {
    case PIECE_TYPE_BISHOP:
      return BISHOP_MOVEMENT;
    case PIECE_TYPE_KING:
      return moved ? KING_CASTLED_MOVEMENT : KING_INITIAL_MOVEMENT;
    case PIECE_TYPE_PAWN:
      return PAWN_INITIAL_MOVEMENT;
    case PIECE_TYPE_KNIGHT:
      return KNIGHT_MOVEMENT;
    case PIECE_TYPE_ROOK:
      return moved ? ROOK_CASTLED_MOVEMENT : ROOK_INITIAL_MOVEMENT;
    case PIECE_TYPE_QUEEN:
      return QUEEN_MOVEMENT;
  }
  return MOVEMENT_TYPE_NONE;
}
function createSquare(square) {
  let sqType = 0;
  let sqColor = 0;
  let nwSquare = 0;
  let neSquare = 0;
  let swSquare = 0;
  let seSquare = 0;
  let wSquare = 0;
  let eSquare = 0;
  let nSquare = 0;
  let sSquare = 0;
  let promotionRow = 0;

  if (validateSquareType(square, SQUARE_TYPE_BLANK)) sqType = SQUARE_TYPE_BLANK;
  else if (validateSquareType(square, SQUARE_TYPE_PAWN_PIECE)) {
    sqType = SQUARE_TYPE_PAWN_PIECE;
  } else if (validateSquareType(square, SQUARE_TYPE_HIGHVALUE_PIECE)) {
    sqType = pieceTypeByColumn[columnArray.indexOf(square.id[0])];
  } else {
    throw new Error("Square invalido");
  }

  if (validateSquareColor(square, SQUARE_PIECE_COLOR_BLACK))
    sqColor = SQUARE_PIECE_COLOR_BLACK;
  if (validateSquareColor(square, SQUARE_PIECE_COLOR_WHITE))
    sqColor = SQUARE_PIECE_COLOR_WHITE;
  if (validateSquareColor(square, SQUARE_TYPE_BLANK)) sqColor = BLANK_SQUARE_COLOR;

  if (validateSquareType(square, SQUARE_TYPE_PAWN_PIECE)) {
    promotionRow = validateSquareColor(square, SQUARE_PIECE_COLOR_WHITE)
      ? ROW_SQUARE_COUNT
      : 1;
  }
  // Mapeando a vizinhança
  swSquare = getSquare(square, SOUTH_WEST);
  seSquare = getSquare(square, SOUTH_EAST);
  nwSquare = getSquare(square, NORTH_WEST);
  neSquare = getSquare(square, NORTH_EAST);
  wSquare = getSquare(square, WEST);
  eSquare = getSquare(square, EAST);
  nSquare = getSquare(square, NORTH);
  sSquare = getSquare(square, SOUTH);

  let kingDestinationCastleSquare = setKingDestinationSquare(square);

  let pieceObject = {
    squareElem: square,
    squareId: square.id,
    northWestSquare: nwSquare,
    northEastSquare: neSquare,
    southWestSquare: swSquare,
    southEastSquare: seSquare,
    northSquare: nSquare,
    eastSquare: eSquare,
    westSquare: wSquare,
    southSquare: sSquare,
    initSquareId: square.id,
    squareType: sqType,
    squareColor: sqColor,
    kingDstCstSq: kingDestinationCastleSquare,
    prRow: promotionRow,
  };

  return pieceObject;
}
function getSquare(sqObjElem, relativePosition) {
  let mySquare = getElementFromSquareOrSquareId(sqObjElem);
  if (mySquare == null) return false;

  let columnNotation = mySquare.id[0];
  let indexNotation = Number(mySquare.id[1]);
  let westPos = -1;
  let eastPos = -1;
  let northPos = -1;
  let southPos = -1;
  //             l   r   t    b
  //             w   e   n    s
  let allPos = [-1, -1, -1, -1];
  if (columnArray[columnArray.indexOf(columnNotation) - 1] !== undefined)
    westPos = columnArray[columnArray.indexOf(columnNotation) - 1];
  if (columnArray[columnArray.indexOf(columnNotation) + 1] !== undefined)
    eastPos = columnArray[columnArray.indexOf(columnNotation) + 1];
  if (indexNotation + 1 < 9) northPos = indexNotation + 1;
  if (indexNotation - 1 > 0) southPos = indexNotation - 1;

  allPos = [westPos, eastPos, northPos, southPos];
  // Square obtido por um par de deslocamento?
  //
  if (relativePosition.length !== undefined && relativePosition.length > 1) {
    let squareGot = "" + allPos[relativePosition[0]] + allPos[relativePosition[1]];

    if (isValidSquare(squareGot) == false) return false;

    return squareGot;
  }

  // Nao...

  //
  // Square obtido por um deslocamento vertical ?
  //
  if (DIRECTION_VERTICAL.includes(relativePosition)) {
    let squareGot = "" + columnNotation + allPos[relativePosition];
    if (isValidSquare(squareGot)) {
      return squareGot;
    }
  }
  //
  // Square obtido por um deslocamento Horizontal ?
  //
  if (DIRECTION_HORIZONTAL.includes(relativePosition)) {
    let squareGot = "" + allPos[relativePosition] + indexNotation;
    if (isValidSquare(squareGot)) {
      return squareGot;
    }
  }
  return false;
}
function lowlightSelection() {
  document.querySelectorAll("[mvsl]").forEach((element) => {
    highlightStyles.forEach((myClass) => {
      element.classList.remove(myClass);
    });
    let bgcAttr = element.getAttribute("bgc");
    element.classList.add(bgcAttr);
  });
}
function lowlightCapture() {
  document.querySelectorAll("[cpt]").forEach((element) => {
    highlightStyles.forEach((myClass) => {
      element.classList.remove(myClass);
    });
    let bgcAttr = element.getAttribute("bgc");
    element.classList.add(bgcAttr);
  });
}
function lowlightSquare(sqObjElem) {
  highlightStyles.forEach((myClass) => {
    sqObjElem.classList.remove(myClass);
  });
  let bgcAttr = sqObjElem.getAttribute("bgc");
  sqObjElem.classList.add(bgcAttr);
}
function highlightCapture(sqObjElem) {
  let mySquare = getElementFromSquareOrSquareId(sqObjElem);
  let bgcAttr = mySquare.getAttribute("bgc");
  highlightStyles.forEach((myClass) => {
    mySquare.classList.remove(myClass);
  });
  mySquare.classList.remove(bgcAttr);
  if (bgcAttr.includes("dark")) {
    mySquare.classList.add(captureStyles[1]);
  } else {
    mySquare.classList.add(captureStyles[0]);
  }
}
function setKingDestinationSquare(square) {
  if (LONG_CASTLE_KING_SQUARES.includes(square.id)) return "klcdst";
  else if (SHORT_CASTLE_KING_SQUARES.includes(square.id)) {
    return "kscdst";
  }
  return false;
}
function setDirectionSelection(square, direction) {
  let mySquare = getElementFromSquareOrSquareId(square);
  if (LINE_DIRECTION.includes(direction)) mySquare.setAttribute("lmv", direction);
  else if (COLUMN_DIRECTION.includes(direction)) mySquare.setAttribute("cmv", direction);
  else if (
    MAIN_DIAGONAL_DIRECTION.includes(direction) ||
    OPPOSITE_DIAGONAL_DIRECTION.includes(direction)
  )
    mySquare.setAttribute("dmv", direction);
  else if (direction == MOVEMENT_DIRECTION_L) mySquare.setAttribute("kmv", direction);
  else if (direction == THE_PIECE) mySquare.setAttribute("pmv", direction);
}
export function highlightSelection() {
  document.querySelectorAll("[mvsl]").forEach((elm) => {
    let myClass = getClassNameFromAttribute(elm);
    if (myClass != false) {
      let bgcAttr = elm.getAttribute("bgc");
      if (myClass != bgcAttr) {
        if (bgcAttr.includes("dark")) {
          myClass += "dark";
        } else if (myClass.includes("dark")) {
          let tmpClass = myClass.split("dark")[0];
          myClass = tmpClass;
        }
        elm.classList.remove(bgcAttr);
        elm.classList.add(myClass);
      }
    }
  });
}
export function getDirectionFromSquare(
  square,
  direction,
  range = LINE_OF_SIGHT,
  ignoreColision = false
) {
  if (Array.isArray(direction) && direction.length > 1) {
    direction.map((myDir) => {
      getDirectionFromSquare(square, myDir, range, ignoreColision);
    });
    return;
  }
  setMoveSelection(square.id, THE_PIECE);
  //
  // Pegamos o square de movimento a partir direcao.
  //
  let destSquareId = square.getAttribute(direction);
  let i = 0;

  while (document.getElementById(destSquareId) != null) {
    if (i >= range) break;

    let nextSqElem = document.getElementById(destSquareId);
    let nextSqType = getSquareType(document.getElementById(destSquareId));
    let mySquarePiece = getSquareType(getFirstSelectedElement());
    // let moved = hasMoved(getFirstSelectedElement().id);
    // let mySquareType = getPieceTypeFromSquareType(mySquarePiece, moved);
    let moved = 0;
    let mySquareType = getPieceTypeFromSquareType(mySquarePiece, moved);

    if (!ignoreColision && nextSqType != SQUARE_TYPE_BLANK) {
      if (direction == NORTH_DIRECTION && mySquareType != PIECE_TYPE_PAWN)
        validateAndSetCaptureSquare(destSquareId);
      else if (
        (direction == NORTH_WEST_DIRECTION || direction == NORTH_EAST_DIRECTION) &&
        mySquareType == PIECE_TYPE_PAWN
      ) {
        validateAndSetCaptureSquare(destSquareId);
      } else if (mySquareType != PIECE_TYPE_PAWN) {
        validateAndSetCaptureSquare(destSquareId);
      }
      break;
    }
    if (
      !(
        (direction == NORTH_WEST_DIRECTION || direction == NORTH_EAST_DIRECTION) &&
        mySquareType == PIECE_TYPE_PAWN &&
        !ignoreColision
      )
    ) {
      setMoveSelection(nextSqElem.id, direction);
    } else if (
      !(direction == NORTH_WEST_DIRECTION || direction == NORTH_EAST_DIRECTION)
    ) {
      // if ( validateIsSafeSquare(nextSqElem.id) )
      setMoveSelection(nextSqElem.id, direction);
    } else {
      clearMoveSelection(nextSqElem.id, direction);
    }

    destSquareId = nextSqElem.getAttribute(direction);
    i++;
  }

  highlightSelection();

  return true;
}
// O array de highlight as 4 primeiras posicoes sao as classes
// os nossos movimentos sao 4 bits de um byte, na mesma sequencia da respectiva classe
// entao fazemos um shift right bem maroto.
function getClassNameFromMovementDirection(baseMovementDirection) {
  let i = 0;
  for (; baseMovementDirection > 0; i++) {
    baseMovementDirection = baseMovementDirection >> 1;
  }
  return highlightStyles[i - 1];
}
function getClassNameFromAttribute(square) {
  let mySquare = getElementFromSquareOrSquareId(square);
  if (mySquare.hasAttribute("mvsl") && mySquare.getAttribute("mvsl") == "E") return false;
  if (mySquare.hasAttribute("lmv"))
    return getClassNameFromMovementDirection(MOVEMENT_DIRECTION_LINE);
  if (mySquare.hasAttribute("cmv"))
    return getClassNameFromMovementDirection(MOVEMENT_DIRECTION_COLUMN);
  if (mySquare.hasAttribute("dmv"))
    return getClassNameFromMovementDirection(MOVEMENT_DIRECTION_DIAGONAL);
  if (mySquare.hasAttribute("kmv"))
    return getClassNameFromMovementDirection(MOVEMENT_DIRECTION_L);
  if (mySquare.hasAttribute("cpt")) return captureStyles[0];
  if (mySquare.hasAttribute("pmv")) return specialPieceStyles[0];

  return false;
}
function highlightSquares(square) {
  validatePieceMovementAndRange(square);
}
function selectSameSquare(square) {
  return validateIsSelected() && validateIsSameSquare(square);
}
function selectSquare(square) {
  return (
    !validateIsSelected() &&
    validateIsNotBlank(square) &&
    validateFriendlyPieceSquare(square)
  );
}
/**
 * @param {string} squareId - O ID é composto de uma letra e um numero.
 *
 * @param {string} myInner  - Opcional, conteudo da casa.
 *
 * Seta os atributos nativos de cada casa(square).
 * O tabuleiro(board) possui dimensão 8x8, de a1 até h8.
 *
 * Pela perspectiva das brancas a torre da ala da Dama inicia na casa a1.
 *
 * Pela perspectiva das negras  a torre da ala da Dama inicia na casa a8.
 */
function drawSquare(squareId, myInner = "") {
  let divSquare = document.createElement("div");
  divSquare.id = squareId;
  divSquare.innerHTML = myInner;

  divSquare.setAttribute("clm", squareId[SQUARE_ALPHABETICAL_NDX]);
  divSquare.setAttribute("lndx", squareId[SQUARE_NUMERIC_NDX]);
  divSquare.setAttribute("square", "1");

  divSquare.addEventListener("click", squareHandler);

  return divSquare;
}
function querySelectorAllRegex(regex, attributeToSearch) {
  const output = [];
  if (attributeToSearch) {
    for (let element of document.querySelectorAll(`[${attributeToSearch}]`)) {
      if (regex.test(element.getAttribute(attributeToSearch))) {
        output.push(element);
      }
    }
  } else {
    for (let element of document.querySelectorAll("*")) {
      for (let attribute of element.attributes) {
        if (regex.test(attribute.value)) {
          output.push(element);
        }
      }
    }
  }
  return output;
}
function querySelectorAllRegex2(regex, DomElem) {
  const output = [];
  for (let element of DomElem) {
    if (regex.test(element.outerHTML)) {
      output.push(element);
    }
  }

  return output;
}
function saveSquareCoreAttrOnLocalStorage(square) {
  let divToReplace = square.outerHTML.split("pc")[0];
  if (divToReplace.includes("</div>") == false) divToReplace += "></div>";
}
function saveCoreAttrOnLocalStorage(square) {
  let wrkDiv;
  let piecePrefix = "";
  // pcp="1" initsq="c2" sqtype="PAWNPIECE" sqcolor="WHITEPIECE">PAWN</div>
  if (square.outerHTML.indexOf("BLANK") === -1) {
    wrkDiv = "pc" + square.outerHTML.split("pc")[1];
    piecePrefix = "p";
  } else {
    wrkDiv = "sqtype" + square.outerHTML.split("sqtype")[1];
  }
  var objCoreAttr = new Object({
    divStringToReplace: wrkDiv,
  });
  let sqName = piecePrefix + square.id;
  window.localStorage.removeItem(sqName);
  window.localStorage.setItem(sqName, JSON.stringify({ ...objCoreAttr }));
}
function removeNonRelevantAttributesFromSquare(square) {
  clearMoveSelection(square.id);
}
function validatePromotionDestinationSquare(prow, destId) {
  if (destId[SQUARE_NUMERIC_NDX] == prow) return true;

  return false;
}
//
// Movimento simples ou Composto?
//
function setupMovement(orgsq, destsq) {
  let movementChain = [];

  if (
    !hasMoved(orgsq) &&
    validateCastleDestinationSquare(destsq) &&
    validateCastleFromSquare(orgsq)
  ) {
    // Roque
    // Irao ser gerados dois movimentos
    let rookDestElem;
    let rookKingElem;
    let kingDir = WEST;
    let rookElem;
    if (orgsq.hasAttribute("cstldst")) {
      // Partindo de uma torre
      rookElem = orgsq;
    } else if (destsq.hasAttribute("cstldst")) {
      // Partindo de um rei para uma torre
      rookElem = destsq;
    } else if (destsq.hasAttribute("klcdst")) {
      // Partindo de um rei para uma destino roque grande
      rookElem = document.getElementById(columnArray[0] + orgsq.id[SQUARE_NUMERIC_NDX]);
    } else if (destsq.hasAttribute("kscdst")) {
      // Partindo de um rei para uma destino roque pequeno
      rookElem = document.getElementById(
        columnArray[columnArray.length - 1] + orgsq.id[SQUARE_NUMERIC_NDX]
      );
    }

    rookDestElem = document.getElementById(rookElem.getAttribute("cstldst"));
    rookKingElem = document.getElementById(rookElem.getAttribute("kpos"));
    let kingdest = [];
    kingdest[SQUARE_ALPHABETICAL_NDX] =
      rookDestElem.id[SQUARE_ALPHABETICAL_NDX] == "f" ? "g" : "c";

    if (kingdest[SQUARE_ALPHABETICAL_NDX] == "g") kingDir = EAST;

    kingdest[SQUARE_NUMERIC_NDX] = rookDestElem.id[SQUARE_NUMERIC_NDX];
    let kingDestinationElem = document.getElementById(
      "" + kingdest[SQUARE_ALPHABETICAL_NDX] + kingdest[SQUARE_NUMERIC_NDX]
    );
    movementChain.push([rookElem, rookDestElem]);
    movementChain.push([rookKingElem, kingDestinationElem]);
  } else if (
    orgsq.hasAttribute("prow") &&
    validatePromotionDestinationSquare(orgsq.getAttribute("prow"), destsq.id)
  ) {
    // Promover peao, sera utilizada a escolha previa
    // ou apresentado um menu de selecao
    let rtchoice = "";
    let promChoice = "";
    do {
      let promOpt = "Selecione:\r\n";
      let i = 1;

      PROMOTION_PIECES.map((piece) => {
        promOpt += i + ". " + piece + "\r\n";
        i++;
      });
      promChoice = prompt(promOpt, "") - 1;
      rtchoice = PROMOTION_PIECES[promChoice];
      if (rtchoice === undefined) {
        if (!confirm("Opcao invalida, continuar?")) {
          promChoice = 1;
          break;
        }
      }
    } while (rtchoice === undefined);

    lowlightSelection();
    lowlightCapture();
    let divToReplace = "";
    if (destsq.outerHTML.indexOf("BLANK") === -1) {
      divToReplace = destsq.outerHTML.split("pc")[0];
    } else {
      divToReplace = destsq.outerHTML.split("sqtype")[0];
    }
    divToReplace +=
      " pc" +
      pieceColumnLookup[promChoice] +
      '="1" ' +
      'initsq="' +
      orgsq.getAttribute("initsq") +
      '" ';
    divToReplace += generatePieceFrame(
      pieceTypeByColumn[promChoice],
      orgsq.getAttribute("sqcolor")
    );

    var objCoreAttr = new Object({
      divStringToReplace: divToReplace,
    });
    window.localStorage.removeItem("promPiece");
    window.localStorage.setItem("promPiece", JSON.stringify({ ...objCoreAttr }));
    movementChain.push([orgsq, destsq]);
  } else {
    movementChain.push([orgsq, destsq]);
  }
  return movementChain;
}
function doMoveToDestination(orgsq, destsq) {
  var objSquare = JSON.parse(window.localStorage.getItem(destsq.id));
  var objPiece = JSON.parse(window.localStorage.getItem("p" + orgsq.id));
  let pieceStr = "";
  let squareStr = "";
  let setAsBlank = false;
  let newDestSquare = document.getElementById(destsq.id);
  let newOrigSquare = document.getElementById(orgsq.id);
  lowlightSquare(newDestSquare);
  lowlightSquare(newOrigSquare);
  if (newDestSquare.outerHTML.indexOf("BLANK") === -1) {
    squareStr = newDestSquare.outerHTML.split("pc")[0];
    setAsBlank = true;
  } else {
    // Movimento
    squareStr = newDestSquare.outerHTML.split("sqtype")[0];
  }
  if (newOrigSquare.outerHTML.indexOf("BLANK") === -1) {
    pieceStr = newOrigSquare.outerHTML.split("pc")[0];
  } else {
    pieceStr = newOrigSquare.outerHTML.split("sqtype")[0];
  }
  newOrigSquare.removeEventListener("click", squareHandler);
  newDestSquare.removeEventListener("click", squareHandler);
  newOrigSquare.outerHTML =
    pieceStr + (setAsBlank ? blankFrameStr : objSquare.divStringToReplace);
  newDestSquare.outerHTML = squareStr + objPiece.divStringToReplace;
  newOrigSquare = document.getElementById(orgsq.id);
  newOrigSquare.addEventListener("click", squareHandler);
  newDestSquare = document.getElementById(destsq.id);
  newDestSquare.addEventListener("click", squareHandler);
  setMovedElem(newDestSquare);
  saveCoreAttrOnLocalStorage(newDestSquare);
  saveCoreAttrOnLocalStorage(newOrigSquare);
}
function validateCastleDestinationSquare(mySquare) {
  return (
    validateCastleFriendDestinationSquare(mySquare) ||
    validateCastleBlankDestinationSquare(mySquare)
  );
}
function validateCastleFriendDestinationSquare(square) {
  let originSelection = getFirstSelectedElement();
  // Torre clicando no Rei
  if (
    originSelection.hasAttribute("kpos") &&
    originSelection.getAttribute("kpos") == square.id
  )
    return true;
  // Rei Clicando na torre
  if (square.hasAttribute("kpos") && square.getAttribute("kpos") == originSelection.id)
    return true;

  return false;
}
function validateEnPassantDestSquare(square) {
  let sqObjElem = getElementFromSquareOrSquareId(square, true);

  if (sqObjElem == null) return false;

  return sqObjElem.hasAttribute("epdst");
}
function validateCastleBlankDestinationSquare(square) {
  let originSelection = getFirstSelectedElement();

  // Torre -> blankSq
  if (
    originSelection.hasAttribute("cstldst") &&
    originSelection.getAttribute("cstldst") == square.id
  )
    return true;

  // Rei -> blankSq
  if (
    getSquareType(originSelection) == SQUARE_TYPE_KING_PIECE &&
    (square.hasAttribute("kscdst") || square.hasAttribute("klcdst"))
  )
    return true;

  return false;
}
export function hasAnySquareDrew() {
  return document.querySelectorAll('[square="1"]').length > 0;
}
function validateIsSafeSquare(mySquare) {
  if (getSquareType(getFirstSelectedElement()) == SQUARE_TYPE_KING_PIECE) {
    if (getSquareType(mySquare) == SQUARE_TYPE_ROOK_PIECE) return true;
    else return !isSquareIsOnEnemyRange(mySquare);
  }
  return true;
}
function validateIsPinPiece() {}
function moveSquare(square) {
  let mySquare = getElementFromSquareOrSquareId(square);
  return (
    isValidSquare(mySquare) &&
    validateIsSelected() &&
    validateIsSafeSquare(mySquare) &&
    //  && !validateIsPinPiece()
    (validateIsBlank(mySquare) || validateCastleDestinationSquare(mySquare)) &&
    !validateEnPassantDestSquare(mySquare) &&
    validatePieceMovementAndRange(mySquare)
  );
}
function changeSelectedSquare(square) {
  return (
    validateIsSelected() &&
    validateFriendlyPieceSquare(square) &&
    !validateIsSameSquare(square) &&
    !validateCastleDestinationSquare(square)
  );
}
function captureSquare(square) {
  return (
    validateIsSelected() &&
    (validateEnemyPieceSquare(square) || validateEnPassantDestSquare(square)) &&
    validatePieceMovementAndRange(square) &&
    validateIsCaptureSquare(square)
  );
}
function clearPieceSelection(elem) {
  let mySquare = getElementFromSquareOrSquareId(elem);
  mySquare.removeAttribute("pmv");
}
function clearElementSelection(elem) {
  clearSelection(elem.id);
  clearMoveSelection(elem.id);
  clearCaptureSelection(elem.id);
  clearPieceSelection(elem.id);
}
export function clearAllElementSelection() {
  lowlightSelection();
  lowlightCapture();
  document.querySelectorAll("[sltd]").forEach((element) => {
    clearSelection(element.id);
  });
  document.querySelectorAll("[mvsl]").forEach((element) => {
    clearMoveSelection(element.id);
  });
  document.querySelectorAll("[cpt]").forEach((element) => {
    clearCaptureSelection(element.id);
  });
}
function getAllSelectedElements() {
  if (document.querySelectorAll("[sltd]").length > 0) {
    return document.querySelectorAll("[sltd]");
  }
  return false;
}
function getFirstSelectedElement() {
  if (getAllSelectedElements() != false) {
    return getAllSelectedElements()[0];
  }
  return false;
}
function matchMovementDirection(movType, direction) {
  return movType & direction ? true : false;
}
function clearSpecialMovementsStatus() {
  document
    .querySelectorAll('[sqColor="' + playerColor + '"][ep="1"]')
    .forEach((element) => {
      element.removeAttribute("ep");
    });
  document.querySelectorAll('[epdst="1"]').forEach((element) => {
    element.removeAttribute("epdst");
  });
}
function setSpecialMovementStatus(chain) {
  clearSpecialMovementsStatus();

  let origElem = getElementFromSquareOrSquareId(chain[MOVEMENT_CHAIN_ORIGIN], true);
  let destElem = getElementFromSquareOrSquareId(chain[MOVEMENT_CHAIN_DESTINATION], true);

  if (getSquareType(destElem) == SQUARE_TYPE_PAWN_PIECE) {
    // En Passant?
    if (
      destElem.id[SQUARE_NUMERIC_NDX] - origElem.id[SQUARE_NUMERIC_NDX] >
      SQUARE_RANGE
    ) {
      // Marcar como 'passivel de'
      destElem.setAttribute("ep", "1");
    }
    let captureSq = destElem.getAttribute(SOUTH_DIRECTION);
    let enPasseSq = getElementFromSquareOrSquareId(captureSq, true);
    if (enPasseSq.hasAttribute("ep")) {
      // Limpar square 'En passado'
      enPasseSq.outerHTML = enPasseSq.outerHTML.split("sqtype")[0] + " " + blankFrameStr;
    }
    if (
      destElem.hasAttribute("prow") &&
      validatePromotionDestinationSquare(destElem.getAttribute("prow"), destElem.id)
    ) {
      var objSquare = JSON.parse(window.localStorage.getItem("promPiece"));
      destElem.removeEventListener("click", squareHandler);
      destElem.outerHTML = objSquare.divStringToReplace;
      destElem = getElementFromSquareOrSquareId(destElem.id, true);
      destElem.addEventListener("click", squareHandler);
      saveCoreAttrOnLocalStorage(destElem);
    }
  }
}
function setupCapture(event) {
  let strElem = getElementFromSquareOrSquareId(event.target);
  if (validateEnPassantDestSquare(strElem)) {
    let captureSq = strElem.getAttribute(SOUTH_DIRECTION);
    strElem = document.getElementById(captureSq);
  }
  let retStr =
    strElem.getAttribute("sqcolor").split("PIECE")[0][0] +
    strElem.getAttribute("sqtype").split("PIECE")[0][0] +
    strElem.id[0] +
    " ";

  return retStr;
}
function updateMajorRelativePositions(movChain) {
  movChain.map((chain) => {
    if (
      getSquareType(chain[MOVEMENT_CHAIN_DESTINATION]) == SQUARE_TYPE_KING_PIECE &&
      validateSquareSide(chain[MOVEMENT_CHAIN_DESTINATION]) == FRIENDLY_SIDE
    ) {
      let kingSqId = getElementFromSquareOrSquareId(
        chain[MOVEMENT_CHAIN_DESTINATION],
        true
      ).id;
      let enemyColor =
        playerColor == avaliableColors[BLACK_COLOR]
          ? avaliableColors[WHITE_COLOR]
          : avaliableColors[BLACK_COLOR];

      document.querySelectorAll('[sqColor="' + playerColor + '"]').forEach((element) => {
        element.setAttribute("frkpos", kingSqId);
      });
      document.querySelectorAll('[sqColor="' + enemyColor + '"]').forEach((element) => {
        element.setAttribute("enkpos", kingSqId);
      });
    }
  });
}
function getCheckSavingMoves() {
  let threatenOrgSquares = getCheckOriginSquares();
}
/**
 * Funcao de tratamento do clique na casa (square).
 * @param {event} - o evento do click, passado por eventListener
 *
 * A funcao squareHandler tem dois fluxos basicos:
 *  + Seleção da casa.
 *    º selectSquare - caso nenhuma casa esteja selecionada, ou troca a casa atraves de
 *      changeSelectedSquare - se o segundo clique for em casa aliada.
 *      (Exceto para acoes especiais como Roque)
 *  + Ação da casa ou casas.
 *    º moveSquare - Move-se para a casa selecionada (se possivel) e, em casos especiais.
 *    º captureSquare - Que e uma forma especial de mover-se.
 *  + Bonus:
 *    º selectSameSquare - caso a casa(square) clicado pela segunda vez for o mesmo da primeira, desfaz a seleção
 */
function squareHandler(event) {
  event.preventDefault();
  let captureSq = false;
  let oldelem = false;
  // debugger;
  /**
   * @todo : Pegar outros sons de squares, por enquanto somente
   * temos e2.wav e e4.wav
   * Funcional mas desabilitado por enquanto
   * playSquareName(event.target);
   */

  // Clique em casas aliadas
  //
  // COM selecao previa - changeSelectedSquare
  // SEM selecao previa - SelectSquare
  if (selectSquare(event.target) || changeSelectedSquare(event.target)) {
    if (validateIsSelected()) {
      clearAllElementSelection();
    }
    setSelection(event.target);
    highlightSquares(event.target);
  }

  // Clique em casas neutras ou inimigas
  //
  // Selecao previa + neutro  - moveSquare
  // Selecao previa + inimigo - captureSquare
  else if (
    moveSquare(event.target) ||
    (captureSq = captureSquare(event.target)) != false
  ) {
    oldelem = getFirstSelectedElement();
    if (captureSq) {
      capturedPieces += setupCapture(event);
      document.getElementById("captured").innerHTML = capturedPieces;
    }
    //
    // Acao de mover-se:
    //   Preparacao
    //     - Quantos Movimentos estao envolvidos ?
    //   Deslocamento
    //     - Movimento ou captura?
    //   Desdobramentos
    //     - Ganhamos alguma habilidade especial?
    //     - Checagens extras?
    //
    // Preparacao
    //
    let movementChain = false;
    if (oldelem != false) movementChain = setupMovement(oldelem, event.target);
    //
    // Deslocamento
    //
    if (movementChain != false) {
      movementChain.map((chain) => {
        doMoveToDestination(
          chain[MOVEMENT_CHAIN_ORIGIN],
          chain[MOVEMENT_CHAIN_DESTINATION]
        );
      });
      //
      // Desdobramento
      //
      setSpecialMovementStatus(movementChain[0]);
      updateMajorRelativePositions(movementChain);
      clearAllElementSelection();
    }
    //
    // Passar Turno
    //
    changeTurn();
  } else if (selectSameSquare(event.target)) {
    clearAllElementSelection();
  }
  //drawSquareDetails();
}
function toggleTurnValue() {
  return TURN_CONTROL == ALLY_TURN ? ENEMY_TURN : ALLY_TURN;
}
function changeTurn() {
  TURN_CONTROL = toggleTurnValue();

  playerColor = togglePlayerColor();

  setWindRoseCoordinates;
  // toggleTimer();

  if (isPlayerOnCheck()) alert("Check");
}
function isPlayerOnCheck() {
  if (isKingOnEnemyRange(FRIENDLY_SIDE, IGNORE_COLISION)) isOnCheck = true;

  return isOnCheck;
}
function readyHandler(event) {
  event.preventDefault();

  if (document.getElementById("a1") != null) return;

  // Daqui pra baixo, podemos desenhar, pois nao foi feito ainda
  drawBoardSquares(GAME_CONTEXT_INITIAL, null);

  // Todas as peças de um tipo especifico, aliadas ou inimigas
  // drawBoardSquares(GAME_CONTEXT_SKIP_PIECES, [
  //   SQUARE_TYPE_BISHOP_PIECE,
  //   SQUARE_TYPE_KNIGHT_PIECE,
  //   SQUARE_TYPE_QUEEN_PIECE,
  // ]);
  //
  // Todas as peças de um lado(brancas ou negras)
  // drawBoardSquares(GAME_CONTEXT_SKIP_COLOR, ENEMY_SIDE);
  //
  // As peças aliadas nao pertencentes ao Roque.
  // drawBoardSquares(GAME_CONTEXT_SKIP_SIDEPIECES, [
  //   PRESET_CONTEXT_SKIP_SIDEPIECES,
  //   [[SQUARE_TYPE_PAWN_PIECE, SQUARE_TYPE_KNIGHT_PIECE], [ENEMY_SIDE]],
  // ]);
  // drawBoardSquares(GAME_CONTEXT_SKIP_SIDEPIECES, [
  //   PRESET_CONTEXT_SKIP_SIDEPIECES,
  //   [[SQUARE_TYPE_PAWN_PIECE, SQUARE_TYPE_KNIGHT_PIECE], [ENEMY_SIDE]],
  // ]);

  // drawBoardSquares(GAME_CONTEXT_CUSTOM, [
  //  [[SQUARE_TYPE_PAWN_PIECE , SQUARE_TYPE_KNIGHT_PIECE], [FRIENDLY_SIDE]],
  //  [[SQUARE_TYPE_QUEEN_PIECE, SQUARE_TYPE_KNIGHT_PIECE], [ENEMY_SIDE]]
  //]);

  drawSubtitles(SUBTITLE_BOTH);
}
function generateFENMessage() {
  // let fenMsg = generateFENStrFromBoard();
  let fenMsg =
    "STK|" + FEN_MODE + "2k4r/1p1nb2p/p5p1/2P1P1P1/1P3B2/P7/6PP/R6K w - - 0 26";
  return fenMsg;
}
function sendActualPosition(msgLayout = FEN_MODE) {
  var wsMessage = generateActualBoardStatus(msgLayout ? msgLayout : FEN_MODE);
  if (wsMessage == "") return false;

  return sendWSMessage(wsMessage);
}
function generateActualBoardStatus(msgLayout) {
  if (msgLayout == FEN_MODE) {
    return generateFENMessage();
  } else if (msgLayout == START_POSITION_MODE) {
    return generateStartPositionMessage();
  }
  return "";
}
function isKingOnEnemyRange(kingSide, ignoreColision = FALSE) {
  let kElem = getKingPieceLocation(kingSide);

  // alert(kElem.id);
  return isSquareIsOnEnemyRange(kElem.id, ignoreColision);
}
function isSquareIsOnEnemyRange(square, ignoreColision = false) {
  let mySquare = getElementFromSquareOrSquareId(square);
  let enemyColor =
    playerColor == avaliableColors[BLACK_COLOR]
      ? avaliableColors[WHITE_COLOR]
      : avaliableColors[BLACK_COLOR];

  let isDangerSquare = false;
  enemyScan = true;
  document.querySelectorAll('[sqcolor="' + enemyColor + '"]').forEach((elem) => {
    let elemRange = elem.getAttribute("range");
    enemyScan = elem.id;
    ALL_DIRECTION.map((direction) => {
      let attrDir = "mv" + direction;
      elem.hasAttribute(attrDir)
        ? getDirectionFromSquare(elem, direction, elemRange, ignoreColision)
        : "";
    });
  });
  enemyScan = false;

  if (document.querySelector('[mvsl="E"][id="' + mySquare.id + '"]') != null) {
    isDangerSquare = true;
  }

  if (document.querySelector('[cpt][id="' + mySquare.id + '"]') != null) {
    isDangerSquare = true;
  }

  return isDangerSquare;
}
function drawHorizontalSubtitles() {
  let marginLeft = 160;
  let columnAlpha = "";

  columnArray.map(function (clmAlpha, clmndx) {
    let subtitle = document.createElement("div");
    columnAlpha = clmAlpha;
    if (playerColor == avaliableColors[BLACK_COLOR]) {
      columnAlpha = revColumn[clmndx];
    }

    subtitle.innerHTML = columnAlpha;
    subtitle.style.marginLeft = marginLeft + "px";
    subtitle.style.marginTop = "688px";
    subtitle.style.position = "absolute";
    subtitle.style.color = "black";
    subtitle.style.opacity = "0.4";
    subtitle.style.fontWeight = "bold";
    subtitle.style.fontSize = "22px";
    subtitle.id = "horzsubtitles";
    document.getElementById("container").appendChild(subtitle);
    marginLeft += 81;
  });
}
function drawVerticalSubtitles() {
  let marginLeft = 115;
  let marginTop = 75;

  for (let rowNdx = 1; rowNdx < 9; rowNdx++) {
    let subtitle = document.createElement("div");
    if (playerColor == avaliableColors[WHITE_COLOR]) {
      rowNdx = 9 - rowNdx;
    }
    subtitle.innerHTML = rowNdx;
    subtitle.style.marginLeft = marginLeft + "px";
    subtitle.style.marginTop = marginTop + "px";
    subtitle.style.position = "absolute";
    subtitle.style.color = "black";
    subtitle.style.fontWeight = "bold";
    subtitle.style.opacity = "0.4";
    subtitle.style.fontSize = "20px";
    subtitle.id = "vertsubtitles";
    document.getElementById("container").appendChild(subtitle);
    marginTop += 80;
    if (playerColor == avaliableColors[WHITE_COLOR]) {
      rowNdx = 9 - rowNdx;
    }
  }
}
function drawSubtitles(whichSubs) {
  if (whichSubs == SUBTITLE_HORIZONTAL || whichSubs == SUBTITLE_BOTH)
    drawHorizontalSubtitles();
  if (whichSubs == SUBTITLE_VERTICAL || whichSubs == SUBTITLE_BOTH)
    drawVerticalSubtitles();
}
/** Aplica o layout especifico para testes com Roque
 *  SidePieces porque sao as peças ao redor do rei, com exceção das torres.
 *
 * @param {[][]} extraArg  - Desenho das peças do tabuleiro de acordo com o contexto
 *                           escolhido
 *
 * @param {Object} sqElem - Este parâmetro não é um HTMLObjectElement, ele é composto
 *                          e contém também a div em questão, pois desenhamos peça a peça,
 *                          por isso o contexto é aplicado elemento a elemento.
 *
 */
function drawContextSkipSidePieces(extraArg, sqElem) {
  var pieceArr = new Array();
  var pieceSideArr = new Array();
  extraArg.map((ctx) => {
    pieceArr = ctx[0];
    pieceSideArr = ctx[1];
    pieceArr.map((pT) => {
      if (
        pT == sqElem.squareType &&
        validateSquareSide(sqElem.squareElem) == pieceSideArr[0]
      ) {
        sqElem.squareElem.removeAttribute(
          "pc" + getPieceTypeFromSquareType(sqElem.squareType)
        );
        sqElem.squareElem.removeAttribute("initsq");
        sqElem.squareElem.setAttribute("sqtype", SQUARE_TYPE_BLANK);
        sqElem.squareElem.setAttribute("sqcolor", "0");
        sqElem.squareElem.innerHTML = "";
      }
    });
  });
}

function applyContext(context, extraArg, sqElem) {
  switch (context) {
    case GAME_CONTEXT_INITIAL:
      // drawContextInitial(extraArg, sqElem);
      break;
    case GAME_CONTEXT_PLAYING:
    case GAME_CONTEXT_CUSTOM:
      // Fallthrough pois a mecanica será a mesma.
      // A diferença básica é que:
      //  - GAME_CONTEXT_PLAYING é um custom anteriormente existente
      //  - GAME_CONTEXT_CUSTOM  é verdadeiramente a gosto do freguês
      // drawContextCustomBoard(extraArg, sqElem);
      break;
    case GAME_CONTEXT_SKIP_PIECES:
      // drawContextSkipPieces(extraArg, sqElem);
      break;
    case GAME_CONTEXT_SKIP_COLOR:
      // drawContextSkipPlayerSide(extraArg, sqElem);
      break;
    case GAME_CONTEXT_SKIP_SIDEPIECES:
      drawContextSkipSidePieces(extraArg, sqElem);
      break;
    default:
      break;
  }
}
function setSquareStyle(
  squareElement,
  squareMarginLeft,
  squareMarginTop,
  squareColorSeq
) {
  squareElement.style.position = "absolute";
  squareElement.style.marginLeft = squareMarginLeft + "px";
  squareElement.style.marginTop = squareMarginTop + "px";
  squareElement.style.color = "black";
  squareElement.classList.add(bgBoardColors[squareColorSeq]);
  squareElement.setAttribute("bgc", bgBoardColors[squareColorSeq]);
}
function setSquareColorSeq(sqColor, columnIndex, rowToggle) {
  if (columnIndex % 2 != rowToggle) {
    sqColor = sqColor ? 0 : 1;
  }
  return sqColor;
}
function setTmpCoordinates() {
  ALL_DIRECTION.map((coordAttrName) => {
    document.querySelectorAll(`[${coordAttrName}]`).forEach((element) => {
      tmpattr = element.getAttribute(coordAttrName);
      element.setAttribute("tmp" + ALL_OPOSITE_DIRECTION[coordAttrName], tmpattr);
    });
  });
}
function toggleWindRoseCoordinates(drawingSquare) {}
function setWindRoseCoordinates(drawingSquare) {
  drawingSquare.squareElem.setAttribute("nwsq", drawingSquare.northWestSquare);
  drawingSquare.squareElem.setAttribute("nesq", drawingSquare.northEastSquare);
  drawingSquare.squareElem.setAttribute("sesq", drawingSquare.southEastSquare);
  drawingSquare.squareElem.setAttribute("swsq", drawingSquare.southWestSquare);
  drawingSquare.squareElem.setAttribute("nsq", drawingSquare.northSquare);
  drawingSquare.squareElem.setAttribute("ssq", drawingSquare.southSquare);
  drawingSquare.squareElem.setAttribute("wsq", drawingSquare.westSquare);
  drawingSquare.squareElem.setAttribute("esq", drawingSquare.eastSquare);
}
/**
 * Cria as casas do tabuleiro;
 * @param {number} context - Se houver um contexto, sera aplicado.
 *                           Os contextos estão cadastrados no modulo board.js
 *                           Exemplo:
 *                              - Desenhar comeco de jogo
 *                              - Sem peças laterais
 *                              - Somente peoes
 * @param {[][]} extraArg  - Opcional, para caso de contexto livre(custom),
 *                         onde o tabuleiro será desenhado de maneira totalmente
 *                         personalizada.
 *
 */
function drawBoardSquares(context, extraArg = null) {
  const board = document.getElementById("board");
  let storageSquares = [];
  let marginLeft = 80;
  let marginTop = 0;
  let supervisormarginTop = 40;
  let supervisoridCtr = 0;
  let rowColorToggle = false;
  let i = 0;
  let columnAlpha;

  destroySquares();

  for (let rowNdx = 1; rowNdx < 9; rowNdx++) {
    columnArray.map(function (clmAlpha, clmNdx) {
      try {
        var squareColorSeq = DARK_BGCOLOR;
        columnAlpha = clmAlpha;
        // Desenhamos de cima para baixo, por isso fazemos a inversao
        // caso sejamos brancas.
        if (playerColor == avaliableColors[WHITE_COLOR]) {
          squareColorSeq = LIGHT_BGCOLOR;
          rowNdx = 9 - rowNdx;
        }
        // Alternancia de cores do board (usando paridade da coluna mod 2)
        squareColorSeq = setSquareColorSeq(squareColorSeq, clmNdx, rowColorToggle);

        let candidateElem = drawSquare(columnAlpha + rowNdx, "");
        const newsquare = createSquare(candidateElem);

        // Setamos nosso posicionamento e estilos
        setSquareStyle(newsquare.squareElem, marginLeft, marginTop, squareColorSeq);
        // Setamos nossas cordenadas segundo a rosa dos ventos...
        setWindRoseCoordinates(newsquare);

        // Se nao eh casa vazia escrevemos uma sigla para nossa peça
        // aproveitamos para marcar a casa de inicio
        newsquare.squareElem.innerHTML = "";
        if (newsquare.squareColor != BLANK_SQUARE_COLOR) {
          let attrPieceType = "pc" + getPieceTypeFromSquareType(newsquare.squareType);
          newsquare.squareElem.setAttribute(attrPieceType, "1");
          newsquare.squareElem.setAttribute("initsq", newsquare.initSquareId);
          newsquare.squareElem.innerHTML = newsquare.squareType.split("PIECE")[0];
        }
        // Marcamos casas de Roque, just in case
        if (newsquare.longCastleSquare)
          newsquare.squareElem.setAttribute("lcstl", newsquare.longCastleSquare);
        if (newsquare.shortCastleSquare)
          newsquare.squareElem.setAttribute("scstl", newsquare.shortCastleSquare);
        // Eh uma casa de destino do rei, caso roque? Marcamos...
        if (newsquare.kingDstCstSq != false)
          newsquare.squareElem.setAttribute(newsquare.kingDstCstSq, "1");

        // Setamos o tipo de square (peao, dama, rei, etc..) e seu time.
        newsquare.squareElem.setAttribute("sqtype", newsquare.squareType);
        newsquare.squareElem.setAttribute("sqcolor", newsquare.squareColor);
        // Setar posicoes inicial dos Reis.
        // Se somos brancas, o rei aliado estará na linha 1, se nao 8.
        if (validateSquareColor(newsquare, SQUARE_PIECE_COLOR_WHITE)) {
          newsquare.squareElem.setAttribute("frkpos", "e1");
          newsquare.squareElem.setAttribute("enkpos", "e8");
        } else if (validateSquareColor(newsquare, SQUARE_PIECE_COLOR_BLACK)) {
          newsquare.squareElem.setAttribute("frkpos", "e8");
          newsquare.squareElem.setAttribute("enkpos", "e1");
        }

        // Casa para promover?
        if (newsquare.prRow > 0)
          newsquare.squareElem.setAttribute("prow", newsquare.prRow);

        // marcamos nossa vizinhança
        getMovementDirectionFromSquareType(newsquare.squareType).map((mvdr) => {
          if (mvdr.toString() == "-1") return;
          newsquare.squareElem.setAttribute("mv" + mvdr.toString(), "1");
        });
        // Aproveitamos para adicionar o range, pode ser util...
        // Seria bom verificar se utilizamos este atributo. Para nao ficar redundante
        let myRange = getMovementRangeFromSquareType(newsquare.squareType);
        newsquare.squareElem.setAttribute("range", myRange);
        // Se temos algum contexto especial de desenho, setamos em applyContext
        // Ex.: Sem os peoes, sem as torres, etc.
        applyContext(context, extraArg, newsquare);
        // Adicionamos a casa ao board
        board.appendChild(newsquare.squareElem);

        /**
         * Rotina do Supervisor
         * @todo: Modularizar mais
         */
        // setSupervisorDiv(supervisoridCtr, supervisormarginTop);
        // supervisoridCtr++;
        // supervisormarginTop += 20;

        // Salvamos o square no local storage
        saveCoreAttrOnLocalStorage(newsquare.squareElem);

        storageSquares[i++] = newsquare.squareElem;
      } catch (err) {
        console.log("Erro ao desenhar tabuleiro: [" + err + "]");
      }

      if (playerColor == avaliableColors[WHITE_COLOR]) {
        rowNdx = 9 - rowNdx;
      }

      // Incrementamos marginLeft de 80 em 80 px a cada coluna.
      marginLeft += 80;
    }); // columnArray.map

    // Temos um board 8x8 de 640px. Cada linha possui 8 squares.
    // Para simular a quebra de linha:
    //  - Setamos marginLeft para 80(primeiro square da nova linha)
    //    (CR - retorno de carro)
    //  - Adicionamos 80 px a marginTop
    //    (LF - linefeed)
    marginTop += 80;
    marginLeft = 80;
    // O rowColorToggle serve para controlar o inicio da linha:
    //   - a1 e a8 iniciam com uma casa de tom escuro, obrigatoriamente
    //   - Para que o "quadriculado, alem de altenancia de tom,
    //   - tenha a alterancia no inicio do padrao utilizamos um alternador diferente de columnIndex%2"
    rowColorToggle = !rowColorToggle;
  } // -- fim for rowNdx (linhas)

  // Fazemos trabalho adicional em caso de movimentos especiais, tipo Roque
  setSpecialMovementAttributes();
  // Tudo pronto, salvamos o Board.
  window.localStorage.removeItem("gameBoard");
  window.localStorage.setItem("gameBoard", JSON.stringify({ ...storageSquares }));

  if (sendActualPosition() == false) console.log("Error sending actual position");
}
function drawInitialBoard(boardId, buttonreadyHandler) {
  const createbtn = document.getElementById(boardId);
  createbtn.addEventListener("click", buttonreadyHandler);
  // setSupervisorListener();
}
function setToggleColor(toggleId, buttonreadyHandler) {
  const createbtn = document.getElementById(toggleId);
  createbtn.addEventListener("click", buttonreadyHandler);
}
function destroySquares() {
  document.querySelectorAll("[square]").forEach((element) => {
    element.remove();
  });
  document.querySelectorAll('[id*="subtitles"]').forEach((element) => {
    element.remove();
  });
}
function togglePlayerColor() {
  return avaliableColors.indexOf(playerColor)
    ? avaliableColors[WHITE_COLOR]
    : avaliableColors[BLACK_COLOR];
}
function togglePlayerColorAndRedrawBoard(event) {
  if (!confirm("ATENÇÃO! Inverter as cores? (todo progresso será perdido)")) return;

  togglePlayerColor();
  destroySquares();

  readyHandler(event);
}

document.addEventListener("DOMContentLoaded", function () {
  // console.log(ALL_OPOSITE_EQUIVALENT);
  drawInitialBoard("boardcreate", readyHandler);
  setToggleColor("togglecolor", togglePlayerColorAndRedrawBoard);
});

// function setSupervisorListener() {
//   const createbtn = document.getElementById("togglesupervisor");
//   createbtn.addEventListener("click", toggleSupervisor);
// }
