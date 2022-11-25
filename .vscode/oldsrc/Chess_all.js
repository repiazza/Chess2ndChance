let imgpath = "img/";

class Movement {
  type = MOVEMENT_TYPE_NONE;
  range = RANGE_TYPE_NONE;
  elementFromPoint = document.elementFromPoint;
  elementsFromPoint = document.elementsFromPoint;

  constructor(piece_type, objJSON = null) {
    if (objJSON == null) {
      this.type = this.setPieceMovementType(piece_type);
      this.range = this.getMovementRangeFromPieceType(piece_type);
    } else {
      Object.assign(this, objJSON);
    }
  }

  fixMovementType(value) {
    if (!movementMatchesAnyDirection(value)) return this.type;
    return value;
  }
  //#
  setPieceMovementType(value) {
    let movType = this.getMovementTypeFromPieceType(value);
    if (movementMatchesAnyDirection(movType)) return (this.type = movType);

    return this.type;
  }
  setMovementType(value) {
    this.type = this.fixMovementType(value);
  }
  //#
  getMovementTypeFromPieceType(value) {
    switch (value) {
      case PIECE_TYPE_BISHOP:
        return BISHOP_MOVEMENT;
      case PIECE_TYPE_KING:
        return KING_INITIAL_MOVEMENT;
      case PIECE_TYPE_PAWN:
        return PAWN_INITIAL_MOVEMENT | DIAGONAL_FOUR_SQUARE;
      case PIECE_TYPE_KNIGHT:
        return KNIGHT_MOVEMENT;
      case PIECE_TYPE_ROOK:
        return ROOK_INITIAL_MOVEMENT;
      case PIECE_TYPE_QUEEN:
        return QUEEN_MOVEMENT;
    }
    return MOVEMENT_TYPE_NONE;
  }
  // #
  getMovementRangeFromPieceType(value) {
    switch (value) {
      case PIECE_TYPE_BISHOP:
        return BISHOP_MOVEMENT_RANGE;
      case PIECE_TYPE_KING:
        return KING_MOVEMENT_RANGE;
      case PIECE_TYPE_PAWN:
        return PAWN_INITIAL_RANGE;
      case PIECE_TYPE_KNIGHT:
        return KNIGHT_MOVEMENT_RANGE;
      case PIECE_TYPE_ROOK:
        return ROOK_MOVEMENT_RANGE;
      case PIECE_TYPE_QUEEN:
        return QUEEN_MOVEMENT_RANGE;
    }
    return MOVEMENT_TYPE_NONE;
  }
  //#
  getObjMovementType() {
    return this.type;
  }
  getObjRange() {
    return this.range;
  }
}

// class Cursor{

// }

class Piece {
  type;
  initsq;
  movement;
  color;
  elmcurrentsq;
  notmov;

  constructor(type, initsq, objMov, color, objJSON = null) {
    if (objJSON == null) {
      this.type = type;
      this.initsq = initsq;
      this.elmcurrentsq = document.getElementById(initsq);
      this.color = color;
      this.notmov = 1;
      document.getElementById(initsq).innerHTML = "" + color + type;
      this.movement = objMov;
    } else {
      Object.assign(this, objJSON);
    }
  }
  setType(type) {
    this.type = type;
  }
  setPiecePosition(square) {
    this.elmcurrentsq = document.getElementById(square);
  }
  getPiecePosition(postype) {
    let tmpLineNdx = this.elmcurrentsq.getAttribute("lndx");
    let tmpColumnLetter = this.elmcurrentsq.getAttribute("clm");
    if (!isValidSquareIndex(tmpLineNdx) || !isValidSquareAlpha(tmpColumnLetter))
      return -1;
    if (postype == SQUARE_ALPHABETICAL_NDX) return tmpColumnLetter;
    else if (postype == SQUARE_NUMERIC_NDX) return tmpLineNdx;
    else if (postype == SQUARE_NAME) return tmpColumnLetter + tmpLineNdx;

    //ElEMENT_SQUARE
    return this.elmcurrentsq;
  }
  getRange() {
    return this.movement.getObjRange();
  }
  getMovement() {
    return this.movement.getObjMovementType();
  }
  getName() {
    return this.name;
  }
  getType() {
    return this.type;
  }
  getMovementObj() {
    return this.movement;
  }
  getInitialSquare() {
    return this.initsq;
  }
  getColor() {
    return this.color;
  }
  logPieceObj() {
    console.debug(this);
  }
}

let pieceObj;

const TOTAL_PIECE_COUNT = 16;
const PLAYER_PIECE_COUNT = TOTAL_PIECE_COUNT / 2;

const LINE_SQUARE_COUNT = 8;
const COLUMN_SQUARE_ROW = 8;

const highlightClasses = [
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
  "orangehl",
  "orangeh1dark",
];
const captureClasses = ["capturehl", "capturehldark"];

const DARK_BGCOLOR = 0;
const LIGHT_BGCOLOR = 1;

const bgBoardColors = ["darksquarecolor", "lightsquarecolor"];

var opponentSquareArr = [];
var emptySquareArr = [];
let capturedPieces = [];
let capturedPiecesCtr = 0;

const TOP_OFFSET = 1;
const BOT_OFFSET = 2;
const LFT_OFFSET = 3;
const RGT_OFFSET = 4;

const COLOR_NONE = -1;
const COLOR_WHITE = 0;
const COLOR_BLACK = 1;

const SQUARE_SCAN = 1;
const FULL_SCAN = 2;

const MOVEMENT_RANGE_BEGIN_SQUARE = 0;
const MOVEMENT_RANGE_END_SQUARE = 1;

const SQUARE_ALPHABETICAL_NDX = 0;
const SQUARE_NUMERIC_NDX = 1;
const SQUARE_NAME = 2;
const ELEMENT_SQUARE = 3;

const PIECE_COLOR_INDEX = 0; // B or W
const PIECE_NOTATION_INDEX = 1; // R N B Q K or P
const PIECE_COMPLEMENT_IDENTIFIER_INDEX = 2; // Column or Sequence

const MOVEMENT_DIRECTION_COLUMN = 0x01;
const MOVEMENT_DIRECTION_LINE = 0x02;
const MOVEMENT_DIRECTION_DIAGONAL = 0x04;
const MOVEMENT_DIRECTION_L = 0x08;

const SUBTYPE_DIAG_MAIN_BEGIN = 0x10;
const SUBTYPE_DIAG_MAIN_END = 0x20;
const SUBTYPE_DIAG_OPPOSITE_BEGIN = 0x40;
const SUBTYPE_DIAG_OPPOSITE_END = 0x80;

const SUBTYPE_COLUMN_TOP = 1024;
const SUBTYPE_COLUMN_BOTTOM = 2048;
const SUBTYPE_LINE_LEFT = 4096;
const SUBTYPE_LINE_RIGHT = 8192;

const SPECIAL_MOVEMENT_CASTLE = 16384;
const SPECIAL_MOVEMENT_EN_PASSANT = 32768;
const SPECIAL_MOVEMENT_ALL = SPECIAL_MOVEMENT_CASTLE | SPECIAL_MOVEMENT_EN_PASSANT;

const MAIN_DIAGONAL = SUBTYPE_DIAG_MAIN_BEGIN | SUBTYPE_DIAG_MAIN_END;
const OPPOSITE_DIAGONAL = SUBTYPE_DIAG_OPPOSITE_BEGIN | SUBTYPE_DIAG_OPPOSITE_END;
const DIAGONAL_FOUR_SQUARE = MAIN_DIAGONAL | OPPOSITE_DIAGONAL;

const MOVEMENT_DIRECTION_ALL =
  MOVEMENT_DIRECTION_COLUMN |
  MOVEMENT_DIRECTION_LINE |
  MOVEMENT_DIRECTION_DIAGONAL |
  MOVEMENT_DIRECTION_L;

const SUBTYPE_DIAG_ALL =
  SUBTYPE_DIAG_MAIN_BEGIN |
  SUBTYPE_DIAG_MAIN_END |
  SUBTYPE_DIAG_OPPOSITE_BEGIN |
  SUBTYPE_DIAG_OPPOSITE_END;
// LINE COLUMN CROSS
const SUBTYPE_COLUMN_ALL = SUBTYPE_COLUMN_TOP | SUBTYPE_COLUMN_BOTTOM;
const SUBTYPE_LINE_ALL = SUBTYPE_LINE_LEFT | SUBTYPE_LINE_RIGHT;

const SUBTYPE_ALL = SUBTYPE_COLUMN_ALL | SUBTYPE_LINE_ALL | SUBTYPE_DIAG_ALL;

const MOVEMENT_DIRECTION_SUBTYPE_ALL = MOVEMENT_DIRECTION_ALL | SUBTYPE_ALL;

const MOVEMENT_TYPE_ALL = MOVEMENT_DIRECTION_ALL | SUBTYPE_ALL | SPECIAL_MOVEMENT_ALL;

const SQUARE_RANGE = 1;
const DOUBLE_SQUARE_RANGE = 2;
const L_RANGE = 4;
const LINE_OF_SIGHT = 8;
const MOVEMENT_TYPE_NONE = 0;
const RANGE_TYPE_NONE = 0;

const ROOK_INITIAL_MOVEMENT =
  MOVEMENT_DIRECTION_COLUMN |
  SUBTYPE_COLUMN_TOP |
  SUBTYPE_COLUMN_BOTTOM |
  MOVEMENT_DIRECTION_LINE |
  SUBTYPE_LINE_LEFT |
  SUBTYPE_LINE_RIGHT |
  SPECIAL_MOVEMENT_CASTLE;
const ROOK_CASTLED_MOVEMENT = ROOK_INITIAL_MOVEMENT ^ SPECIAL_MOVEMENT_CASTLE;
const ROOK_MOVEMENT_RANGE = LINE_OF_SIGHT;

const KNIGHT_MOVEMENT = MOVEMENT_DIRECTION_L;
const KNIGHT_MOVEMENT_RANGE = L_RANGE; // 2 movements 4way expressed

const BISHOP_MOVEMENT =
  MOVEMENT_DIRECTION_DIAGONAL |
  SUBTYPE_DIAG_MAIN_BEGIN |
  SUBTYPE_DIAG_MAIN_END |
  SUBTYPE_DIAG_OPPOSITE_BEGIN |
  SUBTYPE_DIAG_OPPOSITE_END;
const BISHOP_MOVEMENT_RANGE = LINE_OF_SIGHT;

const QUEEN_MOVEMENT =
  MOVEMENT_DIRECTION_COLUMN |
  SUBTYPE_COLUMN_TOP |
  SUBTYPE_COLUMN_BOTTOM |
  MOVEMENT_DIRECTION_LINE |
  SUBTYPE_LINE_LEFT |
  SUBTYPE_LINE_RIGHT |
  MOVEMENT_DIRECTION_DIAGONAL |
  SUBTYPE_DIAG_MAIN_BEGIN |
  SUBTYPE_DIAG_MAIN_END |
  SUBTYPE_DIAG_OPPOSITE_BEGIN |
  SUBTYPE_DIAG_OPPOSITE_END;
const QUEEN_MOVEMENT_RANGE = LINE_OF_SIGHT;

const KING_INITIAL_MOVEMENT =
  SPECIAL_MOVEMENT_CASTLE |
  MOVEMENT_DIRECTION_COLUMN |
  SUBTYPE_COLUMN_TOP |
  SUBTYPE_COLUMN_BOTTOM |
  MOVEMENT_DIRECTION_LINE |
  SUBTYPE_LINE_LEFT |
  SUBTYPE_LINE_RIGHT |
  MOVEMENT_DIRECTION_DIAGONAL |
  SUBTYPE_DIAG_MAIN_BEGIN |
  SUBTYPE_DIAG_MAIN_END |
  SUBTYPE_DIAG_OPPOSITE_BEGIN |
  SUBTYPE_DIAG_OPPOSITE_END;
const KING_CASTLED_MOVEMENT = KING_INITIAL_MOVEMENT ^ SPECIAL_MOVEMENT_CASTLE;
const KING_MOVEMENT_RANGE = SQUARE_RANGE;

const PAWN_INITIAL_MOVEMENT =
  MOVEMENT_DIRECTION_COLUMN |
  SUBTYPE_COLUMN_TOP |
  SUBTYPE_COLUMN_BOTTOM |
  MOVEMENT_DIRECTION_DIAGONAL;

const PAWN_INITIAL_RANGE = DOUBLE_SQUARE_RANGE;
const PAWN_MOVED_RANGE = SQUARE_RANGE;

const PIECE_TYPE_ROOK = "R";
const PIECE_TYPE_KNIGHT = "N";
const PIECE_TYPE_BISHOP = "B";
const PIECE_TYPE_QUEEN = "Q";
const PIECE_TYPE_KING = "K";
const PIECE_TYPE_PAWN = "P";
const PIECE_TYPE_NONE = 0;

const PIECE_COLOR_WHITE = "W";
const PIECE_COLOR_BLACK = "B";

