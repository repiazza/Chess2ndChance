"use strict";

// import * as sample_1 from './module_1.js';
// console.log(sample_1.hello());
// console.log(`${sample_1.increment()} ${sample_1.hello()}`);
// export function firstName () {
//    return "Emmanuel"
// }
// export function lastName () {
//    return "John"
// }
// export default function count () { return count; }
// import count from './module_2'
// import count, { firstName, lastName } from './module_2'
//  import { default as simple, hello, increment        
//  } from './module_1.js';
//  console.log(hello());
//  console.log(increment());
//  import { default as simple, hello, increment        
//  } from './module_1.js';
// let gameBoard = [[],[],[],[],[],[],[],[]];
var TOTAL_PIECE_COUNT = 16;
var PLAYER_PIECE_COUNT = TOTAL_PIECE_COUNT / 2;
var LINE_SQUARE_COUNT = 8;
var COLUMN_SQUARE_ROW = 8;
var highlightClasses = ["linemovhl", "columnmovhl", "diagonalmovhl", "knightmovhl", "linemovhldark", "columnmovhldark", "diagonalmovhldark", "knightmovhldark", "capturehl", "capturehldark"];
var captureClasses = ["capturehl", "capturehldark"];
var opponentSquareArr = [];
var emptySquareArr = [];
var capturedPieces = [];
var capturedPiecesCtr = 0;
var TOP_OFFSET = 1;
var BOT_OFFSET = 2;
var LFT_OFFSET = 3;
var RGT_OFFSET = 4;
var COLOR_NONE = -1;
var COLOR_WHITE = 0;
var COLOR_BLACK = 1;
var SQUARE_SCAN = 1;
var FULL_SCAN = 2;
var MOVEMENT_RANGE_BEGIN_SQUARE = 0;
var MOVEMENT_RANGE_END_SQUARE = 1;
var SQUARE_ALPHABETICAL_NDX = 0;
var SQUARE_NUMERIC_NDX = 1;
var PIECE_COLOR_INDEX = 0; // B or W

var PIECE_NOTATION_INDEX = 1; // R N B Q K or P

var PIECE_COMPLEMENT_IDENTIFIER_INDEX = 2; // Column or Sequence 

var MOVEMENT_DIRECTION_COLUMN = 0x01;
var MOVEMENT_DIRECTION_LINE = 0x02;
var MOVEMENT_DIRECTION_DIAGONAL = 0x04;
var MOVEMENT_DIRECTION_L = 0x08;
var SUBTYPE_DIAG_MAIN_BEGIN = 0x10;
var SUBTYPE_DIAG_MAIN_END = 0x20;
var SUBTYPE_DIAG_OPPOSITE_BEGIN = 0x40;
var SUBTYPE_DIAG_OPPOSITE_END = 0x80;
var SUBTYPE_COLUMN_TOP = 1024;
var SUBTYPE_COLUMN_BOTTOM = 2048;
var SUBTYPE_LINE_LEFT = 4096;
var SUBTYPE_LINE_RIGHT = 8192;
var MAIN_DIAGONAL = SUBTYPE_DIAG_MAIN_BEGIN | SUBTYPE_DIAG_MAIN_END;
var OPPOSITE_DIAGONAL = SUBTYPE_DIAG_OPPOSITE_BEGIN | SUBTYPE_DIAG_OPPOSITE_END;
var DIAGONAL_FOUR_SQUARE = MAIN_DIAGONAL | OPPOSITE_DIAGONAL;
var MOVEMENT_DIRECTION_ALL = MOVEMENT_DIRECTION_COLUMN | MOVEMENT_DIRECTION_LINE | MOVEMENT_DIRECTION_DIAGONAL | MOVEMENT_DIRECTION_L;
var SUBTYPE_DIAG_ALL = SUBTYPE_DIAG_MAIN_BEGIN | SUBTYPE_DIAG_MAIN_END | SUBTYPE_DIAG_OPPOSITE_BEGIN | SUBTYPE_DIAG_OPPOSITE_END; // LINE COLUMN CROSS

var SUBTYPE_COLUMN_ALL = SUBTYPE_COLUMN_TOP | SUBTYPE_COLUMN_BOTTOM;
var SUBTYPE_LINE_ALL = SUBTYPE_LINE_LEFT | SUBTYPE_LINE_RIGHT;
var SUBTYPE_ALL = SUBTYPE_COLUMN_ALL | SUBTYPE_LINE_ALL | SUBTYPE_DIAG_ALL;
var MOVEMENT_TYPE_ALL = MOVEMENT_DIRECTION_ALL | SUBTYPE_ALL;
var SQUARE_RANGE = 1;
var DOUBLE_SQUARE_RANGE = 2;
var L_RANGE = 4;
var LINE_OF_SIGHT = 8;
var PIECE_TYPE_ROOK = 'R';
var PIECE_TYPE_KNIGHT = 'N';
var PIECE_TYPE_BISHOP = 'B';
var PIECE_TYPE_QUEEN = 'Q';
var PIECE_TYPE_KING = 'K';
var PIECE_TYPE_PAWN = 'P';
var PIECE_COLOR_WHITE = 'W';
var PIECE_COLOR_BLACK = 'B';
var INVALID_SQUARE = -1; // Casa fora do 8x8 ou semelhante

var BLANK_SPACE_SQUARE = 0;
var PLAYER_PIECE_SQUARE = 1;
var OPPONENT_PIECE_SQUARE = 2;
var UNKNOWN_SQUARE = 3; // Casa em formato desconhecido

var pieceSelected = 0;
var playerColorStatus = 0;
var colorName = ['white', 'black'];
var colorNotation = ['W', 'B'];
var columnArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
var initialRows = [1, 2, 7, 8]; //                             0    1    2    3   4   5    6    7

var highValuePieceNotation = ['R1', 'N1', 'B1', 'Q', 'K', 'B2', 'N2', 'R2'];
var lowValuePieceNotation = ['Pa', 'Pb', 'Pc', 'Pd', 'Pe', 'Pf', 'Pg', 'Ph'];
var pieceType = ['R', 'N', 'B', 'Q', 'K', 'P']; //                        R N B Q K P

var pieceMovementType = [0, 0, 0, 0, 0, 0]; //                        R N B Q K P

var pieceMovementRange = [0, 0, 0, 0, 0, 0];
var mainDiagonalRange = [];
var oppositeDiagonalRange = [];
var columnMovementRange = [];
var lineMovementRange = [];
var diagonalMovementRange = [];
var LMovementSquares = [];
var captureSquares = [];
var captureSquareCtr = 0;

function getLineIndexFromPiece(piece) {
  return getPieceLocation(piece)[SQUARE_NUMERIC_NDX];
}

function getLineIndexFromSquare(squareName) {
  if (!isValidSquareIndex(squareName)) return INVALID_SQUARE;
  return Number(squareName[SQUARE_NUMERIC_NDX]);
}

function getColumnIndexFromSquare(squareName) {
  if (!isValidSquareIndex(squareName)) return INVALID_SQUARE;
  return columnArray.indexOf(squareName[SQUARE_ALPHABETICAL_NDX]);
}

function getAnyMainDiagonalFromBegin(beginSquareName, color) {
  var myColumnIndex = getColumnIndexFromSquare(beginSquareName);
  var myLineIndex = getLineIndexFromSquare(beginSquareName);
  var mainDiagonal = [beginSquareName];
  if (myLineIndex == -1) return -1;
  var nextRightColumnOffset = getMovementOffset(RGT_OFFSET, color);
  var nextBottomLineOffset = getMovementOffset(BOT_OFFSET, color);
  var nextBottomLine = myLineIndex + nextBottomLineOffset;
  var nextRightColumn = myColumnIndex + nextRightColumnOffset;
  var nextBottomRightSquareName = columnArray[nextRightColumn] !== undefined ? columnArray[nextRightColumn] + nextBottomLine : -1; // alert(myColumnIndex);
  // alert(myLineIndex);
  // alert(nextRightColumn);
  // alert(nextBottomLine);

  alert(nextBottomRightSquareName);

  while (nextBottomRightSquareName != -1) {
    mainDiagonal.push(nextBottomRightSquareName);
    nextRightColumnOffset = nextRightColumnOffset + getMovementOffset(RGT_OFFSET, color);
    nextBottomLineOffset = nextBottomLineOffset + getMovementOffset(BOT_OFFSET, color);
    nextBottomLine = myLineIndex + nextBottomLineOffset;
    nextRightColumn = myColumnIndex + nextRightColumnOffset;
    nextBottomRightSquareName = columnArray[nextRightColumn] !== undefined ? columnArray[nextRightColumn] + nextBottomLine : -1;
  }

  return mainDiagonal;
}