const INVALID_SQUARE = -1; // Casa fora do 8x8 ou semelhante
const BLANK_SPACE_SQUARE = 0; // Casa Livre
const PLAYER_PIECE_SQUARE = 1; //
const OPPONENT_PIECE_SQUARE = 2;
const UNKNOWN_SQUARE = 3; // Casa em formato desconhecido

let pieceSelected = 0;
let playerColorStatus = 0;
const colorName = ["white", "black"];
const colorNotation = ["W", "B"];
let columnArray = ["a", "b", "c", "d", "e", "f", "g", "h"];

//                             0    1    2    3   4   5    6    7
let highValuePieceNotation = ["R1", "N1", "B1", "Q", "K", "B2", "N2", "R2"];
let lowValuePieceNotation = ["Pa", "Pb", "Pc", "Pd", "Pe", "Pf", "Pg", "Ph"];
let pieceType = ["R", "N", "B", "Q", "K", "P"];

//                           R N B Q K P
let pieceMovementType = [0, 0, 0, 0, 0, 0];
//                           R N B Q K P
let pieceMovementRange = [0, 0, 0, 0, 0, 0];

let mainDiagonalRange = [];
let oppositeDiagonalRange = [];

let columnMovementRange = [];
let lineMovementRange = [];
let diagonalMovementRange = [];
let LMovementSquares = [];

let captureSquares = [];
let captureSquareCtr = 0;

let castleMovement;
const HAS_MOVED = 0;
const MOVEMENT_CASTLE_BOTH = 3;
const MOVEMENT_CASTLE_LONG = 2;
const MOVEMENT_CASTLE_SHORT = 1;

const KING_CASTLED_INDEX = 0;
const ROOK_CASTLED_INDEX = 1;

const longCastleSquareColumn = ["c", "d"];
const shortCastleSquareAlpha = ["g", "f"];

const initialRows = [1, 2, 7, 8];

const FIRST_WHITE_ROW = 0;
const SECOND_WHITE_ROW = 1;
const FIRST_BLACK_ROW = 2;
const SECOND_BLACK_ROW = 3;

function getWhiteFirstRow() {
  return initialRows[FIRST_WHITE_ROW];
}
function getWhiteSecondRow() {
  return initialRows[SECOND_WHITE_ROW];
}
function getBlackFirstRow() {
  return initialRows[FIRST_BLACK_ROW];
}
function getBlackSecondRow() {
  return initialRows[SECOND_BLACK_ROW];
}
function getPlayerFirstRow() {
  return playerColorStatus == COLOR_WHITE ? getWhiteFirstRow() : getBlackFirstRow();
}

function getLongCastleKingSquare() {
  return longCastleSquareColumn[KING_CASTLED_INDEX] + getPlayerFirstRow();
}
function getLongCastleRookSquare() {
  return longCastleSquareColumn[ROOK_CASTLED_INDEX] + getPlayerFirstRow();
}
function getShortCastleKingSquare() {
  return shortCastleSquareAlpha[KING_CASTLED_INDEX] + getPlayerFirstRow();
}
function getShortCastleRookSquare() {
  return shortCastleSquareAlpha[ROOK_CASTLED_INDEX] + getPlayerFirstRow();
}

function getPieceTypeFromPiece(piece) {
  for (let i = 0; i < pieceType.length; i++)
    if (piece[PIECE_NOTATION_INDEX] == pieceType[i]) return pieceType[i];
}

function matchPieceType(piece, pieceType) {
  return piece[PIECE_NOTATION_INDEX] == pieceType ? true : false;
}
function isCastlePossibleFromKingPosition(candidateElement) {
  let kingElement = candidateElement;
  let isShortCastlePossible = true;
  let isLongCastlePossible = true;
  let lineIndex = getLineIndexFromSquare(kingElement.id);
  let originColumn =
    columnArray[columnArray.indexOf(kingElement.id[SQUARE_ALPHABETICAL_NDX]) + 1];
  let destColumn = columnArray[columnArray.indexOf(originColumn) + 1];
  let initSquare = originColumn + lineIndex;
  let endSquare = destColumn + lineIndex;
  // alert(initSquare + " " + endSquare);
  if (!hasBlankSpace(initSquare) || !hasBlankSpace(endSquare)) {
    isShortCastlePossible = false;
  }
  originColumn =
    columnArray[columnArray.indexOf(kingElement.id[SQUARE_ALPHABETICAL_NDX]) - 1];
  let middleColumn = columnArray[columnArray.indexOf(originColumn) - 1];
  destColumn = columnArray[columnArray.indexOf(middleColumn) - 1];
  initSquare = originColumn + lineIndex;
  middleSquare = middleColumn + lineIndex;
  endSquare = destColumn + lineIndex;
  //  alert(initSquare + " " + middleSquare + " " + endSquare);

  if (
    !hasBlankSpace(initSquare) ||
    !hasBlankSpace(middleSquare) ||
    !hasBlankSpace(endSquare)
  ) {
    isLongCastlePossible = false;
  }
  if (isLongCastlePossible == false && isShortCastlePossible == false) return false;

  return (isLongCastlePossible & isShortCastlePossible) == true
    ? MOVEMENT_CASTLE_BOTH
    : isLongCastlePossible
    ? MOVEMENT_CASTLE_LONG
    : MOVEMENT_CASTLE_SHORT;
}

function isCastlePossibleFromRookPosition(candidateElement) {
  let RookElement = candidateElement;
  let castleMovementPossible = false;

  let initSquare = getNextRightSquareBySquare(RookElement.id);
  let middleSquare = getNextRightSquareBySquare(initSquare);
  let endSquare = getNextRightSquareBySquare(middleSquare);
  if (RookElement.id == "a1") {
    if (
      !hasBlankSpace(initSquare) ||
      !hasBlankSpace(middleSquare) ||
      !hasBlankSpace(endSquare)
    ) {
      return false;
    }
    castleMovementPossible = MOVEMENT_CASTLE_LONG;
  } else if (RookElement.id == "h1") {
    initSquare = getNextLeftSquareBySquare(RookElement.id);
    endSquare = getNextLeftSquareBySquare(initSquare);
    if (!hasBlankSpace(initSquare) || !hasBlankSpace(endSquare)) {
      return false;
    }
    castleMovementPossible = MOVEMENT_CASTLE_SHORT;
  } else if (RookElement.id == "a8") {
    initSquare = getNextLeftSquareBySquare(RookElement.id);
    middleSquare = getNextLeftSquareBySquare(initSquare);

    endSquare = getNextLeftSquareBySquare(middleSquare);
    if (
      !hasBlankSpace(initSquare) ||
      !hasBlankSpace(middleSquare) ||
      !hasBlankSpace(endSquare)
    ) {
      return false;
    }
    castleMovementPossible = MOVEMENT_CASTLE_LONG;
  } else if (RookElement.id == "h8") {
    initSquare = getNextRightSquareBySquare(RookElement.id);
    // alert(initSquare)
    endSquare = getNextRightSquareBySquare(initSquare);
    if (!hasBlankSpace(initSquare) || !hasBlankSpace(endSquare)) {
      return false;
    }
    castleMovementPossible = MOVEMENT_CASTLE_SHORT;
  }
  castleMovement = castleMovementPossible;
  return castleMovementPossible;
}
function checkPiecePosition(piece) {
  //let candidateElement = document.getElementById(pieceObj.getPiecePosition(SQUARE_NAME));
  // alert(pieceSelected.hasMoved);
  if (pieceSelected.hasMoved == HAS_MOVED) {
    return false;
  }
  if (matchPieceType(piece, PIECE_TYPE_KING)) {
    return isCastlePossibleFromKingPosition(candidateElement);
  }
  if (matchPieceType(piece, PIECE_TYPE_ROOK)) {
    return isCastlePossibleFromRookPosition(candidateElement);
  }
}
function getNextLeftSquareByPiece() {
  let originSquare = pieceObj.getPiecePosition(SQUARE_NAME);
  let myColumnIndex = columnArray.indexOf(originSquare[SQUARE_ALPHABETICAL_NDX]);
  let nextLeftColumnOffset = getMovementOffset(LFT_OFFSET, getPlayerColorNotation());

  let nextLeftColumn = myColumnIndex + nextLeftColumnOffset;
  let nextLeftSquareName =
    columnArray[nextLeftColumn] !== undefined
      ? columnArray[nextLeftColumn] + originSquare[SQUARE_NUMERIC_NDX]
      : -1;
  return nextLeftSquareName;
}
function getNextLeftSquareBySquare(square) {
  let originSquare = square;
  let myColumnIndex = columnArray.indexOf(originSquare[SQUARE_ALPHABETICAL_NDX]);
  let nextLeftColumnOffset = getMovementOffset(LFT_OFFSET, getPlayerColorNotation());

  let nextLeftColumn = myColumnIndex + nextLeftColumnOffset;
  let nextLeftSquareName =
    columnArray[nextLeftColumn] !== undefined
      ? columnArray[nextLeftColumn] + originSquare[SQUARE_NUMERIC_NDX]
      : -1;
  return nextLeftSquareName;
}
function getNextRightSquareByPiece(piece) {
  let originSquare = pieceObj.getPiecePosition(SQUARE_NAME);
  let myColumnIndex = columnArray.indexOf(originSquare[SQUARE_ALPHABETICAL_NDX]);
  let nextRightColumnOffset = getMovementOffset(RGT_OFFSET, getPlayerColorNotation());

  let nextRightColumn = myColumnIndex + nextRightColumnOffset;
  let nextRightSquareName =
    columnArray[nextRightColumn] !== undefined
      ? columnArray[nextRightColumn] + originSquare[SQUARE_NUMERIC_NDX]
      : -1;
  return nextRightSquareName;
}
function getNextRightSquareBySquare(square) {
  let originSquare = square;
  let myColumnIndex = columnArray.indexOf(originSquare[SQUARE_ALPHABETICAL_NDX]);
  let nextRightColumnOffset = getMovementOffset(RGT_OFFSET, getPlayerColorNotation());

  let nextRightColumn = myColumnIndex + nextRightColumnOffset;
  let nextRightSquareName =
    columnArray[nextRightColumn] !== undefined
      ? columnArray[nextRightColumn] + originSquare[SQUARE_NUMERIC_NDX]
      : -1;
  return nextRightSquareName;
}
// O rei e a torre envolvida não podem ter se movimentado nenhuma vez desde o início do jogo;
// As casas entre o rei e a torre devem estar desocupadas;
// O rei não pode estar em xeque, e também não pode ficar em xeque depois do roque;
// Nenhuma das casas onde o rei passar ou ficar deverá estar no raio de ação de uma peça adversária.
// Isto não se aplica à torre envolvida.
function drawSpecialMovement(movementType) {
  if (matchMovementDirection(movementType, SPECIAL_MOVEMENT_CASTLE)) {
    let castleMovementPossible;
    if ((castleMovementPossible = checkPiecePosition(pieceSelected)) == false)
      return false;

    // alert(castleMovementPossible);
    var movementDiscreteArray = [];
    nextLeftSquare = getNextLeftSquareByPiece(pieceSelected);
    while (isValidSquareAlpha(nextLeftSquare) && hasBlankSpace(nextLeftSquare)) {
      movementDiscreteArray.push(nextLeftSquare);
      nextLeftSquare = getNextLeftSquareBySquare(nextLeftSquare);
    }
    nextRightSquare = getNextRightSquareByPiece(pieceSelected);
    while (isValidSquareAlpha(nextRightSquare) && hasBlankSpace(nextLeftSquare)) {
      movementDiscreteArray.push(nextRightSquare);
      nextRightSquare = getNextRightSquareBySquare(nextRightSquare);
    }
    // alert(movementDiscreteArray);
    // alert(castleMovementPossible);
    if (castleMovementPossible == MOVEMENT_CASTLE_BOTH) {
      castleMovement = movementDiscreteArray;
    } else if (castleMovementPossible == MOVEMENT_CASTLE_LONG) {
      if (getLineIndexFromPiece(pieceSelected) == 8)
        castleMovement = movementDiscreteArray.slice(0, -3);
      else castleMovement = movementDiscreteArray.slice(0, 4);
    } else {
      if (getLineIndexFromPiece(pieceSelected) == 8)
        castleMovement = movementDiscreteArray.slice(0, -4);
      else castleMovement = movementDiscreteArray.slice(0, 3);
    }
    // alert(castleMovement);
    colorDiscreteMovementPath(castleMovement, MOVEMENT_DIRECTION_LINE);
  }
}
function getLineIndexFromPiece(piece) {
  return pieceObj.getPiecePosition(SQUARE_NAME)[SQUARE_NUMERIC_NDX];
}
function getLineIndexFromSquare(squareName) {
  if (!isValidSquareIndex(squareName[SQUARE_NUMERIC_NDX])) return INVALID_SQUARE;

  return Number(squareName[SQUARE_NUMERIC_NDX]);
}