function getAnyMainDiagonalFromEnd() {} // function getAnyOppositeDiagonalFromBegin();
// function getAnyOppositeDiagonalFromEnd();


function togglePlayerColor() {
  playerColorStatus = playerColorStatus ? 0 : 1;
}

function togglePlayerColorAndRedrawBoard() {
  if (!confirm('ATENÇÃO! Inverter as cores? (todo progresso será perdido)')) return;
  playerColorStatus = playerColorStatus ? 0 : 1;
  redrawBoard();
}

function redrawBoard() {
  deleteBoard();
  drawBoard();
} // const MOVEMENT_DIRECTION_COLUMN   = 0x01;
// const MOVEMENT_DIRECTION_LINE     = 0x02;
// const MOVEMENT_DIRECTION_DIAGONAL = 0x04;
// const MOVEMENT_DIRECTION_L        = 0x08;


function initPieceMovements() {
  for (i = 0; i < pieceType.length; i++) {
    switch (pieceType[i]) {
      case PIECE_TYPE_ROOK:
        pieceMovementType[i] |= MOVEMENT_DIRECTION_COLUMN;
        pieceMovementType[i] |= SUBTYPE_COLUMN_TOP;
        pieceMovementType[i] |= SUBTYPE_COLUMN_BOTTOM;
        pieceMovementType[i] |= MOVEMENT_DIRECTION_LINE;
        pieceMovementType[i] |= SUBTYPE_LINE_LEFT;
        pieceMovementType[i] |= SUBTYPE_LINE_RIGHT;
        pieceMovementRange[i] = LINE_OF_SIGHT;
        break;

      case PIECE_TYPE_KNIGHT:
        pieceMovementType[i] |= MOVEMENT_DIRECTION_L;
        pieceMovementRange[i] = L_RANGE; // 2 movements 4way expressed

        break;

      case PIECE_TYPE_BISHOP:
        pieceMovementType[i] |= MOVEMENT_DIRECTION_DIAGONAL;
        pieceMovementType[i] |= SUBTYPE_DIAG_MAIN_BEGIN | SUBTYPE_DIAG_MAIN_END;
        pieceMovementType[i] |= SUBTYPE_DIAG_OPPOSITE_BEGIN | SUBTYPE_DIAG_OPPOSITE_END;
        pieceMovementRange[i] = LINE_OF_SIGHT;
        break;

      case PIECE_TYPE_QUEEN:
        pieceMovementType[i] |= MOVEMENT_DIRECTION_COLUMN;
        pieceMovementType[i] |= SUBTYPE_COLUMN_TOP;
        pieceMovementType[i] |= SUBTYPE_COLUMN_BOTTOM;
        pieceMovementType[i] |= MOVEMENT_DIRECTION_LINE;
        pieceMovementType[i] |= SUBTYPE_LINE_LEFT;
        pieceMovementType[i] |= SUBTYPE_LINE_RIGHT;
        pieceMovementType[i] |= MOVEMENT_DIRECTION_DIAGONAL;
        pieceMovementType[i] |= SUBTYPE_DIAG_MAIN_BEGIN | SUBTYPE_DIAG_MAIN_END;
        pieceMovementType[i] |= SUBTYPE_DIAG_OPPOSITE_BEGIN | SUBTYPE_DIAG_OPPOSITE_END;
        pieceMovementRange[i] = LINE_OF_SIGHT;
        break;

      case PIECE_TYPE_KING:
        pieceMovementType[i] |= MOVEMENT_DIRECTION_COLUMN;
        pieceMovementType[i] |= SUBTYPE_COLUMN_TOP;
        pieceMovementType[i] |= SUBTYPE_COLUMN_BOTTOM;
        pieceMovementType[i] |= MOVEMENT_DIRECTION_LINE;
        pieceMovementType[i] |= SUBTYPE_LINE_LEFT;
        pieceMovementType[i] |= SUBTYPE_LINE_RIGHT;
        pieceMovementType[i] |= MOVEMENT_DIRECTION_DIAGONAL;
        pieceMovementType[i] |= SUBTYPE_DIAG_MAIN_BEGIN | SUBTYPE_DIAG_MAIN_END;
        pieceMovementType[i] |= SUBTYPE_DIAG_OPPOSITE_BEGIN | SUBTYPE_DIAG_OPPOSITE_END;
        pieceMovementRange[i] = SQUARE_RANGE;
        break;

      case PIECE_TYPE_PAWN:
        pieceMovementType[i] |= MOVEMENT_DIRECTION_COLUMN;
        pieceMovementType[i] |= SUBTYPE_COLUMN_TOP;
        pieceMovementType[i] |= SUBTYPE_COLUMN_BOTTOM;
        pieceMovementType[i] |= MOVEMENT_DIRECTION_DIAGONAL;
        pieceMovementRange[i] = SQUARE_RANGE;
        break;
    }
  }
}

function isValidSquareIndex(squareName) {
  var squareIndex = Number(squareName[SQUARE_NUMERIC_NDX]);
  if (squareIndex < 1 || squareIndex > 8 || isNaN(squareIndex)) return false;
  return true;
}

function getSquareGroupStatus(squares) {
  squares.map(function (value) {
    if (isValidSquareIndex(value)) {
      if (getSquareStatus(value) == BLANK_SPACE_SQUARE) emptySquareArr.push(value);else if (getSquareStatus(value) == OPPONENT_PIECE_SQUARE) opponentSquareArr.push(value);
    }
  });
}

function getSquareStatus(squareName) {
  if (squareName == INVALID_SQUARE) return INVALID_SQUARE;
  if (isValidSquareIndex(squareName) == false) return INVALID_SQUARE;
  var mySquareContent = document.getElementById(squareName).innerHTML;
  if (mySquareContent == "") return BLANK_SPACE_SQUARE; // Tem uma peça nessa casa..

  if (mySquareContent[0] == colorNotation[playerColorStatus]) return PLAYER_PIECE_SQUARE;else if (mySquareContent[0] == colorNotation[playerColorStatus ? 0 : 1]) return OPPONENT_PIECE_SQUARE;
  return UNKNOWN_SQUARE;
}

function hasBlankSpace(squareName) {
  if (squareName == -1) return false;
  if (isValidSquareIndex(squareName) == false) return false;
  return document.getElementById(squareName).innerHTML == "" ? true : false;
}

function setColorByBGAttr(className, bgcAttr, squareId) {
  if (bgcAttr.includes('dark')) {
    className += 'dark';
  }

  document.getElementById(squareId).classList.add(className);
}

function colorDiscreteMovementPath(movementDiscreteArray) {
  movementDiscreteArray.map(function (squareId) {
    var bgcAttr = setBGColorAsDOMAttributeAndRemove(squareId);
    setColorByBGAttr("orangehl", bgcAttr, squareId);
  });
}

function colorMovementPath(movementType) {
  if (matchMovementDirection(movementType, MOVEMENT_DIRECTION_LINE)) {
    var lineNdx = lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_NUMERIC_NDX];
    var originColumn = columnArray.indexOf(lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]);
    var destColumn = columnArray.indexOf(lineMovementRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]);
    var comparisonColumn = pieceSelected[0] == colorNotation[COLOR_WHITE] ? originColumn <= destColumn : originColumn >= destColumn;
    var columnInterval = comparisonColumn ? columnArray.slice(originColumn, destColumn + 1) : columnArray.slice(destColumn, originColumn + 1);
    columnInterval.map(function (value) {
      var squareId = "" + value + lineNdx;
      var bgcAttr = setBGColorAsDOMAttributeAndRemove(squareId);
      setColorByBGAttr("linemovhl", bgcAttr, squareId);
    });
  }

  if (matchMovementDirection(movementType, MOVEMENT_DIRECTION_COLUMN)) {
    var columnChar = columnMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX];
    var lineNdx0 = Number(columnMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_NUMERIC_NDX]);
    var lineNdx1 = Number(columnMovementRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_NUMERIC_NDX]);

    var _i = lineNdx0 < lineNdx1 ? lineNdx0 : lineNdx1;

    var greaterLineVal = lineNdx0 < lineNdx1 ? lineNdx1 : lineNdx0;

    for (; _i <= greaterLineVal; _i++) {
      var squareId = "" + columnChar + _i;
      var bgcAttr = setBGColorAsDOMAttributeAndRemove(squareId);
      setColorByBGAttr("columnmovhl", bgcAttr, squareId);
    }
  }

  if (matchMovementDirection(movementType, MOVEMENT_DIRECTION_DIAGONAL)) {
    var mainDiagLineNdx = mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_NUMERIC_NDX];
    var oppositeDiagLineNdx = oppositeDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_NUMERIC_NDX];

    if (matchMovementDirection(getMovementType(pieceSelected), SUBTYPE_DIAG_MAIN_BEGIN)) {
      var _originColumn = columnArray.indexOf(mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]);

      var myColumn = columnArray.indexOf(getPieceLocation(pieceSelected)[SQUARE_ALPHABETICAL_NDX]);

      var _comparisonColumn = pieceSelected[PIECE_COLOR_INDEX] == colorNotation[COLOR_WHITE] ? _originColumn <= myColumn : _originColumn >= myColumn;

      var subTypeMainBeginInterval = _comparisonColumn ? columnArray.slice(_originColumn, myColumn + 1) : columnArray.slice(myColumn, _originColumn + 1);
      subTypeMainBeginInterval.map(function (value) {
        var squareId = "" + value + mainDiagLineNdx;
        var bgcAttr = setBGColorAsDOMAttributeAndRemove(squareId);
        setColorByBGAttr("diagonalmovhl", bgcAttr, squareId);
        mainDiagLineNdx--;
      });
    }

    mainDiagLineNdx++;

    if (matchMovementDirection(getMovementType(pieceSelected), SUBTYPE_DIAG_MAIN_END)) {
      var _originColumn2 = columnArray.indexOf(mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]);

      var _myColumn = columnArray.indexOf(getPieceLocation(pieceSelected)[SQUARE_ALPHABETICAL_NDX]);

      var _comparisonColumn2 = pieceSelected[PIECE_COLOR_INDEX] == colorNotation[COLOR_WHITE] ? _originColumn2 <= _myColumn : _originColumn2 >= _myColumn;

      var subTypeMainEndInterval = _comparisonColumn2 ? columnArray.slice(_originColumn2, _myColumn + 1) : columnArray.slice(_myColumn, _originColumn2 + 1);
      subTypeMainEndInterval.map(function (value) {
        var squareId = "" + value + mainDiagLineNdx;
        var bgcAttr = setBGColorAsDOMAttributeAndRemove(squareId);
        setColorByBGAttr("diagonalmovhl", bgcAttr, squareId);
        mainDiagLineNdx--;
      });
    }

    if (matchMovementDirection(getMovementType(pieceSelected), SUBTYPE_DIAG_OPPOSITE_BEGIN)) {
      var _originColumn3 = columnArray.indexOf(oppositeDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]);

      var _myColumn2 = columnArray.indexOf(getPieceLocation(pieceSelected)[SQUARE_ALPHABETICAL_NDX]);

      var _comparisonColumn3 = pieceSelected[PIECE_COLOR_INDEX] == colorNotation[COLOR_WHITE] ? _originColumn3 <= _myColumn2 : _originColumn3 >= _myColumn2;

      var subTypeOppositeBeginInterval = _comparisonColumn3 ? columnArray.slice(_originColumn3, _myColumn2 + 1) : columnArray.slice(_myColumn2, _originColumn3 + 1);
      subTypeOppositeBeginInterval.map(function (value) {
        var squareId = "" + value + oppositeDiagLineNdx;
        var bgcAttr = setBGColorAsDOMAttributeAndRemove(squareId);
        setColorByBGAttr("diagonalmovhl", bgcAttr, squareId);
        oppositeDiagLineNdx++;
      });
    }

    oppositeDiagLineNdx--;

    if (matchMovementDirection(getMovementType(pieceSelected), SUBTYPE_DIAG_OPPOSITE_END)) {
      var _originColumn4 = columnArray.indexOf(oppositeDiagonalRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]);

      var _myColumn3 = columnArray.indexOf(getPieceLocation(pieceSelected)[SQUARE_ALPHABETICAL_NDX]);

      var _comparisonColumn4 = pieceSelected[PIECE_COLOR_INDEX] == colorNotation[COLOR_WHITE] ? _originColumn4 <= _myColumn3 : _originColumn4 >= _myColumn3;

      var subTypeOppositeEndInterval = _comparisonColumn4 ? columnArray.slice(_originColumn4, _myColumn3 + 1) : columnArray.slice(_myColumn3, _originColumn4 + 1);
      subTypeOppositeEndInterval.map(function (value) {
        var squareId = "" + value + oppositeDiagLineNdx;
        var bgcAttr = setBGColorAsDOMAttributeAndRemove(squareId);
        setColorByBGAttr("diagonalmovhl", bgcAttr, squareId);
        oppositeDiagLineNdx++;
      }); // 
      // let originColumn = columnArray.indexOf(mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]);
      // let destColumn = columnArray.indexOf(mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]);
      // let comparisonColumn = (pieceSelected[0] == colorNotation[COLOR_WHITE]) ? 
      //                         (originColumn <= destColumn) :
      //                         (originColumn >= destColumn);
      // // alert(pieceSelected[0])
      // let mainDiagColumnInterval = ( comparisonColumn ) ? 
      //     columnArray.slice(originColumn, destColumn+1) :
      //     columnArray.slice(destColumn, originColumn+1) ;
      // let mainDiagLineNdx = mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_NUMERIC_NDX];
      // // alert(mainDiagColumnInterval);
      // mainDiagColumnInterval.map(function(value){
      //     let squareId = "" + value + mainDiagLineNdx;
      //     let bgcAttr = setBGColorAsDOMAttributeAndRemove(squareId);
      //     setColorByBGAttr("diagonalmovhl", bgcAttr, squareId);
      //     mainDiagLineNdx--;
      // });
      // originColumn = columnArray.indexOf(oppositeDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]);
      // destColumn = columnArray.indexOf(oppositeDiagonalRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]);
      // // alert(oppositeDiagonalRange)
      // let oppositeDiagColumnInterval = ( comparisonColumn ) ? 
      //                        columnArray.slice(originColumn, destColumn+1) :
      //                        columnArray.slice(destColumn, originColumn+1) ;
      // let oppositeDiagLineNdx = oppositeDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_NUMERIC_NDX];
      // oppositeDiagColumnInterval.map(function(value){
      //     let squareId = "" + value + oppositeDiagLineNdx;
      //     let bgcAttr = setBGColorAsDOMAttributeAndRemove(squareId);
      //     setColorByBGAttr("diagonalmovhl", bgcAttr, squareId);
      //     oppositeDiagLineNdx++;
      // });
    }
  }

  if (matchMovementDirection(movementType, MOVEMENT_DIRECTION_L)) {
    LMovementSquares.map(function (squareId) {
      if (isValidSquareIndex(squareId)) {
        setBGColorAsDOMAttributeAndRemove(squareId);

        var _bgcAttr = setBGColorAsDOMAttributeAndRemove(squareId);

        setColorByBGAttr("knightmovhl", _bgcAttr, squareId);
      }
    });
  }

  if (captureSquareCtr > 0) {
    // alert(captureSquares);
    captureSquares.map(function (squareId) {
      if (isValidSquareIndex(squareId)) {
        // alert(squareId)
        var _bgcAttr2 = setBGColorAsDOMAttributeAndRemove(squareId);

        setColorByBGAttr("capturehl", _bgcAttr2, squareId);
      }
    });
  }
}

function setBGColorAsDOMAttributeAndRemove(elemId) {
  var myClassName = "darksquarecolor";
  var myElem = document.getElementById(elemId);
  if (!myElem.classList.contains(myClassName)) myClassName = "lightsquarecolor";

  if (myElem.classList.contains(myClassName)) {
    myElem.setAttribute("bgc", myClassName);
    myElem.classList.remove(myClassName);
  }

  return myClassName;
} // Peça estimou todo movimento possivel, baseado em seu alcance?