function getColumnIndexFromSquare(squareName) {
  if (!isValidSquareIndex(squareName)) return INVALID_SQUARE;

  return columnArray.indexOf(squareName[SQUARE_ALPHABETICAL_NDX]);
}
function getAnyMainDiagonalFromBegin(beginSquareName, color) {
  let myColumnIndex = getColumnIndexFromSquare(beginSquareName);
  let myLineIndex = getLineIndexFromSquare(beginSquareName);
  let mainDiagonal = [beginSquareName];
  if (myLineIndex == -1) return -1;

  let nextRightColumnOffset = getMovementOffset(RGT_OFFSET, color);
  let nextBottomLineOffset = 0;
  if (color == "B") nextBottomLineOffset = getMovementOffset(BOT_OFFSET, "W");
  else nextBottomLineOffset = getMovementOffset(BOT_OFFSET, color);

  let nextBottomLine = myLineIndex + nextBottomLineOffset;
  let nextRightColumn = myColumnIndex + nextRightColumnOffset;
  let nextBottomRightSquareName =
    columnArray[nextRightColumn] !== undefined
      ? columnArray[nextRightColumn] + nextBottomLine
      : -1;

  while (nextBottomRightSquareName != -1) {
    mainDiagonal.push(nextBottomRightSquareName);
    if (color == "B")
      nextBottomLineOffset = nextBottomLineOffset + getMovementOffset(BOT_OFFSET, "W");
    else
      nextBottomLineOffset = nextBottomLineOffset + getMovementOffset(BOT_OFFSET, color);

    nextRightColumnOffset = nextRightColumnOffset + getMovementOffset(RGT_OFFSET, color);

    nextBottomLine = myLineIndex + nextBottomLineOffset;
    nextRightColumn = myColumnIndex + nextRightColumnOffset;
    nextBottomRightSquareName =
      columnArray[nextRightColumn] !== undefined
        ? columnArray[nextRightColumn] + nextBottomLine
        : -1;
  }
  return mainDiagonal;
}
function getAnyOppositeDiagonalFromEnd(beginSquareName) {
  return getAnyMainDiagonalFromBegin(beginSquareName, "B");
}

function togglePlayerColor() {
  playerColorStatus = playerColorStatus ? 0 : 1;
}
function togglePlayerColorAndRedrawBoard() {
  if (!confirm("ATENÇÃO! Inverter as cores? (todo progresso será perdido)")) return;

  playerColorStatus = playerColorStatus ? 0 : 1;
  redrawBoard();
}
function redrawBoard() {
  deleteBoard();
  drawBoard();
}
// const MOVEMENT_DIRECTION_COLUMN   = 0x01;
// const MOVEMENT_DIRECTION_LINE     = 0x02;
// const MOVEMENT_DIRECTION_DIAGONAL = 0x04;
// const MOVEMENT_DIRECTION_L        = 0x08;
function initPieceMovements() {
  for (i = 0; i < pieceType.length; i++) {
    switch (pieceType[i]) {
      case PIECE_TYPE_ROOK:
        // pieceMovementType[i] |= MOVEMENT_DIRECTION_COLUMN;
        // pieceMovementType[i]   |= SUBTYPE_COLUMN_TOP;
        // pieceMovementType[i]   |= SUBTYPE_COLUMN_BOTTOM;
        // pieceMovementType[i] |= SPECIAL_MOVEMENT_CASTLE;
        // pieceMovementType[i] |= MOVEMENT_DIRECTION_LINE;
        // pieceMovementType[i]   |= SUBTYPE_LINE_LEFT;
        // pieceMovementType[i]   |= SUBTYPE_LINE_RIGHT;
        pieceMovementType[i] = ROOK_INITIAL_MOVEMENT;
        // pieceMovementRange[i] = LINE_OF_SIGHT;
        pieceMovementRange[i] = ROOK_MOVEMENT_RANGE;
        break;
      case PIECE_TYPE_KNIGHT:
        // pieceMovementType[i]  |= MOVEMENT_DIRECTION_L;
        // pieceMovementRange[i] = L_RANGE; // 2 movements 4way expressed
        pieceMovementType[i] = KNIGHT_MOVEMENT;
        pieceMovementRange[i] = KNIGHT_MOVEMENT_RANGE; // 2 movements 4way expressed
        break;
      case PIECE_TYPE_BISHOP:
        // pieceMovementType[i] = MOVEMENT_DIRECTION_DIAGONAL;
        // pieceMovementType[i]   |= SUBTYPE_DIAG_MAIN_BEGIN | SUBTYPE_DIAG_MAIN_END;
        // pieceMovementType[i]   |= SUBTYPE_DIAG_OPPOSITE_BEGIN | SUBTYPE_DIAG_OPPOSITE_END;
        pieceMovementType[i] = BISHOP_MOVEMENT;
        // pieceMovementRange[i] = LINE_OF_SIGHT;
        pieceMovementRange[i] = BISHOP_MOVEMENT_RANGE;
        break;
      case PIECE_TYPE_QUEEN:
        // pieceMovementType[i] |= MOVEMENT_DIRECTION_COLUMN;
        // pieceMovementType[i]   |= SUBTYPE_COLUMN_TOP;
        // pieceMovementType[i]   |= SUBTYPE_COLUMN_BOTTOM;
        // pieceMovementType[i] |= MOVEMENT_DIRECTION_LINE;
        // pieceMovementType[i]   |= SUBTYPE_LINE_LEFT;
        // pieceMovementType[i]   |= SUBTYPE_LINE_RIGHT;
        // pieceMovementType[i] |= MOVEMENT_DIRECTION_DIAGONAL;
        // pieceMovementType[i]   |= SUBTYPE_DIAG_MAIN_BEGIN | SUBTYPE_DIAG_MAIN_END;
        // pieceMovementType[i]   |= SUBTYPE_DIAG_OPPOSITE_BEGIN | SUBTYPE_DIAG_OPPOSITE_END;
        pieceMovementType[i] = QUEEN_MOVEMENT;
        // pieceMovementRange[i] = LINE_OF_SIGHT;
        pieceMovementRange[i] = QUEEN_MOVEMENT_RANGE;
        break;
      case PIECE_TYPE_KING:
        // pieceMovementType[i] |= SPECIAL_MOVEMENT_CASTLE;
        // pieceMovementType[i] |= MOVEMENT_DIRECTION_COLUMN;
        // pieceMovementType[i]   |= SUBTYPE_COLUMN_TOP;
        // pieceMovementType[i]   |= SUBTYPE_COLUMN_BOTTOM;
        // pieceMovementType[i] |= MOVEMENT_DIRECTION_LINE;
        // pieceMovementType[i]   |= SUBTYPE_LINE_LEFT;
        // pieceMovementType[i]   |= SUBTYPE_LINE_RIGHT;
        // pieceMovementType[i] |= MOVEMENT_DIRECTION_DIAGONAL;
        // pieceMovementType[i]   |= SUBTYPE_DIAG_MAIN_BEGIN | SUBTYPE_DIAG_MAIN_END;
        // pieceMovementType[i]   |= SUBTYPE_DIAG_OPPOSITE_BEGIN | SUBTYPE_DIAG_OPPOSITE_END;
        pieceMovementType[i] = KING_INITIAL_MOVEMENT;
        // pieceMovementRange[i] = SQUARE_RANGE;
        pieceMovementRange[i] = KING_MOVEMENT_RANGE;
        break;
      case PIECE_TYPE_PAWN:
        // pieceMovementType[i] |= MOVEMENT_DIRECTION_COLUMN;
        // pieceMovementType[i]   |= SUBTYPE_COLUMN_TOP;
        // pieceMovementType[i]   |= SUBTYPE_COLUMN_BOTTOM;
        // pieceMovementType[i] |= MOVEMENT_DIRECTION_DIAGONAL;
        pieceMovementType[i] = PAWN_INITIAL_MOVEMENT;
        // pieceMovementRange[i] = SQUARE_RANGE;
        pieceMovementRange[i] = PAWN_INITIAL_RANGE;
        break;
    }
  }
}

function isValidSquareIndex(squareIndex) {
  if (squareIndex < 1 || squareIndex > 8 || isNaN(squareIndex)) return false;

  return true;
}

function isLetter(letter) {
  return letter.length === 1 && letter.match(/[a-z]/i);
}
function isValidSquareAlpha(sqAlpha) {
  if (columnArray.indexOf(sqAlpha) === -1) return false;

  return true;
}
function isValidSquare(squareName) {
  if (
    isValidSquareAlpha(squareName[SQUARE_ALPHABETICAL_NDX]) &&
    isValidSquareIndex(squareName[SQUARE_NUMERIC_NDX])
  )
    return true;

  return false;
}

function getSquareGroupStatus(squares) {
  squares.map(function (value) {
    if (isValidSquareIndex(value)) {
      if (getSquareStatus(value) == BLANK_SPACE_SQUARE) emptySquareArr.push(value);
      else if (getSquareStatus(value) == OPPONENT_PIECE_SQUARE)
        opponentSquareArr.push(value);
    }
  });
}
function getSquareStatus(squareName) {
  if (isValidSquare(squareName) == false) return INVALID_SQUARE;

  var tmpPiece = getPieceObjFromDiv(squareName);

  if (tmpPiece == null) return BLANK_SPACE_SQUARE;

  // Tem uma peça nessa casa...
  if (tmpPiece.color == getPlayerColorNotation()) return PLAYER_PIECE_SQUARE;
  else if (tmpPiece.color == getOpponentColorNotation()) return OPPONENT_PIECE_SQUARE;

  return UNKNOWN_SQUARE;
}
function hasBlankSpace(squareName) {
  if (squareName == -1) return false;

  if (isValidSquare(squareName) == false) return false;

  return document.getElementById(squareName).innerHTML == "" ? true : false;
}
function setClassByBGAttr(className, bgcAttr, squareId) {
  if (bgcAttr.includes("dark")) {
    className += "dark";
  }

  document.getElementById(squareId).classList.add(className);
}

// 0001 >> 1 0000
// 0010 >> 2 0001 0000
// 0100 >> 3 0010 0001 0000
// 1000 >> 4 0100 0010 0001 0000
function getClassNameFromMovementDirection(baseMovementDirection) {
  let i = 0;
  for (; baseMovementDirection > 0; i++) {
    baseMovementDirection = baseMovementDirection >> 1;
    // alert(baseMovementDirection);
  }
  return highlightClasses[i - 1];
}

function colorDiscreteMovementPath(movementDiscreteArray, baseMovementDirection) {
  // alert("colorDiscreteMovementPath("+movementDiscreteArray+", "+baseMovementDirection+")");
  let myClassName = getClassNameFromMovementDirection(baseMovementDirection);
  movementDiscreteArray.map(function (squareId) {
    let bgcAttr = setBGColorAsDOMAttributeAndRemove(squareId);
    setClassByBGAttr(myClassName, bgcAttr, squareId);
  });
}