function hasFullFilledRange(movementType, pieceRange) {
  var myRange = 0;
  if (pieceRange == SQUARE_RANGE) myRange = SQUARE_RANGE;else if (pieceRange == DOUBLE_SQUARE_RANGE) myRange = DOUBLE_SQUARE_RANGE;else if (pieceRange == LINE_OF_SIGHT) myRange = LINE_OF_SIGHT; // 8
  // alert(myRange)

  if (movementType & MOVEMENT_DIRECTION_COLUMN) {
    // alert(columnMovementRange + " " + myRange);
    var lineNdx0 = Number(columnMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_NUMERIC_NDX]);
    var lineNdx1 = Number(columnMovementRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_NUMERIC_NDX]);
    return Math.abs(lineNdx0 - lineNdx1) >= Number(myRange) ? true : false;
  }

  if (movementType & MOVEMENT_DIRECTION_LINE) {
    var originColumn = columnArray.indexOf(lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]);
    var destColumn = columnArray.indexOf(lineMovementRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]);
    var comparisonColumn = pieceSelected[0] == colorNotation[COLOR_WHITE] ? originColumn <= destColumn : originColumn >= destColumn;
    var columnInterval = comparisonColumn ? columnArray.slice(originColumn, destColumn + 1) : columnArray.slice(destColumn, originColumn + 1);
    return columnInterval.length >= Number(myRange) ? true : false;
  }

  if (movementType & MOVEMENT_DIRECTION_DIAGONAL) {
    // novo tratamemto por quadrantes
    var fullFilledSubtypeMainBeginInterval = false;
    var fullFilledSubtypeMainEndInterval = false;
    var fullFilledSubtypeOppositeBeginInterval = false;
    var fullFilledSubtypeOppositeEndInterval = false;

    if (matchMovementDirection(getMovementType(pieceSelected), SUBTYPE_DIAG_MAIN_BEGIN)) {
      var _originColumn5 = columnArray.indexOf(mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]);

      var myColumn = columnArray.indexOf(getPieceLocation(pieceSelected)[SQUARE_ALPHABETICAL_NDX]);

      var _comparisonColumn5 = pieceSelected[PIECE_COLOR_INDEX] == colorNotation[COLOR_WHITE] ? _originColumn5 <= myColumn : _originColumn5 >= myColumn;

      var subTypeMainBeginInterval = _comparisonColumn5 ? columnArray.slice(_originColumn5, myColumn + 1) : columnArray.slice(myColumn, _originColumn5 + 1);
      fullFilledSubtypeMainBeginInterval = subTypeMainBeginInterval.length >= Number(myRange);
    }

    if (matchMovementDirection(getMovementType(pieceSelected), SUBTYPE_DIAG_MAIN_END)) {
      var _originColumn6 = columnArray.indexOf(mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]);

      var _myColumn4 = columnArray.indexOf(getPieceLocation(pieceSelected)[SQUARE_ALPHABETICAL_NDX]);

      var _comparisonColumn6 = pieceSelected[PIECE_COLOR_INDEX] == colorNotation[COLOR_WHITE] ? _originColumn6 <= _myColumn4 : _originColumn6 >= _myColumn4;

      var subTypeMainEndInterval = _comparisonColumn6 ? columnArray.slice(_originColumn6, _myColumn4 + 1) : columnArray.slice(_myColumn4, _originColumn6 + 1);
      fullFilledSubtypeMainEndInterval = subTypeMainEndInterval.length >= Number(myRange);
    }

    if (matchMovementDirection(getMovementType(pieceSelected), SUBTYPE_DIAG_OPPOSITE_BEGIN)) {
      var _originColumn7 = columnArray.indexOf(oppositeDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]);

      var _myColumn5 = columnArray.indexOf(getPieceLocation(pieceSelected)[SQUARE_ALPHABETICAL_NDX]);

      var _comparisonColumn7 = pieceSelected[PIECE_COLOR_INDEX] == colorNotation[COLOR_WHITE] ? _originColumn7 <= _myColumn5 : _originColumn7 >= _myColumn5;

      var subTypeOppositeBeginInterval = _comparisonColumn7 ? columnArray.slice(_originColumn7, _myColumn5 + 1) : columnArray.slice(_myColumn5, _originColumn7 + 1);
      fullFilledSubtypeOppositeBeginInterval = subTypeOppositeBeginInterval.length >= Number(myRange);
    }

    if (matchMovementDirection(getMovementType(pieceSelected), SUBTYPE_DIAG_OPPOSITE_END)) {
      var _originColumn8 = columnArray.indexOf(oppositeDiagonalRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]);

      var _myColumn6 = columnArray.indexOf(getPieceLocation(pieceSelected)[SQUARE_ALPHABETICAL_NDX]);

      var _comparisonColumn8 = pieceSelected[PIECE_COLOR_INDEX] == colorNotation[COLOR_WHITE] ? _originColumn8 <= _myColumn6 : _originColumn8 >= _myColumn6;

      var subTypeOppositeEndInterval = _comparisonColumn8 ? columnArray.slice(_originColumn8, _myColumn6 + 1) : columnArray.slice(_myColumn6, _originColumn8 + 1);
      fullFilledSubtypeOppositeEndInterval = subTypeOppositeEndInterval.length >= Number(myRange);
    }

    return fullFilledSubtypeMainBeginInterval & fullFilledSubtypeMainEndInterval & fullFilledSubtypeOppositeBeginInterval & fullFilledSubtypeOppositeEndInterval;
  }
} // Obter alcance do movimento da peca


function getMovementRange(piece) {
  var pieceNdx = pieceType.indexOf(piece[PIECE_NOTATION_INDEX]);
  return pieceMovementRange[pieceNdx];
} // Obter direcoes que a peca anda


function getMovementType(piece) {
  var pieceNdx = pieceType.indexOf(piece[PIECE_NOTATION_INDEX]);
  return pieceMovementType[pieceNdx];
} // Este conjunto de movimentos possui esta direcao(direction) especifica?


function matchMovementDirection(movType, direction) {
  return movType & direction ? true : false;
}

function matchMovementDirectionAndDisable(movType, direction) {
  // alert(Boolean(movType & direction))
  if (movType & direction) {
    return movType ^ direction;
  }

  return movType;
}

function alertAllMovementSubTypes(movType) {
  movType & SUBTYPE_DIAG_MAIN_BEGIN ? alert("SUBTYPE_DIAG_MAIN_BEGIN") : alert("no");
  movType & SUBTYPE_DIAG_MAIN_END ? alert("SUBTYPE_DIAG_MAIN_END") : alert("no");
  ;
  movType & SUBTYPE_DIAG_OPPOSITE_BEGIN ? alert("SUBTYPE_DIAG_OPPOSITE_BEGIN") : alert("no");
  ;
  movType & SUBTYPE_DIAG_OPPOSITE_END ? alert("SUBTYPE_DIAG_OPPOSITE_END") : alert("no");
  ;
}

function xorMovementDirection(movType, direction) {
  // alert (Number(movType ^ direction))
  return movType ^ direction;
} // Obter 'casa' da peça (Ex.: a2, h1, f7, etc.)


function getPieceLocation(piece) {
  var myId = $('.piecesquare:contains("' + piece.toString() + '")').attr("id");
  return myId === undefined ? false : myId;
} // Esta peça possui algum movimento ja calculado a realizar ?


function hasAnyMovementOnRange(piece) {
  var movType = getMovementType(piece);

  if (matchMovementDirection(movType, MOVEMENT_DIRECTION_COLUMN)) {
    var lineNdx0 = Math.abs(Number(columnMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_NUMERIC_NDX]));
    var lineNdx1 = Math.abs(Number(columnMovementRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_NUMERIC_NDX]));

    if (Math.abs(lineNdx0 - lineNdx1) > 0) {
      return true;
    }
  }

  if (matchMovementDirection(movType, MOVEMENT_DIRECTION_LINE)) {
    var originColumn = columnArray.indexOf(lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]);
    var destColumn = columnArray.indexOf(lineMovementRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]);
    var comparisonColumn = pieceSelected[0] == colorNotation[COLOR_WHITE] ? originColumn <= destColumn : originColumn >= destColumn;
    var columnInterval = comparisonColumn ? columnArray.slice(originColumn, destColumn + 1) : columnArray.slice(destColumn, originColumn + 1);

    if (columnInterval.length > 1) {
      return true;
    }
  }

  if (matchMovementDirection(movType, MOVEMENT_DIRECTION_DIAGONAL)) {
    var _originColumn9 = columnArray.indexOf(mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]);

    var _destColumn = columnArray.indexOf(mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]);

    var mainDiagonalInterval = _originColumn9 <= _destColumn ? columnArray.slice(_originColumn9, _destColumn + 1) : columnArray.slice(_destColumn, _originColumn9 + 1);

    if (mainDiagonalInterval.length > 1) {
      return true;
    }

    _originColumn9 = columnArray.indexOf(oppositeDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]);
    _destColumn = columnArray.indexOf(oppositeDiagonalRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]);
    var oppositeDiagonalInterval = _originColumn9 <= _destColumn ? columnArray.slice(_originColumn9, _destColumn + 1) : columnArray.slice(_destColumn, _originColumn9 + 1);

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