function colorMovementPath(movementType) {
  highlightMovementDirection(movementType);
  return;
  matchMovementDirection(movementType, MOVEMENT_DIRECTION_LINE);
  if (matchMovementDirection(movementType, MOVEMENT_DIRECTION_LINE)) {
    let lineNdx = lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_NUMERIC_NDX];

    let originColumn = columnArray.indexOf(
      lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]
    );
    let destColumn = columnArray.indexOf(
      lineMovementRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]
    );
    let comparisonColumn =
      pieceSelected[PIECE_COLOR_INDEX] == colorNotation[COLOR_WHITE]
        ? originColumn <= destColumn
        : originColumn >= destColumn;

    let columnInterval = comparisonColumn
      ? columnArray.slice(originColumn, destColumn + 1)
      : columnArray.slice(destColumn, originColumn + 1);

    columnInterval.map(function (value) {
      let squareId = "" + value + lineNdx;
      let bgcAttr = setBGColorAsDOMAttributeAndRemove(squareId);
      setClassByBGAttr("linemovhl", bgcAttr, squareId);
    });
  }
  if (matchMovementDirection(movementType, MOVEMENT_DIRECTION_COLUMN)) {
    let columnChar =
      columnMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX];
    let lineNdx0 = Number(
      columnMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_NUMERIC_NDX]
    );
    let lineNdx1 = Number(
      columnMovementRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_NUMERIC_NDX]
    );

    let i = lineNdx0 < lineNdx1 ? lineNdx0 : lineNdx1;
    let greaterLineVal = lineNdx0 < lineNdx1 ? lineNdx1 : lineNdx0;

    for (; i <= greaterLineVal; i++) {
      let squareId = "" + columnChar + i;
      let bgcAttr = setBGColorAsDOMAttributeAndRemove(squareId);
      setClassByBGAttr("columnmovhl", bgcAttr, squareId);
    }
  }
  if (matchMovementDirection(movementType, MOVEMENT_DIRECTION_DIAGONAL)) {
    let mainDiagLineNdx =
      mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_NUMERIC_NDX];
    let oppositeDiagLineNdx =
      oppositeDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_NUMERIC_NDX];

    if (matchMovementDirection(getMovementType(pieceSelected), SUBTYPE_DIAG_MAIN_BEGIN)) {
      let originColumn = columnArray.indexOf(
        mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]
      );
      let myColumn = columnArray.indexOf(
        getPieceLocation(pieceSelected)[SQUARE_ALPHABETICAL_NDX]
      );
      let comparisonColumn =
        pieceSelected[PIECE_COLOR_INDEX] == colorNotation[COLOR_WHITE]
          ? originColumn <= myColumn
          : originColumn >= myColumn;
      let subTypeMainBeginInterval = comparisonColumn
        ? columnArray.slice(originColumn, myColumn + 1)
        : columnArray.slice(myColumn, originColumn + 1);

      subTypeMainBeginInterval.map(function (value) {
        let squareId = "" + value + mainDiagLineNdx;
        let bgcAttr = setBGColorAsDOMAttributeAndRemove(squareId);
        setClassByBGAttr("diagonalmovhl", bgcAttr, squareId);
        mainDiagLineNdx--;
      });
    }
    mainDiagLineNdx++;
    if (matchMovementDirection(getMovementType(pieceSelected), SUBTYPE_DIAG_MAIN_END)) {
      let originColumn = columnArray.indexOf(
        mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]
      );
      let myColumn = columnArray.indexOf(
        getPieceLocation(pieceSelected)[SQUARE_ALPHABETICAL_NDX]
      );
      let comparisonColumn =
        pieceSelected[PIECE_COLOR_INDEX] == colorNotation[COLOR_WHITE]
          ? originColumn <= myColumn
          : originColumn >= myColumn;
      let subTypeMainEndInterval = comparisonColumn
        ? columnArray.slice(originColumn, myColumn + 1)
        : columnArray.slice(myColumn, originColumn + 1);

      subTypeMainEndInterval.map(function (value) {
        let squareId = "" + value + mainDiagLineNdx;
        let bgcAttr = setBGColorAsDOMAttributeAndRemove(squareId);
        setClassByBGAttr("diagonalmovhl", bgcAttr, squareId);
        mainDiagLineNdx--;
      });
    }
    if (
      matchMovementDirection(getMovementType(pieceSelected), SUBTYPE_DIAG_OPPOSITE_BEGIN)
    ) {
      let originColumn = columnArray.indexOf(
        oppositeDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]
      );
      let myColumn = columnArray.indexOf(
        getPieceLocation(pieceSelected)[SQUARE_ALPHABETICAL_NDX]
      );
      let comparisonColumn =
        pieceSelected[PIECE_COLOR_INDEX] == colorNotation[COLOR_WHITE]
          ? originColumn <= myColumn
          : originColumn >= myColumn;
      let subTypeOppositeBeginInterval = comparisonColumn
        ? columnArray.slice(originColumn, myColumn + 1)
        : columnArray.slice(myColumn, originColumn + 1);

      subTypeOppositeBeginInterval.map(function (value) {
        let squareId = "" + value + oppositeDiagLineNdx;
        let bgcAttr = setBGColorAsDOMAttributeAndRemove(squareId);
        setClassByBGAttr("diagonalmovhl", bgcAttr, squareId);
        oppositeDiagLineNdx++;
      });
    }
    oppositeDiagLineNdx--;
    if (
      matchMovementDirection(getMovementType(pieceSelected), SUBTYPE_DIAG_OPPOSITE_END)
    ) {
      let originColumn = columnArray.indexOf(
        oppositeDiagonalRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]
      );
      let myColumn = columnArray.indexOf(
        getPieceLocation(pieceSelected)[SQUARE_ALPHABETICAL_NDX]
      );
      let comparisonColumn =
        pieceSelected[PIECE_COLOR_INDEX] == colorNotation[COLOR_WHITE]
          ? originColumn <= myColumn
          : originColumn >= myColumn;
      let subTypeOppositeEndInterval = comparisonColumn
        ? columnArray.slice(originColumn, myColumn + 1)
        : columnArray.slice(myColumn, originColumn + 1);

      subTypeOppositeEndInterval.map(function (value) {
        let squareId = "" + value + oppositeDiagLineNdx;
        let bgcAttr = setBGColorAsDOMAttributeAndRemove(squareId);
        setClassByBGAttr("diagonalmovhl", bgcAttr, squareId);
        oppositeDiagLineNdx++;
      });
    }
  }
  if (matchMovementDirection(movementType, MOVEMENT_DIRECTION_L)) {
    LMovementSquares.map(function (squareId) {
      if (isValidSquareIndex(squareId)) {
        setBGColorAsDOMAttributeAndRemove(squareId);
        let bgcAttr = setBGColorAsDOMAttributeAndRemove(squareId);
        setClassByBGAttr("knightmovhl", bgcAttr, squareId);
      }
    });
  }
  colorCaptureSquares();
}
function colorCaptureSquares() {
  if (captureSquareCtr > 0) {
    captureSquares.map(function (squareId) {
      if (isValidSquareIndex(squareId)) {
        let bgcAttr = setBGColorAsDOMAttributeAndRemove(squareId);
        setClassByBGAttr("capturehl", bgcAttr, squareId);
      }
    });
  }
}
function setBGColorAsDOMAttributeAndRemove(elemId) {
  let myClassName = bgBoardColors[DARK_BGCOLOR];
  let myElem = document.getElementById(elemId);
  if (!myElem.classList.contains(myClassName)) myClassName = bgBoardColors[LIGHT_BGCOLOR];

  if (myElem.classList.contains(myClassName)) {
    myElem.setAttribute("bgc", myClassName);
    myElem.classList.remove(myClassName);
  }
  return myClassName;
}
// Peça estimou todo movimento possivel, baseado em seu alcance?
function hasFullFilledRange(movementType, pieceRange) {
  let myRange = 0;
  if (pieceRange == SQUARE_RANGE) myRange = SQUARE_RANGE;
  else if (pieceRange == DOUBLE_SQUARE_RANGE) myRange = DOUBLE_SQUARE_RANGE;
  else if (pieceRange == LINE_OF_SIGHT) myRange = LINE_OF_SIGHT; // 8

  if (movementType & MOVEMENT_DIRECTION_COLUMN) {
    let lineNdx0 = Number(
      columnMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_NUMERIC_NDX]
    );
    let lineNdx1 = Number(
      columnMovementRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_NUMERIC_NDX]
    );

    return Math.abs(lineNdx0 - lineNdx1) >= Number(myRange) ? true : false;
  }
  if (movementType & MOVEMENT_DIRECTION_LINE) {
    let originColumn = columnArray.indexOf(
      lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]
    );
    let destColumn = columnArray.indexOf(
      lineMovementRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]
    );
    let comparisonColumn =
      pieceSelected[PIECE_COLOR_INDEX] == colorNotation[COLOR_WHITE]
        ? originColumn <= destColumn
        : originColumn >= destColumn;

    let columnInterval = comparisonColumn
      ? columnArray.slice(originColumn, destColumn + 1)
      : columnArray.slice(destColumn, originColumn + 1);

    return columnInterval.length >= Number(myRange) ? true : false;
  }
  if (movementType & MOVEMENT_DIRECTION_DIAGONAL) {
    // novo tratamemto por quadrantes
    let fullFilledSubtypeMainBeginInterval = false;
    let fullFilledSubtypeMainEndInterval = false;
    let fullFilledSubtypeOppositeBeginInterval = false;
    let fullFilledSubtypeOppositeEndInterval = false;
    if (matchMovementDirection(getMovementType(pieceSelected), SUBTYPE_DIAG_MAIN_BEGIN)) {
      let originColumn = columnArray.indexOf(
        mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]
      );
      let myColumn = columnArray.indexOf(
        getPieceLocation(pieceSelected)[SQUARE_ALPHABETICAL_NDX]
      );
      let comparisonColumn =
        pieceSelected[PIECE_COLOR_INDEX] == colorNotation[COLOR_WHITE]
          ? originColumn <= myColumn
          : originColumn >= myColumn;
      let subTypeMainBeginInterval = comparisonColumn
        ? columnArray.slice(originColumn, myColumn + 1)
        : columnArray.slice(myColumn, originColumn + 1);
      fullFilledSubtypeMainBeginInterval =
        subTypeMainBeginInterval.length >= Number(myRange);
    }
    if (matchMovementDirection(getMovementType(pieceSelected), SUBTYPE_DIAG_MAIN_END)) {
      let originColumn = columnArray.indexOf(
        mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]
      );
      let myColumn = columnArray.indexOf(
        getPieceLocation(pieceSelected)[SQUARE_ALPHABETICAL_NDX]
      );
      let comparisonColumn =
        pieceSelected[PIECE_COLOR_INDEX] == colorNotation[COLOR_WHITE]
          ? originColumn <= myColumn
          : originColumn >= myColumn;
      let subTypeMainEndInterval = comparisonColumn
        ? columnArray.slice(originColumn, myColumn + 1)
        : columnArray.slice(myColumn, originColumn + 1);
      fullFilledSubtypeMainEndInterval = subTypeMainEndInterval.length >= Number(myRange);
    }
    if (
      matchMovementDirection(getMovementType(pieceSelected), SUBTYPE_DIAG_OPPOSITE_BEGIN)
    ) {
      let originColumn = columnArray.indexOf(
        oppositeDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]
      );
      let myColumn = columnArray.indexOf(
        getPieceLocation(pieceSelected)[SQUARE_ALPHABETICAL_NDX]
      );
      let comparisonColumn =
        pieceSelected[PIECE_COLOR_INDEX] == colorNotation[COLOR_WHITE]
          ? originColumn <= myColumn
          : originColumn >= myColumn;
      let subTypeOppositeBeginInterval = comparisonColumn
        ? columnArray.slice(originColumn, myColumn + 1)
        : columnArray.slice(myColumn, originColumn + 1);
      fullFilledSubtypeOppositeBeginInterval =
        subTypeOppositeBeginInterval.length >= Number(myRange);
    }
    if (
      matchMovementDirection(getMovementType(pieceSelected), SUBTYPE_DIAG_OPPOSITE_END)
    ) {
      let originColumn = columnArray.indexOf(
        oppositeDiagonalRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]
      );
      let myColumn = columnArray.indexOf(
        getPieceLocation(pieceSelected)[SQUARE_ALPHABETICAL_NDX]
      );
      let comparisonColumn =
        pieceSelected[PIECE_COLOR_INDEX] == colorNotation[COLOR_WHITE]
          ? originColumn <= myColumn
          : originColumn >= myColumn;

      let subTypeOppositeEndInterval = comparisonColumn
        ? columnArray.slice(originColumn, myColumn + 1)
        : columnArray.slice(myColumn, originColumn + 1);

      fullFilledSubtypeOppositeEndInterval =
        subTypeOppositeEndInterval.length >= Number(myRange);
    }
    return (
      fullFilledSubtypeMainBeginInterval &
      fullFilledSubtypeMainEndInterval &
      fullFilledSubtypeOppositeBeginInterval &
      fullFilledSubtypeOppositeEndInterval
    );
  }
}
// Obter alcance do movimento da peca
function getMovementRange(piece) {
  let pieceNdx = pieceType.indexOf(piece[PIECE_NOTATION_INDEX]);
  return pieceMovementRange[pieceNdx];
}
// Obter direcoes que a peca anda
function getMovementType(piece) {
  let pieceNdx = pieceType.indexOf(piece[PIECE_NOTATION_INDEX]);
  return pieceMovementType[pieceNdx];
}
// Este conjunto de movimentos possui esta direcao(direction) especifica?
function matchMovementDirection(movType, direction) {
  return movType & direction ? true : false;
}
function matchMovementDirectionAndDisable(movType, direction) {
  if (movType & direction) {
    return movType ^ direction;
  }
  return movType;
}
function alertAllMovementSubTypes(movType) {
  movType & SUBTYPE_DIAG_MAIN_BEGIN ? alert("SUBTYPE_DIAG_MAIN_BEGIN") : alert("no");
  movType & SUBTYPE_DIAG_MAIN_END ? alert("SUBTYPE_DIAG_MAIN_END") : alert("no");
  movType & SUBTYPE_DIAG_OPPOSITE_BEGIN
    ? alert("SUBTYPE_DIAG_OPPOSITE_BEGIN")
    : alert("no");
  movType & SUBTYPE_DIAG_OPPOSITE_END ? alert("SUBTYPE_DIAG_OPPOSITE_END") : alert("no");
}
function xorMovementDirection(movType, direction) {
  return movType ^ direction;
}
// Obter 'casa' da peça (Ex.: a2, h1, f7, etc.)
function getPieceLocation() {
  // let myId = $('.piecesquare:contains("' + piece.toString() + '")').attr("id");

  return pieceObj.getPiecePosition();
}
// Esta peça possui algum movimento ja calculado a realizar ?
function hasAnyMovementOnRange(piece) {
  let movType = pieceObj.getMovement();
  if (matchMovementDirection(movType, MOVEMENT_DIRECTION_COLUMN)) {
    let lineNdx0 = Math.abs(
      Number(columnMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_NUMERIC_NDX])
    );
    let lineNdx1 = Math.abs(
      Number(columnMovementRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_NUMERIC_NDX])
    );
    if (Math.abs(lineNdx0 - lineNdx1) > 0) {
      return true;
    }
  }
  if (matchMovementDirection(movType, MOVEMENT_DIRECTION_LINE)) {
    let originColumn = columnArray.indexOf(
      lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]
    );
    let destColumn = columnArray.indexOf(
      lineMovementRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]
    );
    let comparisonColumn =
      pieceSelected[0] == colorNotation[COLOR_WHITE]
        ? originColumn <= destColumn
        : originColumn >= destColumn;
    let columnInterval = comparisonColumn
      ? columnArray.slice(originColumn, destColumn + 1)
      : columnArray.slice(destColumn, originColumn + 1);
    if (columnInterval.length > 1) {
      return true;
    }
  }
  if (matchMovementDirection(movType, MOVEMENT_DIRECTION_DIAGONAL)) {
    let originColumn = columnArray.indexOf(
      mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]
    );
    let destColumn = columnArray.indexOf(
      mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]
    );
    let mainDiagonalInterval =
      originColumn <= destColumn
        ? columnArray.slice(originColumn, destColumn + 1)
        : columnArray.slice(destColumn, originColumn + 1);
    if (mainDiagonalInterval.length > 1) {
      return true;
    }
    originColumn = columnArray.indexOf(
      oppositeDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]
    );
    destColumn = columnArray.indexOf(
      oppositeDiagonalRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]
    );
    let oppositeDiagonalInterval =
      originColumn <= destColumn
        ? columnArray.slice(originColumn, destColumn + 1)
        : columnArray.slice(destColumn, originColumn + 1);
    if (oppositeDiagonalInterval.length > 1) {
      return true;
    }
  }
  if (matchMovementDirection(movType, MOVEMENT_DIRECTION_L)) {
    return LMovementSquares[0] != -1 ? true : false;
  }
  return false;
}
function resetAllDirectionMovementRange() {
  columnMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE] = -1;
  columnMovementRange[MOVEMENT_RANGE_END_SQUARE] = -1;

  lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE] = -1;
  lineMovementRange[MOVEMENT_RANGE_END_SQUARE] = -1;

  mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE] = -1;
  mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE] = -1;

  oppositeDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE] = -1;
  oppositeDiagonalRange[MOVEMENT_RANGE_END_SQUARE] = -1;
}
function getMovementOffset(movementOrientation, pieceColor) {
  switch (movementOrientation) {
    case TOP_OFFSET:
      return pieceColor == PIECE_COLOR_WHITE ? 1 : -1;
    case BOT_OFFSET:
      return pieceColor == PIECE_COLOR_WHITE ? -1 : 1;
    case LFT_OFFSET:
      return pieceColor == PIECE_COLOR_WHITE ? -1 : 1;
    case RGT_OFFSET:
      return pieceColor == PIECE_COLOR_WHITE ? 1 : -1;
  }
  return 0;
}
function movementMatchesAnyDirection(movementType) {
  return movementType & MOVEMENT_DIRECTION_ALL ? true : false;
}
function movementMatchesAnySubtype(movementType) {
  return movementType & SUBTYPE_ALL ? true : false;
}
function movementMatchesTypeAndSubType(movementType) {
  return movementType & DIRECTION_SUBTYPE_ALL ? true : false;
}
function scanPawnDiagonal(originSquare, piece) {
  let myColor = piece[PIECE_COLOR_INDEX];
  let myLineIndex = Number(originSquare[SQUARE_NUMERIC_NDX]);
  let myColumnIndex = columnArray.indexOf(originSquare[SQUARE_ALPHABETICAL_NDX]);
  let nextTopLineOffset = getMovementOffset(TOP_OFFSET, myColor);
  let nextLeftColumnOffset = getMovementOffset(LFT_OFFSET, myColor);
  let nextRightColumnOffset = getMovementOffset(RGT_OFFSET, myColor);
  let nextLeftColumn = myColumnIndex + nextLeftColumnOffset;
  let nextRightColumn = myColumnIndex + nextRightColumnOffset;

  let nextTopLine = myLineIndex + nextTopLineOffset;
  // Destination Squares
  let nextTopLeftSquareName =
    columnArray[nextLeftColumn] !== undefined
      ? columnArray[nextLeftColumn] + nextTopLine
      : -1;
  let nextTopRightSquareName =
    columnArray[nextRightColumn] !== undefined
      ? columnArray[nextRightColumn] + nextTopLine
      : -1;

  mySquareContent = getSquareStatus(nextTopLeftSquareName);
  if (mySquareContent == OPPONENT_PIECE_SQUARE) {
    captureSquares[captureSquareCtr++] = nextTopLeftSquareName;
  }
  mySquareContent = getSquareStatus(nextTopRightSquareName);
  if (mySquareContent == OPPONENT_PIECE_SQUARE) {
    captureSquares[captureSquareCtr++] = nextTopRightSquareName;
  }
  let boolReturn =
    captureSquareCtr > 0 ||
    (isValidSquareIndex(columnMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE]) &&
      isValidSquareIndex(columnMovementRange[MOVEMENT_RANGE_END_SQUARE]));
  return boolReturn;
}

// document.querySelectorAll('[lndx="[3-8]"][clm="c"]')

function highlightMovementDirection(direction) {
  if (matchMovementDirection(direction, MOVEMENT_DIRECTION_COLUMN)) {
    let myClassName = getClassNameFromMovementDirection(MOVEMENT_DIRECTION_COLUMN);
    var str = pieceObj.elmcurrentsq.getAttribute("taw");
    var sqTohl = str.split("|", pieceSelected.getRange());
    sqTohl.map(function (sq) {
      if (sq != "") {
        let elemPiece = document.getElementById(sq);
        if (
          elemPiece.getAttribute("piece") != "" ||
          elemPiece.getAttribute("piece") !== undefined ||
          elemPiece.getAttribute("piece") != null
        )
          highlightColumnSquare(elemPiece, myClassName);
      }
    });
  }
  if (matchMovementDirection(direction, MOVEMENT_DIRECTION_LINE)) {
    var objRetorno = new Object();
    let myClassName = getClassNameFromMovementDirection(MOVEMENT_DIRECTION_LINE);
    var str = document
      .getElementById(pieceObj.getPiecePosition(SQUARE_NAME))
      .getAttribute("raw");
    var sqTohl = str.split("|", pieceSelected.getRange());
    sqTohl.map(function (sq) {
      if (sq != "") {
        let elemPiece = document.getElementById(sq);
        if (
          elemPiece.getAttribute("piece") != "" ||
          elemPiece.getAttribute("piece") !== undefined ||
          elemPiece.getAttribute("piece") != null
        )
          highlightLineSquare(elemPiece, myClassName);
      }
    });
  }
  if (matchMovementDirection(direction, MOVEMENT_DIRECTION_DIAGONAL)) {
    var objRetorno = new Object();
    let myClassName = getClassNameFromMovementDirection(MOVEMENT_DIRECTION_DIAGONAL);
    pieceSelected.getPiecePosition(ELEMENT_SQUARE);
    // pElement.classList.add('rotate45deg');
    pieceSelected.classList.add("rotate45deg");
    // alert(pieceSelected + " " + pieceSelected.getPiecePosition());

    // pElement.innerHTML += "-----------------------------------------------------";

    // alert(document.elementFromPoint(x + px, y + py))
  }
}