function scanPawnDiagonal(originSquare, piece) {
  var myColor = piece[PIECE_COLOR_INDEX];
  var myLineIndex = Number(originSquare[SQUARE_NUMERIC_NDX]);
  var myColumnIndex = columnArray.indexOf(originSquare[SQUARE_ALPHABETICAL_NDX]);
  var nextTopLineOffset = getMovementOffset(TOP_OFFSET, myColor);
  var nextLeftColumnOffset = getMovementOffset(LFT_OFFSET, myColor);
  var nextRightColumnOffset = getMovementOffset(RGT_OFFSET, myColor);
  var nextLeftColumn = myColumnIndex + nextLeftColumnOffset;
  var nextRightColumn = myColumnIndex + nextRightColumnOffset;
  var nextTopLine = myLineIndex + nextTopLineOffset; // Destination Squares

  var nextTopLeftSquareName = columnArray[nextLeftColumn] !== undefined ? columnArray[nextLeftColumn] + nextTopLine : -1;
  var nextTopRightSquareName = columnArray[nextRightColumn] !== undefined ? columnArray[nextRightColumn] + nextTopLine : -1;
  mySquareContent = getSquareStatus(nextTopLeftSquareName);

  if (mySquareContent == OPPONENT_PIECE_SQUARE) {
    captureSquares[captureSquareCtr++] = nextTopLeftSquareName;
  }

  mySquareContent = getSquareStatus(nextTopRightSquareName);

  if (mySquareContent == OPPONENT_PIECE_SQUARE) {
    captureSquares[captureSquareCtr++] = nextTopRightSquareName;
  }

  var boolReturn = captureSquareCtr > 0 || isValidSquareIndex(columnMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE]) && isValidSquareIndex(columnMovementRange[MOVEMENT_RANGE_END_SQUARE]);
  return boolReturn;
}