function scanMovementDirections(movementType, originSquare, piece, scanType) {
  // const MOVEMENT_DIRECTION_COLUMN   = 0x01;
  // const MOVEMENT_DIRECTION_LINE     = 0x02;
  // const MOVEMENT_DIRECTION_DIAGONAL = 0x04;
  // const MOVEMENT_DIRECTION_L        = 0x08;
  highlightMovementDirection(movementType);
  return;
  let myColor = pieceObj.color;
  let pieceNdx = pieceType.indexOf(piece[PIECE_NOTATION_INDEX]);
  let myLineIndex = Number(originSquare[SQUARE_NUMERIC_NDX]);
  let myFirstLineNdx = myLineIndex;
  let myMovType = movementType;
  let mySquareContent = 0;
  let myColumnIndex = columnArray.indexOf(originSquare[SQUARE_ALPHABETICAL_NDX]);
  let nextTopLineOffset = getMovementOffset(TOP_OFFSET, myColor);
  let nextBottomLineOffset = getMovementOffset(BOT_OFFSET, myColor);
  let nextLeftColumnOffset = getMovementOffset(LFT_OFFSET, myColor);
  let nextRightColumnOffset = getMovementOffset(RGT_OFFSET, myColor);
  captureSquares = [];
  captureSquareCtr = 0;

  resetAllDirectionMovementRange();

  do {
    // Movimenta-se em coluna
    if (matchMovementDirection(myMovType, MOVEMENT_DIRECTION_COLUMN)) {
      let nextTopLine = myLineIndex + nextTopLineOffset;
      let nextBottomLine = myLineIndex + nextBottomLineOffset;
      let nextTopSquareName = originSquare[SQUARE_ALPHABETICAL_NDX] + nextTopLine;
      let nextBottomSquareName = originSquare[SQUARE_ALPHABETICAL_NDX] + nextBottomLine;

      if (scanType == FULL_SCAN) {
        let stillHasMovements = false;
        if (Number(columnMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE]) == -1)
          columnMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE] = originSquare;
        if (Number(columnMovementRange[MOVEMENT_RANGE_END_SQUARE]) == -1)
          columnMovementRange[MOVEMENT_RANGE_END_SQUARE] = originSquare;
        mySquareContent = getSquareStatus(nextBottomSquareName);
        if (
          mySquareContent == BLANK_SPACE_SQUARE &&
          piece[PIECE_NOTATION_INDEX] != PIECE_TYPE_PAWN
        ) {
          stillHasMovements = true;
          columnMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE] = nextBottomSquareName;
          nextBottomLineOffset += getMovementOffset(BOT_OFFSET, myColor);
        } else if (
          mySquareContent == OPPONENT_PIECE_SQUARE &&
          matchMovementDirection(myMovType, MOVEMENT_DIRECTION_COLUMN)
        ) {
          captureSquares[captureSquareCtr++] = nextBottomSquareName;
        }
        mySquareContent = getSquareStatus(nextTopSquareName);
        if (mySquareContent == BLANK_SPACE_SQUARE) {
          if (
            (piece[PIECE_NOTATION_INDEX] == PIECE_TYPE_PAWN &&
              myColor == "W" &&
              myFirstLineNdx == 2) ||
            (piece[PIECE_NOTATION_INDEX] == PIECE_TYPE_PAWN &&
              myColor == "B" &&
              myFirstLineNdx == 7)
          ) {
            pieceMovementRange[pieceNdx] = DOUBLE_SQUARE_RANGE;
            nextTopSquareName =
              originSquare[SQUARE_ALPHABETICAL_NDX] +
              (Number(nextTopLine) + Number(nextTopLineOffset));
            myFirstLineNdx++;
          } else if (piece[PIECE_NOTATION_INDEX] == PIECE_TYPE_PAWN) {
            pieceMovementRange[pieceNdx] = SQUARE_RANGE;
          }
          stillHasMovements = true;
          columnMovementRange[MOVEMENT_RANGE_END_SQUARE] = nextTopSquareName;
          nextTopLineOffset += getMovementOffset(TOP_OFFSET, myColor);
        } else if (
          mySquareContent == OPPONENT_PIECE_SQUARE &&
          matchMovementDirection(myMovType, MOVEMENT_DIRECTION_COLUMN)
        ) {
          if (piece[PIECE_NOTATION_INDEX] != PIECE_TYPE_PAWN)
            captureSquares[captureSquareCtr++] = nextTopSquareName;
        }

        if (hasFullFilledRange(MOVEMENT_DIRECTION_COLUMN, pieceMovementRange[pieceNdx])) {
          myMovType = myMovType ^ MOVEMENT_DIRECTION_COLUMN;
          nextTopLineOffset = getMovementOffset(TOP_OFFSET, myColor);
          nextBottomLineOffset = getMovementOffset(BOT_OFFSET, myColor);
          continue;
        }

        if (stillHasMovements == false) {
          myMovType = myMovType ^ MOVEMENT_DIRECTION_COLUMN;
          nextTopLineOffset = getMovementOffset(TOP_OFFSET, myColor);
          nextBottomLineOffset = getMovementOffset(BOT_OFFSET, myColor);
          continue;
        }
      } else if (
        hasBlankSpace(nextTopSquareName) ||
        hasBlankSpace(nextBottomSquareName)
      ) {
        return true;
      } else {
        myMovType = myMovType ^ MOVEMENT_DIRECTION_COLUMN;
        continue;
      }
    } else if (matchMovementDirection(myMovType, MOVEMENT_DIRECTION_LINE)) {
      let nextLeftColumn = myColumnIndex + nextLeftColumnOffset;
      let nextRightColumn = myColumnIndex + nextRightColumnOffset;
      let nextLeftSquareName =
        columnArray[nextLeftColumn] !== undefined
          ? columnArray[nextLeftColumn] + originSquare[SQUARE_NUMERIC_NDX]
          : -1;
      let nextRightSquareName =
        columnArray[nextRightColumn] !== undefined
          ? columnArray[nextRightColumn] + originSquare[SQUARE_NUMERIC_NDX]
          : -1;
      if (scanType == FULL_SCAN) {
        let stillHasMovements = false;
        if (Number(lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE]) == -1)
          lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE] = originSquare;
        if (Number(lineMovementRange[MOVEMENT_RANGE_END_SQUARE]) == -1)
          lineMovementRange[MOVEMENT_RANGE_END_SQUARE] = originSquare;

        mySquareContent = getSquareStatus(nextLeftSquareName);
        if (mySquareContent == BLANK_SPACE_SQUARE) {
          stillHasMovements = true;
          lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE] = nextLeftSquareName;
          nextLeftColumnOffset += getMovementOffset(LFT_OFFSET, myColor);
        } else if (mySquareContent == OPPONENT_PIECE_SQUARE) {
          captureSquares[captureSquareCtr++] = nextLeftSquareName;
        }
        mySquareContent = getSquareStatus(nextRightSquareName);
        if (mySquareContent == BLANK_SPACE_SQUARE) {
          stillHasMovements = true;
          lineMovementRange[MOVEMENT_RANGE_END_SQUARE] = nextRightSquareName;
          nextRightColumnOffset += getMovementOffset(RGT_OFFSET, myColor);
        } else if (mySquareContent == OPPONENT_PIECE_SQUARE) {
          captureSquares[captureSquareCtr++] = nextRightSquareName;
        }
        if (
          hasFullFilledRange(MOVEMENT_DIRECTION_LINE, pieceMovementRange[pieceNdx]) ||
          stillHasMovements == false
        ) {
          myMovType = myMovType ^ MOVEMENT_DIRECTION_LINE;
          nextLeftColumnOffset = getMovementOffset(LFT_OFFSET, myColor);
          nextRightColumnOffset = getMovementOffset(RGT_OFFSET, myColor);
          continue;
        }
      } else if (
        hasBlankSpace(nextLeftSquareName) ||
        hasBlankSpace(nextRightSquareName)
      ) {
        return true;
      } else {
        myMovType = myMovType ^ MOVEMENT_DIRECTION_LINE;
        continue;
      }
    } else if (matchMovementDirection(myMovType, MOVEMENT_DIRECTION_DIAGONAL)) {
      // Column offset
      let nextLeftColumn = myColumnIndex + nextLeftColumnOffset;
      let nextRightColumn = myColumnIndex + nextRightColumnOffset;
      // Line Offset
      let nextTopLine = myLineIndex + nextTopLineOffset;
      let nextBottomLine = myLineIndex + nextBottomLineOffset;
      // Destination Squares
      let nextTopLeftSquareName =
        columnArray[nextLeftColumn] !== undefined
          ? columnArray[nextLeftColumn] + nextTopLine
          : -1;
      let nextTopRightSquareName =
        columnArray[nextRightColumn] !== undefined
          ? columnArray[nextRightColumn] + nextTopLine
          : -1;
      let nextBottomLeftSquareName =
        columnArray[nextLeftColumn] !== undefined
          ? columnArray[nextLeftColumn] + nextBottomLine
          : -1;
      let nextBottomRightSquareName =
        columnArray[nextRightColumn] !== undefined
          ? columnArray[nextRightColumn] + nextBottomLine
          : -1;
      if (scanType == FULL_SCAN) {
        let stillHasMovements = false;
        let leftColumnOffsetChanged = 0;
        let bottomLineOffsetChanged = 0;
        let rightColumnOffsetChanged = 0;
        let topLineOffsetChanged = 0;

        // Peoes :(
        if (piece[PIECE_NOTATION_INDEX] == PIECE_TYPE_PAWN)
          return scanPawnDiagonal(originSquare, piece);
        //
        // main Diagonal
        //
        if (Number(mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE]) == -1)
          mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE] = originSquare;
        if (Number(mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE]) == -1)
          mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE] = originSquare;

        mySquareContent = getSquareStatus(nextTopLeftSquareName);
        if (
          mySquareContent == BLANK_SPACE_SQUARE &&
          matchMovementDirection(myMovType, SUBTYPE_DIAG_MAIN_BEGIN)
        ) {
          stillHasMovements = true;
          mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE] = nextTopLeftSquareName;
          nextLeftColumnOffset += getMovementOffset(LFT_OFFSET, myColor);
          nextTopLineOffset += getMovementOffset(TOP_OFFSET, myColor);
          leftColumnOffsetChanged = 1;
          topLineOffsetChanged = 1;
        } else if (
          mySquareContent == OPPONENT_PIECE_SQUARE &&
          matchMovementDirection(myMovType, SUBTYPE_DIAG_MAIN_BEGIN)
        ) {
          captureSquares[captureSquareCtr++] = nextTopLeftSquareName;
          myMovType = matchMovementDirectionAndDisable(
            myMovType,
            SUBTYPE_DIAG_MAIN_BEGIN
          );
        } else {
          myMovType = matchMovementDirectionAndDisable(
            myMovType,
            SUBTYPE_DIAG_MAIN_BEGIN
          );
        }
        mySquareContent = getSquareStatus(nextBottomRightSquareName);
        if (
          mySquareContent == BLANK_SPACE_SQUARE &&
          matchMovementDirection(myMovType, SUBTYPE_DIAG_MAIN_END)
        ) {
          stillHasMovements = true;
          mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE] = nextBottomRightSquareName;
          nextRightColumnOffset += getMovementOffset(RGT_OFFSET, myColor);
          nextBottomLineOffset += getMovementOffset(BOT_OFFSET, myColor);
          rightColumnOffsetChanged = 1;
          bottomLineOffsetChanged = 1;
        } else if (
          mySquareContent == OPPONENT_PIECE_SQUARE &&
          matchMovementDirection(myMovType, SUBTYPE_DIAG_MAIN_END)
        ) {
          captureSquares[captureSquareCtr++] = nextBottomRightSquareName;
          myMovType = matchMovementDirectionAndDisable(myMovType, SUBTYPE_DIAG_MAIN_END);
        } else {
          myMovType = matchMovementDirectionAndDisable(myMovType, SUBTYPE_DIAG_MAIN_END);
        }
        //
        // opposite Diagonal
        //
        if (Number(oppositeDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE]) == -1)
          oppositeDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE] = originSquare;
        if (Number(oppositeDiagonalRange[MOVEMENT_RANGE_END_SQUARE]) == -1)
          oppositeDiagonalRange[MOVEMENT_RANGE_END_SQUARE] = originSquare;

        mySquareContent = getSquareStatus(nextBottomLeftSquareName);
        if (
          mySquareContent == BLANK_SPACE_SQUARE &&
          matchMovementDirection(myMovType, SUBTYPE_DIAG_OPPOSITE_BEGIN)
        ) {
          stillHasMovements = true;
          oppositeDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE] = nextBottomLeftSquareName;
          // So incrementar se ja nao houve avanco anterior
          nextLeftColumnOffset += leftColumnOffsetChanged
            ? 0
            : getMovementOffset(LFT_OFFSET, myColor);
          nextBottomLineOffset += bottomLineOffsetChanged
            ? 0
            : getMovementOffset(BOT_OFFSET, myColor);
        } else if (
          mySquareContent == OPPONENT_PIECE_SQUARE &&
          matchMovementDirection(myMovType, SUBTYPE_DIAG_OPPOSITE_BEGIN)
        ) {
          captureSquares[captureSquareCtr++] = nextBottomLeftSquareName;
          myMovType = matchMovementDirectionAndDisable(
            myMovType,
            SUBTYPE_DIAG_OPPOSITE_BEGIN
          );
        } else {
          myMovType = matchMovementDirectionAndDisable(
            myMovType,
            SUBTYPE_DIAG_OPPOSITE_BEGIN
          );
        }
        mySquareContent = getSquareStatus(nextTopRightSquareName);
        if (
          mySquareContent == BLANK_SPACE_SQUARE &&
          matchMovementDirection(myMovType, SUBTYPE_DIAG_OPPOSITE_END)
        ) {
          stillHasMovements = true;
          oppositeDiagonalRange[MOVEMENT_RANGE_END_SQUARE] = nextTopRightSquareName;
          // So incrementar se ja nao houve avanco anterior
          nextRightColumnOffset += rightColumnOffsetChanged
            ? 0
            : getMovementOffset(RGT_OFFSET, myColor);
          nextTopLineOffset += topLineOffsetChanged
            ? 0
            : getMovementOffset(TOP_OFFSET, myColor);
        } else if (
          mySquareContent == OPPONENT_PIECE_SQUARE &&
          matchMovementDirection(myMovType, SUBTYPE_DIAG_OPPOSITE_END)
        ) {
          captureSquares[captureSquareCtr++] = nextTopRightSquareName;
          myMovType = matchMovementDirectionAndDisable(
            myMovType,
            SUBTYPE_DIAG_OPPOSITE_END
          );
        } else {
          myMovType = matchMovementDirectionAndDisable(
            myMovType,
            SUBTYPE_DIAG_OPPOSITE_END
          );
        }
        if (
          hasFullFilledRange(myMovType, pieceMovementRange[pieceNdx]) ||
          stillHasMovements == false
        ) {
          myMovType = myMovType ^ MOVEMENT_DIRECTION_DIAGONAL;
          myMovType = matchMovementDirectionAndDisable(
            myMovType,
            SUBTYPE_DIAG_MAIN_BEGIN
          );
          myMovType = matchMovementDirectionAndDisable(myMovType, SUBTYPE_DIAG_MAIN_END);
          myMovType = matchMovementDirectionAndDisable(
            myMovType,
            SUBTYPE_DIAG_OPPOSITE_BEGIN
          );
          myMovType = matchMovementDirectionAndDisable(
            myMovType,
            SUBTYPE_DIAG_OPPOSITE_END
          );
          nextTopLineOffset = getMovementOffset(TOP_OFFSET, myColor);
          nextBottomLineOffset = getMovementOffset(BOT_OFFSET, myColor);
          nextLeftColumnOffset = getMovementOffset(LFT_OFFSET, myColor);
          nextRightColumnOffset = getMovementOffset(RGT_OFFSET, myColor);
          continue;
        }
      } else if (
        hasBlankSpace(nextTopLeftSquareName) ||
        hasBlankSpace(nextTopRightSquareName) ||
        hasBlankSpace(nextBottomLeftSquareName) ||
        hasBlankSpace(nextBottomRightSquareName)
      ) {
        return true;
      } else {
        myMovType = myMovType ^ MOVEMENT_DIRECTION_DIAGONAL;
        myMovType = matchMovementDirectionAndDisable(myMovType, SUBTYPE_DIAG_MAIN_BEGIN);
        myMovType = matchMovementDirectionAndDisable(myMovType, SUBTYPE_DIAG_MAIN_END);
        myMovType = matchMovementDirectionAndDisable(
          myMovType,
          SUBTYPE_DIAG_OPPOSITE_BEGIN
        );
        myMovType = matchMovementDirectionAndDisable(
          myMovType,
          SUBTYPE_DIAG_OPPOSITE_END
        );
        nextTopLineOffset = getMovementOffset(TOP_OFFSET, myColor);
        nextBottomLineOffset = getMovementOffset(BOT_OFFSET, myColor);
        nextLeftColumnOffset = getMovementOffset(LFT_OFFSET, myColor);
        nextRightColumnOffset = getMovementOffset(RGT_OFFSET, myColor);
        continue;
      }
    } else if (matchMovementDirection(myMovType, MOVEMENT_DIRECTION_L)) {
      // Movimento:
      //  Sprint(2 sq) no sentido do quadrante
      //  Turn (1 sq) nos sentido perpendiculares ao quadrante
      //  - Destino
      //    Movimentos nos quadrantes horizontais:
      //    deslocamento no array de letras valor de sprint
      //    deslocamento no eixo vertical no valor de turn

      let nextBottomLine = myLineIndex + nextBottomLineOffset;
      let nextTopLine = myLineIndex + nextTopLineOffset;
      let nextLeftColumn = myColumnIndex + nextLeftColumnOffset;
      let nextRightColumn = myColumnIndex + nextRightColumnOffset;
      let turnMovementTop = nextTopLine;
      let turnMovementBottom = nextBottomLine;
      let turnMovementLeft = nextLeftColumn;
      let turnMovementRight = nextRightColumn;

      LMovementSquares = [];
      LMovementSquares[0] = -1;

      // Quadrante Left
      let sprintMovement = nextLeftColumn + nextLeftColumnOffset;
      let leftZoneMoveTop =
        columnArray[sprintMovement] !== undefined
          ? columnArray[sprintMovement] + turnMovementTop
          : -1;
      let leftZoneMoveBottom =
        columnArray[sprintMovement] !== undefined
          ? columnArray[sprintMovement] + turnMovementBottom
          : -1;
      // Quadrante Right
      sprintMovement = nextRightColumn + nextRightColumnOffset;
      let rightZoneMoveTop =
        columnArray[sprintMovement] !== undefined
          ? columnArray[sprintMovement] + turnMovementTop
          : -1;
      let rightZoneMoveBottom =
        columnArray[sprintMovement] !== undefined
          ? columnArray[sprintMovement] + turnMovementBottom
          : -1;
      // Quadrante Top
      sprintMovement = nextTopLine + nextTopLineOffset;
      let topZoneMoveLeft =
        columnArray[turnMovementLeft] !== undefined
          ? columnArray[turnMovementLeft] + sprintMovement
          : -1;
      let topZoneMoveRight =
        columnArray[turnMovementRight] !== undefined
          ? columnArray[turnMovementRight] + sprintMovement
          : -1;
      // Quadrante Bottom
      sprintMovement = nextBottomLine + nextBottomLineOffset;
      let bottomZoneMoveLeft =
        columnArray[turnMovementLeft] !== undefined
          ? columnArray[turnMovementLeft] + sprintMovement
          : -1;
      let bottomZoneMoveRight =
        columnArray[turnMovementRight] !== undefined
          ? columnArray[turnMovementRight] + sprintMovement
          : -1;

      if (scanType == FULL_SCAN) {
        var arrsquares = [];
        arrsquares.push(leftZoneMoveTop);
        arrsquares.push(leftZoneMoveBottom);
        arrsquares.push(rightZoneMoveTop);
        arrsquares.push(rightZoneMoveBottom);
        arrsquares.push(topZoneMoveLeft);
        arrsquares.push(topZoneMoveRight);
        arrsquares.push(bottomZoneMoveLeft);
        arrsquares.push(topZoneMoveRight);
        getSquareGroupStatus(arrsquares);
        captureSquares = [];
        LMovementSquares = [];
        var data = [];
        LMovementSquares = data.concat(emptySquareArr);

        myMovType = myMovType ^ MOVEMENT_DIRECTION_L;
        nextTopLineOffset = getMovementOffset(TOP_OFFSET, myColor);
        nextBottomLineOffset = getMovementOffset(BOT_OFFSET, myColor);
        nextLeftColumnOffset = getMovementOffset(LFT_OFFSET, myColor);
        nextRightColumnOffset = getMovementOffset(RGT_OFFSET, myColor);

        if (captureSquares.length > 0) return true;

        if (LMovementSquares.length > 0) return true;
      } else if (
        hasBlankSpace(leftZoneMoveTop) ||
        hasBlankSpace(leftZoneMoveBottom) ||
        hasBlankSpace(rightZoneMoveTop) ||
        hasBlankSpace(rightZoneMoveBottom) ||
        hasBlankSpace(topZoneMoveLeft) ||
        hasBlankSpace(topZoneMoveRight) ||
        hasBlankSpace(bottomZoneMoveLeft) ||
        hasBlankSpace(bottomZoneMoveRight)
      ) {
        return true;
      }
    }
  } while (movementMatchesAnyDirection(myMovType));

  if (scanType == FULL_SCAN) {
    if (hasAnyMovementOnRange(piece) == false) return false;

    return true;
  }

  return false;
}