function scanMovementDirections(movementType, originSquare, piece, scanType) {
  // const MOVEMENT_DIRECTION_COLUMN   = 0x01;
  // const MOVEMENT_DIRECTION_LINE     = 0x02;
  // const MOVEMENT_DIRECTION_DIAGONAL = 0x04;
  // const MOVEMENT_DIRECTION_L        = 0x08;
  var myColor = piece[PIECE_COLOR_INDEX];
  var pieceNdx = pieceType.indexOf(piece[PIECE_NOTATION_INDEX]);
  var myLineIndex = Number(originSquare[SQUARE_NUMERIC_NDX]);
  var myFirstLineNdx = myLineIndex;
  var myMovType = movementType;
  var mySquareContent = 0;
  var myColumnIndex = columnArray.indexOf(originSquare[SQUARE_ALPHABETICAL_NDX]);
  var nextTopLineOffset = getMovementOffset(TOP_OFFSET, myColor);
  var nextBottomLineOffset = getMovementOffset(BOT_OFFSET, myColor);
  var nextLeftColumnOffset = getMovementOffset(LFT_OFFSET, myColor);
  var nextRightColumnOffset = getMovementOffset(RGT_OFFSET, myColor);
  captureSquares = [];
  captureSquareCtr = 0;
  resetAllDirectionMovementRange();

  do {
    // Movimenta-se em coluna
    if (matchMovementDirection(myMovType, MOVEMENT_DIRECTION_COLUMN)) {
      var nextTopLine = myLineIndex + nextTopLineOffset;
      var nextBottomLine = myLineIndex + nextBottomLineOffset;
      var nextTopSquareName = originSquare[SQUARE_ALPHABETICAL_NDX] + nextTopLine;
      var nextBottomSquareName = originSquare[SQUARE_ALPHABETICAL_NDX] + nextBottomLine;

      if (scanType == FULL_SCAN) {
        var stillHasMovements = false;
        if (Number(columnMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE]) == -1) columnMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE] = originSquare;
        if (Number(columnMovementRange[MOVEMENT_RANGE_END_SQUARE]) == -1) columnMovementRange[MOVEMENT_RANGE_END_SQUARE] = originSquare; // alert(columnMovementRange)

        mySquareContent = getSquareStatus(nextBottomSquareName);

        if (mySquareContent == BLANK_SPACE_SQUARE && piece[PIECE_NOTATION_INDEX] != PIECE_TYPE_PAWN) {
          stillHasMovements = true;
          columnMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE] = nextBottomSquareName;
          nextBottomLineOffset += getMovementOffset(BOT_OFFSET, myColor);
        } else if (mySquareContent == OPPONENT_PIECE_SQUARE && matchMovementDirection(myMovType, MOVEMENT_DIRECTION_COLUMN)) {
          captureSquares[captureSquareCtr++] = nextBottomSquareName;
        }

        mySquareContent = getSquareStatus(nextTopSquareName);

        if (mySquareContent == BLANK_SPACE_SQUARE) {
          if (piece[PIECE_NOTATION_INDEX] == PIECE_TYPE_PAWN && myColor == 'W' && myFirstLineNdx == 2 || piece[PIECE_NOTATION_INDEX] == PIECE_TYPE_PAWN && myColor == 'B' && myFirstLineNdx == 7) {
            pieceMovementRange[pieceNdx] = DOUBLE_SQUARE_RANGE;
            nextTopSquareName = originSquare[SQUARE_ALPHABETICAL_NDX] + (Number(nextTopLine) + Number(nextTopLineOffset));
            myFirstLineNdx++;
          } else if (piece[PIECE_NOTATION_INDEX] == PIECE_TYPE_PAWN) {
            pieceMovementRange[pieceNdx] = SQUARE_RANGE;
          }

          stillHasMovements = true;
          columnMovementRange[MOVEMENT_RANGE_END_SQUARE] = nextTopSquareName;
          nextTopLineOffset += getMovementOffset(TOP_OFFSET, myColor);
        } else if (mySquareContent == OPPONENT_PIECE_SQUARE && matchMovementDirection(myMovType, MOVEMENT_DIRECTION_COLUMN)) {
          if (piece[PIECE_NOTATION_INDEX] != PIECE_TYPE_PAWN) captureSquares[captureSquareCtr++] = nextTopSquareName;
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
      } else if (hasBlankSpace(nextTopSquareName) || hasBlankSpace(nextBottomSquareName)) {
        return true;
      } else {
        myMovType = myMovType ^ MOVEMENT_DIRECTION_COLUMN;
        continue;
      }
    } else if (matchMovementDirection(myMovType, MOVEMENT_DIRECTION_LINE)) {
      var nextLeftColumn = myColumnIndex + nextLeftColumnOffset;
      var nextRightColumn = myColumnIndex + nextRightColumnOffset;
      var nextLeftSquareName = columnArray[nextLeftColumn] !== undefined ? columnArray[nextLeftColumn] + originSquare[SQUARE_NUMERIC_NDX] : -1;
      var nextRightSquareName = columnArray[nextRightColumn] !== undefined ? columnArray[nextRightColumn] + originSquare[SQUARE_NUMERIC_NDX] : -1;

      if (scanType == FULL_SCAN) {
        var _stillHasMovements = false;
        if (Number(lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE]) == -1) lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE] = originSquare;
        if (Number(lineMovementRange[MOVEMENT_RANGE_END_SQUARE]) == -1) lineMovementRange[MOVEMENT_RANGE_END_SQUARE] = originSquare;
        mySquareContent = getSquareStatus(nextLeftSquareName);

        if (mySquareContent == BLANK_SPACE_SQUARE) {
          _stillHasMovements = true;
          lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE] = nextLeftSquareName;
          nextLeftColumnOffset += getMovementOffset(LFT_OFFSET, myColor);
        } else if (mySquareContent == OPPONENT_PIECE_SQUARE) {
          // alert(nextLeftSquareName)
          captureSquares[captureSquareCtr++] = nextLeftSquareName;
        }

        mySquareContent = getSquareStatus(nextRightSquareName);

        if (mySquareContent == BLANK_SPACE_SQUARE) {
          _stillHasMovements = true;
          lineMovementRange[MOVEMENT_RANGE_END_SQUARE] = nextRightSquareName;
          nextRightColumnOffset += getMovementOffset(RGT_OFFSET, myColor);
        } else if (mySquareContent == OPPONENT_PIECE_SQUARE) {
          // alert(nextRightSquareName)
          captureSquares[captureSquareCtr++] = nextRightSquareName;
        }

        if (hasFullFilledRange(MOVEMENT_DIRECTION_LINE, pieceMovementRange[pieceNdx]) || _stillHasMovements == false) {
          myMovType = myMovType ^ MOVEMENT_DIRECTION_LINE;
          nextLeftColumnOffset = getMovementOffset(LFT_OFFSET, myColor);
          nextRightColumnOffset = getMovementOffset(RGT_OFFSET, myColor);
          continue;
        }
      } else if (hasBlankSpace(nextLeftSquareName) || hasBlankSpace(nextRightSquareName)) {
        return true;
      } else {
        myMovType = myMovType ^ MOVEMENT_DIRECTION_LINE;
        continue;
      }
    } else if (matchMovementDirection(myMovType, MOVEMENT_DIRECTION_DIAGONAL)) {
      // Column offset
      var _nextLeftColumn = myColumnIndex + nextLeftColumnOffset;

      var _nextRightColumn = myColumnIndex + nextRightColumnOffset; // Line Offset


      var _nextTopLine = myLineIndex + nextTopLineOffset;

      var _nextBottomLine = myLineIndex + nextBottomLineOffset; // Destination Squares


      var nextTopLeftSquareName = columnArray[_nextLeftColumn] !== undefined ? columnArray[_nextLeftColumn] + _nextTopLine : -1;
      var nextTopRightSquareName = columnArray[_nextRightColumn] !== undefined ? columnArray[_nextRightColumn] + _nextTopLine : -1;
      var nextBottomLeftSquareName = columnArray[_nextLeftColumn] !== undefined ? columnArray[_nextLeftColumn] + _nextBottomLine : -1;
      var nextBottomRightSquareName = columnArray[_nextRightColumn] !== undefined ? columnArray[_nextRightColumn] + _nextBottomLine : -1; // alert("main : " + mainDiagonalRange);
      // alert("opposite: " + oppositeDiagonalRange);
      // alert("NLCO:" + nextLeftColumnOffset + " NRCO:" + nextRightColumnOffset + " NTLO:" + nextTopLineOffset + " NBLO:" + nextBottomLineOffset);
      // alert("NLC:" + nextLeftColumn + " NRC:" + nextRightColumn + " NTL:" + nextTopLine + " NBL:" + nextBottomLine);
      // alert("TL:" + nextTopLeftSquareName + " TR:" + nextTopRightSquareName + " BL:" + nextBottomLeftSquareName + " BR:" + nextBottomRightSquareName);

      if (scanType == FULL_SCAN) {
        var _stillHasMovements2 = false;
        var leftColumnOffsetChanged = 0;
        var bottomLineOffsetChanged = 0;
        var rightColumnOffsetChanged = 0;
        var topLineOffsetChanged = 0; // Peoes :(

        if (piece[PIECE_NOTATION_INDEX] == PIECE_TYPE_PAWN) return scanPawnDiagonal(originSquare, piece); //
        // main Diagonal
        //

        if (Number(mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE]) == -1) mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE] = originSquare;
        if (Number(mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE]) == -1) mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE] = originSquare;
        mySquareContent = getSquareStatus(nextTopLeftSquareName); // alert(matchMovementDirection(myMovType, SUBTYPE_DIAG_MAIN_BEGIN));
        // alert(mySquareContent);

        if (mySquareContent == BLANK_SPACE_SQUARE && matchMovementDirection(myMovType, SUBTYPE_DIAG_MAIN_BEGIN)) {
          //  alert(nextLeftColumn + " = " + myColumnIndex + " + " + nextLeftColumnOffset);
          //  alert(nextTopLine + " = " + myLineIndex + " + " + nextTopLineOffset);
          _stillHasMovements2 = true;
          mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE] = nextTopLeftSquareName;
          nextLeftColumnOffset += getMovementOffset(LFT_OFFSET, myColor);
          nextTopLineOffset += getMovementOffset(TOP_OFFSET, myColor);
          leftColumnOffsetChanged = 1;
          topLineOffsetChanged = 1;
        } else if (mySquareContent == OPPONENT_PIECE_SQUARE && matchMovementDirection(myMovType, SUBTYPE_DIAG_MAIN_BEGIN)) {
          captureSquares[captureSquareCtr++] = nextTopLeftSquareName;
          myMovType = matchMovementDirectionAndDisable(myMovType, SUBTYPE_DIAG_MAIN_BEGIN);
        } else {
          myMovType = matchMovementDirectionAndDisable(myMovType, SUBTYPE_DIAG_MAIN_BEGIN);
        } // alert(alertAllMovemenTypes)
        // alert( alertAllMovementSubTypes(myMovType) );


        mySquareContent = getSquareStatus(nextBottomRightSquareName);

        if (mySquareContent == BLANK_SPACE_SQUARE && matchMovementDirection(myMovType, SUBTYPE_DIAG_MAIN_END)) {
          _stillHasMovements2 = true;
          mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE] = nextBottomRightSquareName;
          nextRightColumnOffset += getMovementOffset(RGT_OFFSET, myColor);
          nextBottomLineOffset += getMovementOffset(BOT_OFFSET, myColor);
          rightColumnOffsetChanged = 1;
          bottomLineOffsetChanged = 1;
        } else if (mySquareContent == OPPONENT_PIECE_SQUARE && matchMovementDirection(myMovType, SUBTYPE_DIAG_MAIN_END)) {
          captureSquares[captureSquareCtr++] = nextBottomRightSquareName; // alert("bt" + nextBottomRightSquareName)
          // alert("bottomright:" + captureSquares);

          myMovType = matchMovementDirectionAndDisable(myMovType, SUBTYPE_DIAG_MAIN_END);
        } else {
          myMovType = matchMovementDirectionAndDisable(myMovType, SUBTYPE_DIAG_MAIN_END);
        } // alert( alertAllMovementSubTypes(myMovType));
        //
        // opposite Diagonal
        //


        if (Number(oppositeDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE]) == -1) oppositeDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE] = originSquare;
        if (Number(oppositeDiagonalRange[MOVEMENT_RANGE_END_SQUARE]) == -1) oppositeDiagonalRange[MOVEMENT_RANGE_END_SQUARE] = originSquare;
        mySquareContent = getSquareStatus(nextBottomLeftSquareName);

        if (mySquareContent == BLANK_SPACE_SQUARE && matchMovementDirection(myMovType, SUBTYPE_DIAG_OPPOSITE_BEGIN)) {
          _stillHasMovements2 = true;
          oppositeDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE] = nextBottomLeftSquareName; // So incrementar se ja nao houve avanco anterior

          nextLeftColumnOffset += leftColumnOffsetChanged ? 0 : getMovementOffset(LFT_OFFSET, myColor);
          nextBottomLineOffset += bottomLineOffsetChanged ? 0 : getMovementOffset(BOT_OFFSET, myColor);
        } else if (mySquareContent == OPPONENT_PIECE_SQUARE && matchMovementDirection(myMovType, SUBTYPE_DIAG_OPPOSITE_BEGIN)) {
          captureSquares[captureSquareCtr++] = nextBottomLeftSquareName; // alert("bl" + nextBottomLeftSquareName)
          // alert("topLeft" + captureSquares);

          myMovType = matchMovementDirectionAndDisable(myMovType, SUBTYPE_DIAG_OPPOSITE_BEGIN);
        } else {
          myMovType = matchMovementDirectionAndDisable(myMovType, SUBTYPE_DIAG_OPPOSITE_BEGIN);
        } // alert( matchMovementDirection(myMovType, SUBTYPE_DIAG_OPPOSITE_END));


        mySquareContent = getSquareStatus(nextTopRightSquareName);

        if (mySquareContent == BLANK_SPACE_SQUARE && matchMovementDirection(myMovType, SUBTYPE_DIAG_OPPOSITE_END)) {
          _stillHasMovements2 = true; // alert(nextTopRightSquareName);

          oppositeDiagonalRange[MOVEMENT_RANGE_END_SQUARE] = nextTopRightSquareName; // So incrementar se ja nao houve avanco anterior

          nextRightColumnOffset += rightColumnOffsetChanged ? 0 : getMovementOffset(RGT_OFFSET, myColor);
          nextTopLineOffset += topLineOffsetChanged ? 0 : getMovementOffset(TOP_OFFSET, myColor);
        } else if (mySquareContent == OPPONENT_PIECE_SQUARE && matchMovementDirection(myMovType, SUBTYPE_DIAG_OPPOSITE_END)) {
          // alert("bl" + nextTopRightSquareName)
          captureSquares[captureSquareCtr++] = nextTopRightSquareName; // alert("bl" + nextTopRightSquareName)
          // alert(nextTopRightSquareName)

          myMovType = matchMovementDirectionAndDisable(myMovType, SUBTYPE_DIAG_OPPOSITE_END);
        } else {
          myMovType = matchMovementDirectionAndDisable(myMovType, SUBTYPE_DIAG_OPPOSITE_END);
        } // alert( alertAllMovementSubTypes(myMovType));


        if (hasFullFilledRange(myMovType, pieceMovementRange[pieceNdx]) || _stillHasMovements2 == false) {
          myMovType = myMovType ^ MOVEMENT_DIRECTION_DIAGONAL;
          myMovType = matchMovementDirectionAndDisable(myMovType, SUBTYPE_DIAG_MAIN_BEGIN);
          myMovType = matchMovementDirectionAndDisable(myMovType, SUBTYPE_DIAG_MAIN_END);
          myMovType = matchMovementDirectionAndDisable(myMovType, SUBTYPE_DIAG_OPPOSITE_BEGIN);
          myMovType = matchMovementDirectionAndDisable(myMovType, SUBTYPE_DIAG_OPPOSITE_END); // alert( movementMatchesAnyDirection(myMovType));
          // alert( movementMatchesAnySubtype(myMovType));
          // alert (myColor)

          nextTopLineOffset = getMovementOffset(TOP_OFFSET, myColor);
          nextBottomLineOffset = getMovementOffset(BOT_OFFSET, myColor);
          nextLeftColumnOffset = getMovementOffset(LFT_OFFSET, myColor);
          nextRightColumnOffset = getMovementOffset(RGT_OFFSET, myColor);
          continue;
        }
      } else if (hasBlankSpace(nextTopLeftSquareName) || hasBlankSpace(nextTopRightSquareName) || hasBlankSpace(nextBottomLeftSquareName) || hasBlankSpace(nextBottomRightSquareName)) {
        return true;
      } else {
        // alert (myColor)
        myMovType = myMovType ^ MOVEMENT_DIRECTION_DIAGONAL;
        myMovType = matchMovementDirectionAndDisable(myMovType, SUBTYPE_DIAG_MAIN_BEGIN);
        myMovType = matchMovementDirectionAndDisable(myMovType, SUBTYPE_DIAG_MAIN_END);
        myMovType = matchMovementDirectionAndDisable(myMovType, SUBTYPE_DIAG_OPPOSITE_BEGIN);
        myMovType = matchMovementDirectionAndDisable(myMovType, SUBTYPE_DIAG_OPPOSITE_END);
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
      var _nextBottomLine2 = myLineIndex + nextBottomLineOffset;

      var _nextTopLine2 = myLineIndex + nextTopLineOffset;

      var _nextLeftColumn2 = myColumnIndex + nextLeftColumnOffset;

      var _nextRightColumn2 = myColumnIndex + nextRightColumnOffset;

      var turnMovementTop = _nextTopLine2;
      var turnMovementBottom = _nextBottomLine2;
      var turnMovementLeft = _nextLeftColumn2;
      var turnMovementRight = _nextRightColumn2;
      LMovementSquares = [];
      LMovementSquares[0] = -1; // Quadrante Left

      var sprintMovement = _nextLeftColumn2 + nextLeftColumnOffset;
      var leftZoneMoveTop = columnArray[sprintMovement] !== undefined ? columnArray[sprintMovement] + turnMovementTop : -1;
      var leftZoneMoveBottom = columnArray[sprintMovement] !== undefined ? columnArray[sprintMovement] + turnMovementBottom : -1; // Quadrante Right

      sprintMovement = _nextRightColumn2 + nextRightColumnOffset;
      var rightZoneMoveTop = columnArray[sprintMovement] !== undefined ? columnArray[sprintMovement] + turnMovementTop : -1;
      var rightZoneMoveBottom = columnArray[sprintMovement] !== undefined ? columnArray[sprintMovement] + turnMovementBottom : -1; // Quadrante Top

      sprintMovement = _nextTopLine2 + nextTopLineOffset;
      var topZoneMoveLeft = columnArray[turnMovementLeft] !== undefined ? columnArray[turnMovementLeft] + sprintMovement : -1;
      var topZoneMoveRight = columnArray[turnMovementRight] !== undefined ? columnArray[turnMovementRight] + sprintMovement : -1; // Quadrante Bottom

      sprintMovement = _nextBottomLine2 + nextBottomLineOffset;
      var bottomZoneMoveLeft = columnArray[turnMovementLeft] !== undefined ? columnArray[turnMovementLeft] + sprintMovement : -1;
      var bottomZoneMoveRight = columnArray[turnMovementRight] !== undefined ? columnArray[turnMovementRight] + sprintMovement : -1; // alert("LzmT:" + leftZoneMoveTop + " LzmB:" + leftZoneMoveBottom);
      // alert("RzmT:" + rightZoneMoveTop + " RzmB:" + rightZoneMoveBottom);
      // alert("TzmL:" + topZoneMoveLeft + " TzmR:" + topZoneMoveRight);
      // alert("BzmL:" + bottomZoneMoveLeft + " BzmR:" + bottomZoneMoveRight);

      if (scanType == FULL_SCAN) {
        // let LSquareMovementCtr = 0;
        var arrsquares = [];
        arrsquares.push(leftZoneMoveTop);
        arrsquares.push(leftZoneMoveBottom);
        arrsquares.push(rightZoneMoveTop);
        arrsquares.push(rightZoneMoveBottom);
        arrsquares.push(topZoneMoveLeft);
        arrsquares.push(topZoneMoveRight);
        arrsquares.push(bottomZoneMoveLeft);
        arrsquares.push(topZoneMoveRight); // alert(arrsquares);

        getSquareGroupStatus(arrsquares);
        captureSquares = [];
        LMovementSquares = [];
        var data = [];
        LMovementSquares = data.concat(emptySquareArr); // Array.prototype.push.apply(captureSquares, opponentSquareArr);
        // Array.prototype.push.apply(LMovementSquares, emptySquareArr);

        alert(LMovementSquares); // if ( getSquareStatus(leftZoneMoveTop) )
        //     LMovementSquares[LSquareMovementCtr++] = leftZoneMoveTop;
        // if ( hasBlankSpace(leftZoneMoveBottom) )
        //     LMovementSquares[LSquareMovementCtr++] = leftZoneMoveBottom;    
        // if ( hasBlankSpace(rightZoneMoveTop) )
        //     LMovementSquares[LSquareMovementCtr++] = rightZoneMoveTop;
        // if ( hasBlankSpace(rightZoneMoveBottom) )
        //     LMovementSquares[LSquareMovementCtr++] = rightZoneMoveBottom;
        // if ( hasBlankSpace(topZoneMoveLeft) )
        //     LMovementSquares[LSquareMovementCtr++] = topZoneMoveLeft;
        // if ( hasBlankSpace(topZoneMoveRight) )
        //     LMovementSquares[LSquareMovementCtr++] = topZoneMoveRight;
        // if ( hasBlankSpace(bottomZoneMoveLeft) )
        //     LMovementSquares[LSquareMovementCtr++] = bottomZoneMoveLeft;
        // if ( hasBlankSpace(bottomZoneMoveRight) )
        //     LMovementSquares[LSquareMovementCtr++] = bottomZoneMoveRight;

        myMovType = myMovType ^ MOVEMENT_DIRECTION_L;
        nextTopLineOffset = getMovementOffset(TOP_OFFSET, myColor);
        nextBottomLineOffset = getMovementOffset(BOT_OFFSET, myColor);
        nextLeftColumnOffset = getMovementOffset(LFT_OFFSET, myColor);
        nextRightColumnOffset = getMovementOffset(RGT_OFFSET, myColor);
        if (captureSquares.length > 0) return true;
        if (LMovementSquares.length > 0) return true; // alert(LMovementSquares);
      } else if (hasBlankSpace(leftZoneMoveTop) || hasBlankSpace(leftZoneMoveBottom) || hasBlankSpace(rightZoneMoveTop) || hasBlankSpace(rightZoneMoveBottom) || hasBlankSpace(topZoneMoveLeft) || hasBlankSpace(topZoneMoveRight) || hasBlankSpace(bottomZoneMoveLeft) || hasBlankSpace(bottomZoneMoveRight)) {
        return true;
      }
    }
  } while (movementMatchesAnyDirection(myMovType));

  if (scanType == FULL_SCAN) {
    if (hasAnyMovementOnRange(piece) == false) return false;
    return true;
  }

  return false;
} // Calcular e avaliar se existe algum movimento possivel em qualquer direção desta peça.