function getLineDiscreteIntervalFromSquare(beginLineSquare) {
  let lineNdx = beginLineSquare[SQUARE_NUMERIC_NDX];
  let myColumnIndex = columnArray.indexOf(beginLineSquare[SQUARE_ALPHABETICAL_NDX]);
  let discreteLine = [beginLineSquare];

  let nextRightColumnOffset = getMovementOffset(RGT_OFFSET, getPlayerColorNotation());
  let nextRightColumn = myColumnIndex + nextRightColumnOffset;
  while (columnArray[nextRightColumn] !== undefined) {
    discreteLine.push("" + columnArray[nextRightColumn] + lineNdx);
    nextRightColumnOffset += getMovementOffset(RGT_OFFSET, getPlayerColorNotation());
    nextRightColumn = myColumnIndex + nextRightColumnOffset;
  }
  return discreteLine;
}
function getColumnDiscreteIntervalFromSquare(beginColumnSquare) {
  let lineNdx = getLineIndexFromSquare(beginColumnSquare);
  let discreteColumn = [beginColumnSquare];

  let nextBottomLineOffset = getMovementOffset(BOT_OFFSET, getPlayerColorNotation());
  let nextBottomLine = lineNdx + nextBottomLineOffset;

  while (nextBottomLine > 0) {
    discreteColumn.push("" + beginColumnSquare[SQUARE_ALPHABETICAL_NDX] + nextBottomLine);
    nextBottomLineOffset += getMovementOffset(BOT_OFFSET, getPlayerColorNotation());
    nextBottomLine = lineNdx + nextBottomLineOffset;
  }
  return discreteColumn;
}
function getPlayerColorNotation() {
  return colorNotation[playerColorStatus];
}
function getOpponentColorNotation() {
  return colorNotation[playerColorStatus ? 0 : 1];
}
function drawIdentityDiagonal() {
  let movPath = getAnyMainDiagonalFromBegin("a8", getPlayerColorNotation());
  colorDiscreteMovementPath(movPath, MOVEMENT_DIRECTION_DIAGONAL);
}
function drawOppositeIdentityDiagonal() {
  let movPath = getAnyOppositeDiagonalFromEnd("h8");
  colorDiscreteMovementPath(movPath, MOVEMENT_DIRECTION_DIAGONAL);
}
function drawIdentityX() {
  let movPath = getAnyMainDiagonalFromBegin("a8", getPlayerColorNotation());
  colorDiscreteMovementPath(movPath, MOVEMENT_DIRECTION_DIAGONAL);
  movPath = getAnyOppositeDiagonalFromEnd("h8");
  colorDiscreteMovementPath(movPath, MOVEMENT_DIRECTION_DIAGONAL);
}
function drawCross(beginLineSquare, beginColumnSquare) {
  let movPath = getLineDiscreteIntervalFromSquare(beginLineSquare);
  colorDiscreteMovementPath(movPath, MOVEMENT_DIRECTION_LINE);
  movPath = getColumnDiscreteIntervalFromSquare(beginColumnSquare);
  colorDiscreteMovementPath(movPath, MOVEMENT_DIRECTION_COLUMN);
}
// Calcular e avaliar se existe algum movimento possivel em qualquer direção desta peça.
function pieceMovementIsPossible() {
  //return scanMovementDirections(pieceObj.getMovement(), pieceObj.getInitialSquare(), pieceObj, SQUARE_SCAN);
  return true;
}
// Calcular todos os movimentos possiveis em todas as direção.
function evaluatePieceMovementRange() {
  return scanMovementDirections(
    pieceObj.getMovement(),
    pieceObj.getInitialSquare(),
    pieceObj,
    FULL_SCAN
  );
}
function isHighlightClass(myClass) {
  return highlightClasses.includes(myClass);
}
// Esta casa encontra-se nas casas já calculadas para movimento?
function isSquareOnMovementRange(squareId) {
  let divSquare = document.querySelector("#" + squareId);
  let classAttr = divSquare.getAttribute("class").split(" ");

  return classAttr.some(isHighlightClass);
}
function teste1() {
  document.getElementById("h3").innerHTML = "BP1";
  document.getElementById("h3").innerHTML = "BP1";
  document.getElementById("h3").innerHTML = "BP1";
  document.getElementById("h3").innerHTML = "BP1";
  document.getElementById("h3").innerHTML = "BP1";
}
// Mover peça de seu local atual para destinationSquare.
function doMovePiece(destinationSquare) {
  // var originSquare = "" + pieceSelected.getPiecePosition(SQUARE_NAME);
  // console.log(pieceSelected);
  var origElem = pieceSelected.getPiecePosition(ELEMENT_SQUARE);
  var destElem = document.getElementById(destinationSquare);
  pieceSelected.hasMoved = HAS_MOVED;
  destElem.setAttribute("piece", JSON.stringify(pieceSelected));
  // // console.debug(origElem);
  origElem.removeAttribute("piece");
  destElem.innerHTML = origElem.innerHTML;
  origElem.innerHTML = "";
}
function doCapturePiece(pieceSquare) {
  document.getElementById(pieceSquare).innerHTML = "";
  capturedPieces[capturedPiecesCtr++] = piece;
  selectEmptySquare(pieceSquare);
  if (capturedPiecesCtr < 1) return -1;
  document.getElementById("pwhite").innerHTML = "White Captures: ";
  document.getElementById("pblack").innerHTML = "Black Captures: ";
  capturedPieces.map(function (piece) {
    if (piece[PIECE_COLOR_INDEX] == colorNotation[COLOR_BLACK])
      document.getElementById("pwhite").innerHTML += " " + piece;
    else document.getElementById("pblack").innerHTML += " " + piece;
  });
}
function playSquareName(squareName) {
  var audio = new Audio();
  audio.src = squareName + ".wav";
  audio.play();
}
function selectSquare(squareName) {
  let squareStatus = getSquareStatus(squareName);

  if (squareStatus != BLANK_SPACE_SQUARE) {
    pieceObj = new Piece(1, 1, 1, 1, getPieceObjFromDiv(squareName));
    pieceObj.setPiecePosition(squareName);
    pieceObj.logPieceObj();
  }
  if (squareStatus == PLAYER_PIECE_SQUARE) {
    return selectPlayerPiece();
  }
  if (
    pieceSelected &&
    matchMovementDirection(getMovementType(pieceSelected), SPECIAL_MOVEMENT_CASTLE)
  ) {
    return;
  }

  if (pieceSelected && isSquareOnMovementRange(squareName)) {
    if (squareStatus == BLANK_SPACE_SQUARE) selectEmptySquare(squareName);
    else if (squareStatus == OPPONENT_PIECE_SQUARE) selectOpponentPiece(squareName);

    setTopBotLeftRightAsWhite(squareName);
    clearActiveSelection();
    pieceObj = 0;
    pieceSelected = 0;
    return;
  }

  return false;
}
function selectEmptySquare(squareId) {
  doMovePiece(squareId);
  pieceSelected = 0;
  clearActiveSelection();

  return;
}
function selectOpponentPiece(pieceSquare) {
  doCapturePiece(pieceSquare);
  setTopBotLeftRightAsWhite(pieceSquare);
  return;
}
function getCastleTypeByRook(pieceRook) {
  let columnIndex = pieceRook.getPieceLocation();
  if (columnArray[columnIndex] == "a") return MOVEMENT_CASTLE_LONG;
  else return MOVEMENT_CASTLE_SHORT;
}
function removePieces(pieceArr) {
  document.getElementById(getPieceLocation(pieceArr)).innerHTML = "";
}
function pieceDidSpecialMove() {
  if (
    matchPieceType(pieceObj.getType(), PIECE_TYPE_ROOK) &&
    matchPieceType(pieceSelected.getType(), PIECE_TYPE_KING)
  ) {
    castleType = getCastleTypeByRook(pieceObj);
  } else if (
    matchPieceType(pieceSelected.getType(), PIECE_TYPE_KING) &&
    matchPieceType(pieceObj.getType(), PIECE_TYPE_ROOK)
  ) {
    castleType = getCastleTypeByRook(pieceSelected);
  } else {
    return false;
  }

  if (castleType == MOVEMENT_CASTLE_SHORT) {
    doMovePiece(getShortCastleKingSquare());
    doMovePiece(getShortCastleRookSquare());
  } else if (castleType == MOVEMENT_CASTLE_LONG) {
    doMovePiece(getLongCastleKingSquare());
    doMovePiece(getLongCastleRookSquare());
  } else {
    return false;
  }

  return true;
}
function selectPlayerPiece() {
  // Se estamos selecionando uma peça, ela precisa estar "solta",
  // ou seja, ter algum movimento possivel.
  if (pieceMovementIsPossible() == false) return;

  // console.log(pieceSelected);
  // console.log(pieceObj.getPiecePosition(SQUARE_NAME));
  if (pieceSelected && isSquareOnMovementRange(pieceObj.getPiecePosition(SQUARE_NAME))) {
    if (pieceDidSpecialMove()) {
      //   clearActiveSelection();
      return;
    }
  }

  clearActiveSelection();
  pieceSelected = pieceObj;
  drawSpecialMovement(pieceObj.getMovement());
  evaluatePieceMovementRange();
  colorMovementPath(pieceObj.getMovement());
}
function clearActiveSelection(keepPieceSelection = false) {
  let removalClasses = [];
  let i = 0;
  highlightClasses.map(function (value) {
    removalClasses[i++] = value;
  });
  removalClasses.map(function (value) {
    document.querySelectorAll("." + value).forEach(function (elem) {
      if (elem != 0 && elem !== undefined && elem != "") elem.classList.remove(value);
    });
  });
  // Checar
  document
    .querySelectorAll("[bgc='" + bgBoardColors[LIGHT_BGCOLOR] + "']")
    .forEach(function (elem) {
      elem.classList.add(bgBoardColors[LIGHT_BGCOLOR]);
    });
  document
    .querySelectorAll("[bgc='" + bgBoardColors[DARK_BGCOLOR] + "']")
    .forEach(function (elem) {
      elem.classList.add(bgBoardColors[DARK_BGCOLOR]);
    });

  if (keepPieceSelection == false) pieceSelected = 0;

  return;
}
function setMainDiagonalAndOpposite(squareName) {
  //       h8
  //  h8 [[md1],[md8],[md9],[md10],[md11],[md13],[md14],[]];
  //  g7 [[md2],[md1],[md8],[md9],[md10],[md11],[md13],[md14]];
  //  f6 [[md3],[md2],[md1],[md8],[md9],[md10],[md11],[md12]];
  //  e5 [[md4],[md3],[md2],[md1],[md8],[md9],[md10],[md11]];
  //  f4 [[md5],[md4],[md3],[md2],[md1],[md8],[md9],[md10]];
  //  c3 [[md6],[md5],[md4],[md3],[md2],[md1],[md8],[md9]];
  //  b2 [[md7],[md6],[md5],[md4],[md3],[md2],[md1],[md8]];
  //  a1 [[],[md7],[md6],[md5],[md4],[md3],[md2],[md1]];
  // [[],[],[],[],[],[],[],[mo15]];
  // [[],[],[],[],[],[],[mo15],[mo16]];
  // [[],[],[],[],[],[mo15],[mo16],[]];
  // [[],[],[],[],[mo15],[],[],[]];
  // [[],[],[],[mo15],[],[],[],[]];
  // [[],[],[mo15],[],[],[],[],[]];
  // [[],[mo15],[],[],[],[],[],[]];
  // [[mo15],[],[],[],[],[],[],[]];
}