function pieceMovementIsPossible(piece, originSquare) {
  return scanMovementDirections(getMovementType(piece), originSquare, piece, SQUARE_SCAN);
} // Calcular todos os movimentos possiveis em todas as direção.


function evaluatePieceMovementRange(piece, originSquare) {
  return scanMovementDirections(getMovementType(piece), originSquare, piece, FULL_SCAN);
}

function isHighlightClass(myClass) {
  return highlightClasses.includes(myClass);
} // Esta casa encontra-se nas casas já calculadas para movimento?  


function isSquareOnMovementRange(squareId) {
  var divSquare = document.querySelector('#' + squareId);
  var classAttr = divSquare.getAttribute("class").split(" ");
  return classAttr.some(isHighlightClass);
} // Mover peça de seu local atual para destinationSquare.


function doMovePiece(piece, destinationSquare) {
  var originSquare = getPieceLocation(piece);
  document.getElementById(originSquare).innerHTML = "";
  document.getElementById(destinationSquare).innerHTML = piece;
}

function doCapturePiece(piece, pieceSquare) {
  document.getElementById(pieceSquare).innerHTML = "";
  capturedPieces[capturedPiecesCtr++] = piece;
  selectEmptySquare(pieceSquare);
  if (capturedPiecesCtr < 1) return;
  document.getElementById("pwhite").innerHTML = "White Captures: ";
  document.getElementById("pblack").innerHTML = "Black Captures: ";
  capturedPieces.map(function (piece) {
    if (piece[0] == colorNotation[COLOR_BLACK]) document.getElementById("pwhite").innerHTML += " " + piece;else document.getElementById("pblack").innerHTML += " " + piece;
  });
}

function selectSquare(content, squareName) {
  var squareStatus = getSquareStatus(squareName); // alert(squareStatus + " : " + content);

  if (squareStatus == PLAYER_PIECE_SQUARE) return selectPlayerPiece(content, squareName);

  if (pieceSelected && isSquareOnMovementRange(squareName)) {
    if (squareStatus == BLANK_SPACE_SQUARE) selectEmptySquare(squareName);else if (squareStatus == OPPONENT_PIECE_SQUARE) selectOpponentPiece(content, squareName);
    clearActiveSelection();
    pieceSelected = 0;
    return;
  }

  return false;
}

function selectEmptySquare(squareId) {
  doMovePiece(pieceSelected, squareId);
  return;
}

function selectOpponentPiece(piece, pieceSquare) {
  doCapturePiece(piece, pieceSquare);
  return;
}

function selectPlayerPiece(piece, pieceSquare) {
  // Se estamos selecionando uma peça, ela precisa estar "solta",
  // ou seja, ter algum movimento possivel.
  // alert  (piece)
  // alert(getPieceLocation(piece));
  if (pieceMovementIsPossible(piece, pieceSquare) == false) return;
  clearActiveSelection();
  pieceSelected = piece; // alert(pieceSelected);

  evaluatePieceMovementRange(piece, pieceSquare);
  colorMovementPath(getMovementType(piece));
}

function clearActiveSelection() {
  highlightClasses.map(function (value) {
    var className = "." + value;
    $(className).each(function () {
      var bgclass = $(this).attr("bgc");

      if (bgclass !== undefined) {
        $(this).addClass(bgclass);
      }

      $(this).removeClass(value);
    });
  });
  pieceSelected = 0;
  return;
}

function deleteBoard() {
  $(".pieceSquare").remove();
}

function drawBoard() {
  var board = document.querySelector('.board');
  var style = getComputedStyle(board);
  var myWidth = style.width.split('p')[0]; // gets size before 'px' literal

  var myHeight = style.height.split('p')[0]; // gets size before 'px' literal

  var iSquareWidth = myWidth / 8;
  var iSquareHeight = myHeight / 8;
  var sqMarginLeft = 0;
  var sqMarginTop = 0;
  var rowNumber = 0;
  var columnChar = 'a';
  var rowColorToggle = true;

  for (var _i2 = 0; _i2 < LINE_SQUARE_COUNT; _i2++) {
    for (var j = 0; j < COLUMN_SQUARE_ROW; j++) {
      var divSquare = document.createElement('div');
      if (j % 2 != rowColorToggle) divSquare.classList.add('lightsquarecolor');else divSquare.classList.add('darksquarecolor');
      divSquare.style.width = iSquareWidth;
      divSquare.style.height = iSquareHeight;
      divSquare.style.position = 'absolute';
      divSquare.style.marginLeft = sqMarginLeft;
      divSquare.style.marginTop = sqMarginTop;
      divSquare.classList.add('pieceSquare');

      if (colorName[playerColorStatus] == 'white') {
        rowNumber = LINE_SQUARE_COUNT - _i2;
        columnChar = columnArray[j];
      } else {
        rowNumber = _i2 + 1;
        columnChar = columnArray[COLUMN_SQUARE_ROW - j - 1];
      }

      divSquare.id = "" + columnChar + rowNumber;
      board.appendChild(divSquare);
      divSquare = document.getElementById(divSquare.id);

      if (initialRows.includes(rowNumber)) {
        drawSinglePiece(divSquare.id); // let pieceColorDrew = drawSinglePiece(divSquare.id);
        // if ( pieceColorDrew == playerColorStatus ){
        //     }
        // }
        // else{
        // divSquare.setAttribute("onclick", "selectSquare(this.innerHTML, this.id)");
      } //                                              piece           sq


      divSquare.setAttribute("onclick", "selectSquare(this.innerHTML, this.id)");
      sqMarginLeft += iSquareWidth;
    }

    sqMarginTop += iSquareHeight;
    sqMarginLeft = 0;
    rowColorToggle = !rowColorToggle;
  }
}

function drawSinglePiece(squareName) {
  var pawnColumn = columnArray[columnArray.indexOf(squareName[SQUARE_ALPHABETICAL_NDX])];

  if (squareName.includes("2")) {
    document.getElementById(squareName).innerHTML = "WP" + pawnColumn;
    return COLOR_WHITE;
  }

  if (squareName.includes("7")) {
    document.getElementById(squareName).innerHTML = "BP" + pawnColumn;
    return COLOR_BLACK;
  } // let pieceName = ""; 


  for (i = 0; i < columnArray.length; i++) {
    if (squareName.includes(columnArray[i])) {
      var pieceColor = squareName.includes("1") ? "W" : "B";
      document.getElementById(squareName).innerHTML = "" + pieceColor + highValuePieceNotation[i];
      pieceName = "" + pieceColor + highValuePieceNotation[i]; // document.getElementById(squareName).innerHTML =
      // "<img src='" + pieceName + ".png'>"

      return pieceColor == "W" ? COLOR_WHITE : COLOR_BLACK;
    }
  }

  return COLOR_NONE;
}

$(document).ready(function () {
  initPieceMovements();
  drawBoard(); // alert(getAnyMainDiagonalFromBegin('a8', colorNotation[playerColorStatus]));
  // let movPath = getAnyMainDiagonalFromBegin('a8', colorNotation[playerColorStatus]);
  // colorDiscreteMovementPath(movPath);
});