function deleteBoard() {
  $(".pieceSquare").remove();
}
function drawBoard() {
  let board = document.querySelector(".board");
  let style = getComputedStyle(board);
  let myWidth = style.width.split("p")[0]; // gets size before 'px' literal
  let myHeight = style.height.split("p")[0]; // gets size before 'px' literal
  let iSquareWidth = myWidth / 8;
  let iSquareHeight = myHeight / 8;
  let sqMarginLeft = 0;
  let sqMarginTop = 0;
  let rowNumber = 0;
  let columnChar = "a";
  let rowColorToggle = true;
  for (let i = 0; i < LINE_SQUARE_COUNT; i++) {
    for (let j = 0; j < COLUMN_SQUARE_ROW; j++) {
      var squareColorSeq = DARK_BGCOLOR;
      if (j % 2 != rowColorToggle) {
        squareColorSeq = LIGHT_BGCOLOR;
      }

      var divSquare = document.createElement("div");
      divSquare.classList.add(bgBoardColors[squareColorSeq]);
      divSquare.setAttribute("bgc", bgBoardColors[squareColorSeq]);
      divSquare.style.width = iSquareWidth;
      divSquare.style.height = iSquareHeight;
      divSquare.style.position = "absolute";
      divSquare.style.marginLeft = sqMarginLeft;
      divSquare.style.marginTop = sqMarginTop;
      divSquare.classList.add("pieceSquare");

      if (colorName[playerColorStatus] == "white") {
        rowNumber = LINE_SQUARE_COUNT - i;
        columnChar = columnArray[j];
      } else {
        rowNumber = i + 1;
        columnChar = columnArray[COLUMN_SQUARE_ROW - j - 1];
      }

      divSquare.id = "" + columnChar + rowNumber;

      board.appendChild(divSquare);
      divSquare = document.getElementById(divSquare.id);
      if (initialRows.includes(rowNumber) == true) {
        drawSinglePiece(divSquare.id);
      }
      //                                                 sq
      divSquare.setAttribute("onclick", "selectSquare(this.id)");
      divSquare.setAttribute("clm", divSquare.id[0]);
      divSquare.setAttribute("lndx", divSquare.id[1]);
      if (
        divSquare.id == "a1" ||
        divSquare.id == "a8" ||
        divSquare.id == "h1" ||
        divSquare.id == "h8"
      ) {
        document.getElementById(divSquare.id).setAttribute("crn", "1");
      }
      setTopBotLeftRightAsWhite(divSquare.id);
      setMainDiagonalAndOpposite(divSquare.id);

      sqMarginLeft += iSquareWidth;
    }
    sqMarginTop += iSquareHeight;
    sqMarginLeft = 0;
    rowColorToggle = !rowColorToggle;
  }
}
// function setTopBotLeftRightAsWhite{

// }

function setTopBotLeftRightAsWhite(squareName) {
  let taWct = Number(squareName[SQUARE_NUMERIC_NDX]) + 1;
  let baWct = squareName[SQUARE_NUMERIC_NDX] - 1;
  let laWct = columnArray.indexOf(squareName[SQUARE_ALPHABETICAL_NDX]) - 1;
  let raWct = columnArray.indexOf(squareName[SQUARE_ALPHABETICAL_NDX]) + 1;
  let myColumn = squareName[SQUARE_ALPHABETICAL_NDX];
  let myLineIndex = squareName[SQUARE_NUMERIC_NDX];
  let taw = "";
  let baw = "";
  let law = "";
  let raw = "";

  while (taWct < LINE_SQUARE_COUNT) {
    taw += myColumn + "" + taWct++ + "|";
    document.getElementById(squareName).setAttribute("taw", taw);
  }
  while (baWct >= 1) {
    baw += myColumn + "" + baWct-- + "|";
    document.getElementById(squareName).setAttribute("baw", baw);
  }
  while (laWct >= 0) {
    law += columnArray[laWct--] + "" + myLineIndex + "|";
    document.getElementById(squareName).setAttribute("law", law);
  }
  while (raWct <= 7) {
    raw = columnArray[raWct++] + "" + myLineIndex + "|";
    document.getElementById(squareName).setAttribute("raw", raw);
  }
  // document.querySelectorAll("[]","[]")

  // // Diagonais
  // taWct =  (Number(squareName[SQUARE_NUMERIC_NDX])+1);
  // laWct =  columnArray.indexOf(squareName[SQUARE_ALPHABETICAL_NDX]) - 1;
  // baWct =  (squareName[SQUARE_NUMERIC_NDX]-1);
  // raWct =  columnArray.indexOf(squareName[SQUARE_ALPHABETICAL_NDX]) + 1;
  // myColumn = squareName[SQUARE_ALPHABETICAL_NDX];
  // myLineIndex = squareName[SQUARE_NUMERIC_NDX];
  // let botRightDiag;
  // let topRightDiag;
  // let topLeftDiag;
  // let botLeftDiag;
  // do{
  //     if ( !isNaN(myColumn - laWct) ){
  //         while (){
  //             topLeftDiag = myColumn - laWct;
  //             topLeftDiag = columnArray[(myColumn - laWct)] + topLeftDiag
  //         }
  //     }
  //     if ( !isNaN(myColumn + raWct) ){
  //         topRightDiag = myColumn + raWct;
  //         topRightDiag = columnArray[(myColumn + raWct)] + topRightDiag;
  //     }
  //     if ( !isNaN(myColumn - baWct) ){
  //         botLeftDiag = myColumn - baWct;
  //         botLeftDiag = columnArray[(myColumn - baWct)] + botLeftDiag;
  //     }
  //     if ( !isNaN(myColumn + raWct) ){
  //         botRightDiag = myColumn + raWct;
  //         botRightDiag = columnArray[(myColumn + raWct)] + botRightDiag;
  //     }
  // }while(TRUE);

  // alert(topLeftDiag + " " + topRightDiag+" "+botLeftDiag + " " + botRightDiag)
  // let  botRightDiag = myColumn + raWct;
  // botRightDiag = columnArray[(myColumn - raWct)] + topRightDiag;
}

// Usar para resgatar JSons STRINGFADOS na div
// corrigir tmpColro
function getPieceObjFromDiv(squareName) {
  var squareContent = document.getElementById(squareName);
  var myPiece = document.getElementById(squareName).getAttribute("piece");

  console.log(myPiece);
  if (squareContent === undefined || myPiece == null || myPiece == 0) return null;

  var movement = new Object(
    JSON.parse(document.getElementById(squareName).getAttribute("piece")).movement
  );
  var objpawn = new Object(JSON.parse(myPiece));
  objpawn.elmcurrentsq = squareContent;
  objpawn.movement = new Movement(1, movement);

  return objpawn;
}

function drawSinglePiece(squareName) {
  for (i = 0; i < columnArray.length; i++) {
    squareName = squareName.toString();
    if (squareName.includes(columnArray[i])) {
      let pieceColor = colorNotation[COLOR_BLACK];
      if (
        getLineIndexFromSquare(squareName) == getWhiteFirstRow() ||
        getLineIndexFromSquare(squareName) == getWhiteSecondRow()
      )
        pieceColor = colorNotation[COLOR_WHITE];

      let pieceName = "" + pieceColor + highValuePieceNotation[i];
      if (
        getLineIndexFromSquare(squareName) == getBlackSecondRow() ||
        getLineIndexFromSquare(squareName) == getWhiteSecondRow()
      ) {
        pieceName = "" + pieceColor + lowValuePieceNotation[i];
      }
      let myPieceType = getPieceTypeFromPiece(pieceName);
      let movement = new Movement(myPieceType);
      let myPiece = new Piece(myPieceType, squareName, movement, pieceColor);
      document.getElementById(squareName).setAttribute("piece", JSON.stringify(myPiece));

      //"<img src='" + imgpath + pieceName.substring(0,2) + ".png' style='pieceimg'>"
      return pieceColor == "W" ? COLOR_WHITE : COLOR_BLACK;
    }
  }
  return COLOR_NONE;
}

function removeMyPieces() {
  let piece1 = ["WN1", "WB1", "WQ", "WB2", "WN2"];
  let piece2 = ["WPa", "WPb", "WPc", "WPd", "WPe", "WPf", "WPg", "WPh"];
  piece1 = piece1.concat(piece2);
  piece1.map(function (mypiece) {
    removePieces(mypiece);
  });
}
//
// main
//
function highlightLine(lineIndex) {
  document.querySelectorAll("div[lndx='" + lineIndex + "']").forEach(function (elem) {
    let bgc = elem.getAttribute("bgc");
    setClassByBGAttr("silverbuenao", bgc, elem.id);
  });
}
function highlightColumn(columnLetter) {
  document.querySelectorAll("div[clm='" + columnLetter + "']").forEach(function (elem) {
    let bgc = elem.getAttribute("bgc");
    setClassByBGAttr("goldenrod", bgc, elem.id);
  });
}
function highlightColumnSquare(elem, myClassName) {
  let bgcAttr = elem.getAttribute("bgc");

  setClassByBGAttr(myClassName, bgcAttr, elem.id);
  if (elem.classList.contains(bgcAttr)) {
    elem.setAttribute("bgc", bgcAttr);
    elem.classList.remove(bgcAttr);
  }
}
function highlightSquare(elem, myClassName) {
  let bgcAttr = elem.getAttribute("bgc");

  setClassByBGAttr(myClassName, bgcAttr, elem.id);
  if (elem.classList.contains(bgcAttr)) {
    elem.setAttribute("bgc", bgcAttr);
    elem.classList.remove(bgcAttr);
  }
}

function highlightLineSquare(elem, myClassName) {
  let bgc = elem.getAttribute("bgc");
  setClassByBGAttr(myClassName, bgc, elem.id);
}
function highlightColumnArray(columnsToHighlight) {
  columnsToHighlight.map(function (value) {
    highlightColumn(value.id[SQUARE_ALPHABETICAL_NDX]);
  });
}
function highlightLineArray(linesToHighlight) {
  linesToHighlight.map(function (value) {
    highlightLine(value);
  });
}
function DOMRegex(regex) {
  let output = [];
  for (let i of document.querySelectorAll("*")) {
    if (regex.test(i.type)) {
      // or whatever attribute you want to search
      output.push(i);
    }
  }
  return output;
}

$(document).ready(function () {
  // var audio = new Audio();
  // audio.src ='e2.wav';
  // audio.play();
  initPieceMovements();
  drawBoard();

  // alert(elem);
  // alert(myClassName);
  // alert(e);
  // if ( elem === undefined || elem == 0|| elem == "" )
  //     return ;

  // if ( e == null )
  //     return;
  // else{
  //     setClassByBGAttr(myClassName, elem.getAttribute("bgc"), elem.id);
  //     return;
  // }
  // let docElem = document.getElementById('h8');
  // document.addEventListener('keydown', (event) => highlightColumnSquare(docElem, columnClass, event));
  //var d4 = document.getElementById('d4').getBoundingClientRect();
  //var d5 = document.getElementById('d5').getBoundingClientRect();
  //var board = document.querySelector('.board').getBoundingClientRect();
  //console.log(d4.left, d5.left, board.top);

  // alert(pieceSelected.document.elementsFromPoint(pieceSelected., y + py))
  // console.debug(document.elementsFromPoint((d4.left+160), d4.top));
  //pieceSelected.classList.add('rotate45deg');
  // let columnClass = getClassNameFromMovementDirection(MOVEMENT_DIRECTION_COLUMN);
  var d4 = document.getElementById("d4").getBoundingClientRect();
  // console.debug(d4.right);
  // // let myP = createElement;
  var d5 = document.getElementById("d5").getBoundingClientRect();
  var board = document.querySelector(".board").getBoundingClientRect();
  console.log("" + d4.left + " +" + d5.left + " " + board.right);
  document.elementsFromPoint(d4.left, d5.left + 10);

  // highlightLineArray(['1','2','3','4'])
  // highlightColumnArray(['a','b','c','d']);
  // columnArray.map(function(value){
  //     highlightColumn(value);
  // });
  // teste1()
  // removeMyPieces();

  // setInterval(function(){
  //     $(".miniretinea").stop(true,true).animate({top: 160}, 5000,
  //         function(){ $(this).stop(true,true).animate({top: 10}, 1000);
  //     });
  // }, 20000);
});
