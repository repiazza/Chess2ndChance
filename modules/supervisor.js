import {
  highlightSelection,
  getDirectionFromSquare,
  setSelection,
  clearAllElementSelection,
  hasAnySquareDrew,
} from "../mainboard.js";
import {
  TOTAL_PIECE_COUNT,
  PLAYER_PIECE_COUNT,
  ROW_SQUARE_COUNT,
  COLUMN_SQUARE_ROW,
  DARK_BGCOLOR,
  LIGHT_BGCOLOR,
  highlightStyles,
  captureStyles,
  specialPieceStyles,
  bgBoardColors,
  columnArray,
  revColumn,
  enemyRangeStyles,
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
  VISIBILITY_VISIBLE,
  VISIBILITY_HIDDEN,
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
  LONG_CASTLE_INIT_SQUARES,
  SHORT_CASTLE_INIT_SQUARES,
  LONG_CASTLE_ROOK_SQUARES,
  SHORT_CASTLE_ROOK_SQUARES,
  LONG_CASTLE_KING_SQUARES,
  SHORT_CASTLE_KING_SQUARES,
  LONG_CASTLE_COLUMNS,
  SHORT_CASTLE_COLUMNS,
  LONG_CASTLE_NDX,
  SHORT_CASTLE_NDX,
  CASTLE_INIT_SQUARES,
} from "./board.js";
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
  PAWN_PASSE_MOVEMENT,
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
  // FRIENDLY_SIDE,
  // ENEMY_SIDE,
  // BLANK_SIDE,
  // PLAYER_SIDES,
  // ALL_SIDES,
  EMBEDDED_CASTLE_PIECES,
  WHITE_COLOR,
  BLACK_COLOR,
  avaliableColors,
  PROMOTION_PIECES,
} from "./piece.js";
import {
  MAIN_DIAGONAL_DIRECTION,
  OPPOSITE_DIAGONAL_DIRECTION,
  LINE_OF_SIGHT,
  IGNORE_COLISION,
  LINE_DIRECTION,
  COLUMN_DIRECTION,
} from "./movement.js";
//////////////////////////////////////////////////////////
//
// Supervisor block
//

const FILTER_ROW = 0;
const FILTER_COLUMN = 1;
const FILTER_COLOR = 2;
const FILTER_TYPE = 3;
const FILTER_SELECTED = 4;
const FILTER_NOT_SELECTED = 5;
const FILTER_EMPTY = 6;
//  'row', 'column', 'color', 'type', 'selected', 'notselected', 'empty'
let filterDetails = [-1, -1, -1, -1, -1, -1, -1];

let intervalSeconds = 10;
let intervalTime = intervalSeconds * 1000;
let myInterval;

let supervisorMode = false;

export function setSupervisorDiv(divId, mgNORTH) {
  let supervisor = document.createElement("div");
  supervisor.style.position = "absolute";
  supervisor.id = "slp" + divId;
  supervisor.style.marginLeft = "780px";
  supervisor.style.marginTop = mgNORTH + "px";
  supervisor.classList.add("supervisordiv");
  document.getElementById("container").appendChild(supervisor);
}

export function setDirectionFromSelect(e) {
  clearAllElementSelection();

  if (e.target.value == -1 && e.target.checked == false) {
    return;
  }

  let mySquare = document.getElementById("spsbdirectionhlselect");
  let drawDiag = document.getElementById("spsbdiagonaldir").checked;
  let drawColumn = document.getElementById("spsbcolumndir").checked;
  let drawLine = document.getElementById("spsblinedir").checked;
  setSelection(mySquare);
  if (drawDiag == true) {
    getDirectionFromSquare(
      mySquare,
      MAIN_DIAGONAL_DIRECTION,
      LINE_OF_SIGHT,
      IGNORE_COLISION
    );
    getDirectionFromSquare(
      mySquare,
      OPPOSITE_DIAGONAL_DIRECTION,
      LINE_OF_SIGHT,
      IGNORE_COLISION
    );
  }
  if (drawColumn == true) {
    getDirectionFromSquare(mySquare, COLUMN_DIRECTION, LINE_OF_SIGHT, IGNORE_COLISION);
  }
  if (drawLine == true) {
    getDirectionFromSquare(mySquare, LINE_DIRECTION, LINE_OF_SIGHT, IGNORE_COLISION);
  }
  highlightSelection();
}

export function drawDirectionSelect() {
  // Select do square a partir do qual serao highlitadas as direcoes

  let directionSelected = false;
  let selectElem = document.getElementById("spsbdirectionhlselect");
  let lblDirColumn;
  let lblDirLine;
  if (selectElem != null) {
    directionSelected = selectElem.value;
    document.getElementById("container").removeChild(selectElem);
  } else {
    document.querySelectorAll("[id=spsbdirectionhlselect]").forEach((element) => {
      document.getElementById("container").removeChild(element);
    });
  }
  selectElem = document.createElement("select");
  selectElem.id = "spsbdirectionhlselect";
  selectElem.style.position = "absolute";
  selectElem.style.marginTop = "30px";
  selectElem.style.marginLeft = "10px";
  selectElem.addEventListener("change", setDirectionFromSelect);
  let option = document.createElement("option");
  option.value = -1;
  option.text = "Square:";
  selectElem.appendChild(option);
  for (let rowNdx = 1; rowNdx < 9; rowNdx++) {
    columnArray.map(function (columnAlpha, clmndx) {
      option = document.createElement("option");
      option.value = "" + columnAlpha + rowNdx;
      if (directionSelected == option.value) option.selected = 1;

      option.text = option.value;
      selectElem.appendChild(option);
    });
  }

  document.querySelectorAll("[id=spsblbldiagonalselect]").forEach((element) => {
    document.getElementById("container").removeChild(element);
  });
  let labelElem = document.createElement("label");
  labelElem.id = "spsblbldiagonalselect";
  labelElem.setAttribute("for", "spsbdiagonaldir");
  labelElem.innerHTML = "Diagonal";
  labelElem.style.position = "absolute";
  labelElem.style.marginTop = "10px";
  labelElem.style.marginLeft = "10px";

  directionSelected = false;
  let checkDirectionDiagonal = document.getElementById("spsbdiagonaldir");
  if (checkDirectionDiagonal != null) {
    directionSelected = checkDirectionDiagonal.checked;
    document.getElementById("container").removeChild(checkDirectionDiagonal);
  } else {
    document.querySelectorAll("[id=spsbdiagonaldir]").forEach((element) => {
      document.getElementById("container").removeChild(element);
    });
  }

  checkDirectionDiagonal = document.createElement("input");
  checkDirectionDiagonal.type = "checkbox";
  checkDirectionDiagonal.id = "spsbdiagonaldir";
  checkDirectionDiagonal.style.position = "absolute";
  checkDirectionDiagonal.style.marginTop = "13px";
  checkDirectionDiagonal.style.marginLeft = "75px";
  checkDirectionDiagonal.addEventListener("change", setDirectionFromSelect);
  if (directionSelected) checkDirectionDiagonal.checked = 1;

  document.querySelectorAll("[id=spsblblcolumndir]").forEach((element) => {
    document.getElementById("container").removeChild(element);
  });
  lblDirColumn = document.createElement("label");
  lblDirColumn.setAttribute("for", "spsbcolumndir");
  lblDirColumn.id = "spsblblcolumndir";
  lblDirColumn.innerHTML = "Coluna";
  lblDirColumn.style.position = "absolute";
  lblDirColumn.style.marginTop = "10px";
  lblDirColumn.style.marginLeft = "97px";

  directionSelected = false;
  let checkDirectionColumn = document.getElementById("spsbcolumndir");
  if (checkDirectionColumn != null) {
    directionSelected = checkDirectionColumn.checked;
    document.getElementById("container").removeChild(checkDirectionColumn);
  } else {
    document.querySelectorAll("[id=spsbcolumndir]").forEach((element) => {
      document.getElementById("container").removeChild(element);
    });
    document.querySelectorAll("[id=spsblblcolumndir]").forEach((element) => {
      document.getElementById("container").removeChild(element);
    });
  }
  checkDirectionColumn = document.createElement("input");
  checkDirectionColumn.type = "checkbox";
  checkDirectionColumn.id = "spsbcolumndir";
  checkDirectionColumn.style.position = "absolute";
  checkDirectionColumn.style.marginTop = "13px";
  checkDirectionColumn.style.marginLeft = "147px";
  checkDirectionColumn.addEventListener("change", setDirectionFromSelect);
  if (directionSelected) checkDirectionColumn.checked = 1;

  document.querySelectorAll("[id=spsblbllinedir]").forEach((element) => {
    document.getElementById("container").removeChild(element);
  });
  lblDirLine = document.createElement("label");
  lblDirLine.setAttribute("for", "spsblinedir");
  lblDirLine.id = "spsblbllinedir";
  lblDirLine.innerHTML = "Linha";
  lblDirLine.style.position = "absolute";
  lblDirLine.style.marginTop = "10px";
  lblDirLine.style.marginLeft = "173px";

  directionSelected = false;
  let checkDirectionLine = document.getElementById("spsblinedir");
  if (checkDirectionLine != null) {
    directionSelected = checkDirectionLine.checked;
    document.getElementById("container").removeChild(checkDirectionLine);
  } else {
    document.querySelectorAll("[id=spsblinedir]").forEach((element) => {
      document.getElementById("container").removeChild(element);
    });
    document.querySelectorAll("[id=spsblbllinedir]").forEach((element) => {
      document.getElementById("container").removeChild(element);
    });
  }
  checkDirectionLine = document.createElement("input");
  checkDirectionLine.type = "checkbox";
  checkDirectionLine.id = "spsblinedir";
  checkDirectionLine.style.position = "absolute";
  checkDirectionLine.style.marginTop = "13px";
  checkDirectionLine.style.marginLeft = "215px";
  checkDirectionLine.addEventListener("change", setDirectionFromSelect);
  if (directionSelected) checkDirectionLine.checked = 1;

  document.getElementById("container").appendChild(labelElem);
  document.getElementById("container").appendChild(selectElem);
  document.getElementById("container").appendChild(checkDirectionDiagonal);
  document.getElementById("container").appendChild(checkDirectionColumn);
  document.getElementById("container").appendChild(lblDirColumn);
  document.getElementById("container").appendChild(checkDirectionLine);
  document.getElementById("container").appendChild(lblDirLine);
}

export function setIntervalSeconds() {
  let seconds = document.getElementById("spsbtextelem").value;
  if (Number(seconds) > 1 && Number(seconds) < 20 && seconds != intervalSeconds) {
    intervalSeconds = seconds;
    intervalTime = intervalSeconds * 1000;
    window.clearInterval(myInterval);
    myInterval = window.setInterval(setSupervisorPatrol, intervalTime);
  }
}
export function setSupervisorListVisibility(visibilityStatus) {
  document.querySelectorAll("[id^=slp]").forEach((element) => {
    element.style.visibility = visibilityStatus;
  });
}

export function destroySupervisorFrame() {
  document.querySelectorAll("[id^=spsb]").forEach((element) => {
    document.getElementById("container").removeChild(element);
  });
  setSupervisorListVisibility(VISIBILITY_HIDDEN);
}
export function drawIntervalTimeSet() {
  document.querySelectorAll('[id*="textelem"]').forEach((element) => {
    document.getElementById("container").removeChild(element);
  });
  let ptextElem = document.createElement("p");
  ptextElem.id = "spsbptextelem";
  ptextElem.innerHTML = "Frequencia de <br/>atualizacao do<br/> supervisor(seg):";
  ptextElem.style.position = "absolute";
  ptextElem.style.marginTop = "60px";
  ptextElem.style.marginLeft = "10px";
  document.getElementById("container").appendChild(ptextElem);
  let textElem = document.createElement("input");
  textElem.id = "spsbtextelem";
  textElem.setAttribute("type", "text");
  textElem.setAttribute("maxlenght", "10");
  textElem.setAttribute("lenght", "10");
  textElem.value = "" + intervalSeconds;
  textElem.style.position = "absolute";
  textElem.style.marginTop = "120px";
  textElem.style.marginLeft = "10px";
  textElem.style.width = "30px";
  document.getElementById("container").appendChild(textElem);
  let buttonText = document.createElement("input");
  buttonText.id = "spsbbttextelem";
  buttonText.setAttribute("type", "button");
  buttonText.style.position = "absolute";
  buttonText.style.marginTop = "120px";
  buttonText.style.marginLeft = "50px";
  buttonText.setAttribute("value", "Enviar");
  buttonText.addEventListener("click", setIntervalSeconds);
  document.getElementById("container").appendChild(buttonText);
}

export function setSupervisorPatrol() {
  if (!hasAnySquareDrew()) return;

  // drawSquareDetails();
  // fixSquareTypeProprierties();
}
export function drawSquareDetails() {
  if (supervisorMode == false) {
    destroySupervisorFrame();
    return;
  }

  setSupervisorListVisibility(VISIBILITY_VISIBLE);
  drawSupervisorSelect();
  drawDirectionSelect();
  drawIntervalTimeSet();

  let selector = "[square]";
  if (filterDetails[FILTER_COLUMN] != -1) {
    selector += "[id*='" + columnArray[filterDetails[FILTER_COLUMN]] + "']";
  }
  if (filterDetails[FILTER_ROW] != -1) {
    selector += "[id*='" + (Number(filterDetails[FILTER_ROW]) + 1) + "']";
  }
  if (filterDetails[FILTER_COLUMN] != -1 && filterDetails[FILTER_ROW] != -1) {
    selector =
      "[square][id='" +
      columnArray[filterDetails[FILTER_COLUMN]] +
      (Number(filterDetails[FILTER_ROW]) + 1) +
      "']";
  }
  if (filterDetails[FILTER_COLOR] != -1) {
    if (filterDetails[FILTER_COLOR] == "both") selector += "[sqcolor]";
    else {
      selector += "[sqcolor*='" + filterDetails[FILTER_COLOR] + "']";
    }
  }
  if (filterDetails[FILTER_TYPE] != -1) {
    selector += filterDetails[FILTER_TYPE];
  }
  if (filterDetails[FILTER_SELECTED] != -1) {
    selector += filterDetails[FILTER_SELECTED];
  }
  document.querySelectorAll("[id*='slp']").forEach((element) => {
    element.innerHTML = "";
    element.style.fontWeight = "";
  });

  let supervisoridCtr = 0;
  document.querySelectorAll(selector).forEach((element) => {
    let supervisordiv = document.getElementById("slp" + supervisoridCtr++);
    if (supervisordiv == null) return;

    supervisordiv.innerHTML = "";
    supervisordiv.innerHTML += "<b>" + element.id + "</b>";
    supervisordiv.innerHTML +=
      " sqc: " + element.getAttribute("sqcolor").split("PIECE")[0];
    supervisordiv.innerHTML += " | intsq: " + element.getAttribute("initsq");
    if (element.getAttribute("nwsq"))
      supervisordiv.innerHTML += " | nwsq: " + element.getAttribute("nwsq");
    if (element.getAttribute("nesq"))
      supervisordiv.innerHTML += " | nesq: " + element.getAttribute("nesq");
    if (element.getAttribute("sesq"))
      supervisordiv.innerHTML += " | sesq: " + element.getAttribute("sesq");
    if (element.getAttribute("swsq"))
      supervisordiv.innerHTML += " | swsq: " + element.getAttribute("swsq");
    if (element.getAttribute("lsq"))
      supervisordiv.innerHTML += " | lsq: " + element.getAttribute("lsq");
    if (element.getAttribute("rsq"))
      supervisordiv.innerHTML += " | rsq: " + element.getAttribute("rsq");
    if (element.getAttribute("tsq"))
      supervisordiv.innerHTML += " | tsq: " + element.getAttribute("tsq");
    if (element.getAttribute("bsq"))
      supervisordiv.innerHTML += " | bsq: " + element.getAttribute("bsq");

    supervisordiv.innerHTML +=
      " | sqtype: " + element.getAttribute("sqtype").split("PIECE")[0];
    if (element.getAttribute("sltd") != null) {
      supervisordiv.innerHTML += " | sltd: " + element.getAttribute("sltd");
      supervisordiv.style.fontWeight = "bold";
    }
  });
}
export function matchColumnIntervalExcludingInterval(
  initialColumn,
  endColumn = null,
  initialInterval = null,
  endInterval = null
) {
  let myColumn = initialColumn;
  if (endColumn != null) myColumn += "-" + endColumn;

  let pattern = "([" + myColumn + "])";
  let interval = -1;
  if (initialInterval) interval = initialInterval;
  if (endInterval) interval += "-" + endInterval;
  if (interval != -1) {
    pattern += "?[^" + interval + "]";
  }
  pattern += "([1-8])$";
  let re = new RegExp(pattern, "g");
  return $(querySelectorAllRegex(re, "id"));
}

export function matchLineIntervalExcludingInterval(
  initialLine,
  endLine = null,
  initialInterval = null,
  endInterval = null
) {
  let myLine = initialLine;
  if (endLine != null) myLine += "-" + endColumn;

  let pattern = "([a-h])";
  let interval = -1;
  if (initialInterval) interval = initialInterval;
  if (endInterval) interval += "-" + endInterval;
  if (interval != -1) {
    pattern += "?[^" + interval + "]";
  }
  pattern += "([" + myLine + "])$";
  let re = new RegExp(pattern, "g");
  return $(querySelectorAllRegex(re, "id"));
}

export function fixSquareTypeProprierties() {
  selector = "[class*='square'][sqtype='BLANK']";
  document.querySelectorAll(selector).forEach((element) => {
    if (element != null) {
      document.getElementById(element.id).setAttribute("sqcolor", "0");
      clearSelection(element.id);
      element.innerHTML = "";
    }
  });
  selector = "[class*='square']:not([sqcolor='0'])";
  document.querySelectorAll(selector).forEach((element) => {
    let ndxOfInitSquare = columnArray.indexOf(
      element.getAttribute("initsq")[SQUARE_ALPHABETICAL_NDX]
    );
    element.setAttribute("sqtype", pieceTypeByColumn[ndxOfInitSquare]);
    obj = {
      id: element.initsq,
      objname: "",
    };
    if (validateSquareColor(obj, SQUARE_PIECE_COLOR_BLACK))
      element.setAttribute("sqcolor", SQUARE_PIECE_COLOR_BLACK);
    else if (validateSquareColor(obj, SQUARE_PIECE_COLOR_WHITE))
      element.setAttribute("sqcolor", SQUARE_PIECE_COLOR_WHITE);
  });
}
export function toggleSupervisor() {
  supervisorMode = !supervisorMode;
  drawSquareDetails();
}

export function drawSupervisorSelect() {
  let radioElem = [-1, -1];
  let radioLbl = [-1, -1];
  let selectColumn = -1;
  let selectType = -1;
  let typeValue = -1;
  let selectRow = -1;
  let columnVal = -1;
  let rowVal = -1;
  let radioVal = -1;
  let typePieceSelected = false;
  let option = -1;
  filterDetails = [-1, -1, -1, -1, -1, -1, -1];
  // Coluna
  selectColumn = document.getElementById("spsbselectcolumn");
  columnVal = -1;
  if (selectColumn != null) {
    columnVal = selectColumn.value;
  }
  document.querySelectorAll('[id="spsbselectcolumn"]').forEach((element) => {
    document.getElementById("container").removeChild(element);
  });
  selectColumn = document.createElement("select");
  selectColumn.id = "spsbselectcolumn";
  selectColumn.style.position = "absolute";
  selectColumn.style.marginTop = "10px";
  selectColumn.style.marginLeft = "780px";
  selectColumn.addEventListener("change", drawSquareDetails);
  option = document.createElement("option");
  option.value = -1;
  option.text = "Coluna:";
  selectColumn.appendChild(option);
  for (var i = 0; i < columnArray.length; i++) {
    option = document.createElement("option");
    option.value = i;
    option.text = columnArray[i];
    if (columnVal == i) {
      option.selected = 1;
    }
    selectColumn.appendChild(option);
  }

  // Linha
  selectRow = document.getElementById("spsbselectrow");
  rowVal = -1;
  if (selectRow != null) {
    rowVal = selectRow.value;
  }
  document.querySelectorAll('[id="spsbselectrow"]').forEach((element) => {
    document.getElementById("container").removeChild(element);
  });
  selectRow = document.createElement("select");
  selectRow.id = "spsbselectrow";
  selectRow.style.position = "absolute";
  selectRow.style.marginTop = "10px";
  selectRow.style.marginLeft = "870px";
  selectRow.addEventListener("change", drawSquareDetails);
  option = document.createElement("option");
  option.value = -1;
  option.text = "Linha:";
  selectRow.appendChild(option);
  for (var i = 0; i < ROW_SQUARE_COUNT; i++) {
    option = document.createElement("option");
    option.value = i;
    option.text = i + 1;
    if (rowVal == i) {
      option.selected = 1;
    }
    selectRow.appendChild(option);
  }

  // Cores
  radioElem[0] = document.getElementById("spsbrdwhite");
  radioElem[1] = document.getElementById("spsbrdblack");
  radioElem[2] = document.getElementById("spsbrdboth");
  radioLbl[0] = document.getElementById("spsblblrdwhite");
  radioLbl[1] = document.getElementById("spsblblrdblack");
  radioLbl[2] = document.getElementById("spsblblrdboth");
  radioVal = -1;
  if (radioElem[0] != null) {
    radioVal = radioElem[0].checked ? radioElem[0].value : -1;
  }
  if (radioElem[1] != null) {
    if (radioVal == -1) {
      radioVal = radioElem[1].checked ? radioElem[1].value : -1;
    }
  }
  if (radioElem[2] != null) {
    if (radioVal == -1) {
      radioVal = radioElem[2].checked ? radioElem[2].value : -1;
    }
  }
  document.querySelectorAll('[id="spsbrdwhite"]').forEach((element) => {
    document.getElementById("container").removeChild(element);
  });
  document.querySelectorAll('[id="spsbrdblack"]').forEach((element) => {
    document.getElementById("container").removeChild(element);
  });
  document.querySelectorAll('[id="spsblblrdwhite"]').forEach((element) => {
    document.getElementById("container").removeChild(element);
  });
  document.querySelectorAll('[id="spsblblrdblack"]').forEach((element) => {
    document.getElementById("container").removeChild(element);
  });
  document.querySelectorAll('[id="spsbrdboth"]').forEach((element) => {
    document.getElementById("container").removeChild(element);
  });
  document.querySelectorAll('[id="spsblblrdboth"]').forEach((element) => {
    document.getElementById("container").removeChild(element);
  });

  // White Label
  radioLbl[0] = document.createElement("label");
  radioLbl[0].setAttribute("for", "spsbrdwhite");
  radioLbl[0].id = "spsblblrdwhite";
  radioLbl[0].innerHTML = "White:";
  radioLbl[0].style.position = "absolute";
  radioLbl[0].style.marginTop = "12px";
  radioLbl[0].style.marginLeft = "940px";
  // White Radio
  radioElem[0] = document.createElement("input");
  radioElem[0].type = "radio";
  radioElem[0].id = "spsbrdwhite";
  radioElem[0].value = "WHITEPIECE";
  if (radioVal == radioElem[0].value) radioElem[0].checked = true;

  radioElem[0].name = "colors";
  radioElem[0].style.position = "absolute";
  radioElem[0].style.marginTop = "15px";
  radioElem[0].style.marginLeft = "985px";
  radioElem[0].addEventListener("change", drawSquareDetails);

  // Black Label
  radioLbl[1] = document.createElement("label");
  radioLbl[1].setAttribute("for", "spsbrdblack");
  radioLbl[1].id = "spsblblrdblack";
  radioLbl[1].innerHTML = "Black:";
  radioLbl[1].style.position = "absolute";
  radioLbl[1].style.marginTop = "12px";
  radioLbl[1].style.marginLeft = "1005px";
  // Black Radio
  radioElem[1] = document.createElement("input");
  radioElem[1].type = "radio";
  radioElem[1].id = "spsbrdblack";
  radioElem[1].value = "BLACKPIECE";
  if (radioVal == radioElem[1].value) radioElem[1].checked = true;

  radioElem[1].name = "colors";
  radioElem[1].style.position = "absolute";
  radioElem[1].style.marginTop = "15px";
  radioElem[1].style.marginLeft = "1050px";
  radioElem[1].addEventListener("change", drawSquareDetails);

  // Label Ambos
  radioLbl[2] = document.createElement("label");
  radioLbl[2].setAttribute("for", "spsbrdboth");
  radioLbl[2].id = "spsblblrdboth";
  radioLbl[2].innerHTML = "Tudo:";
  radioLbl[2].style.position = "absolute";
  radioLbl[2].style.marginTop = "-5px";
  radioLbl[2].style.marginLeft = "945px";
  // Radio button Ambos
  radioElem[2] = document.createElement("input");
  radioElem[2].type = "radio";
  radioElem[2].id = "spsbrdboth";
  radioElem[2].value = "both";
  if (radioVal == radioElem[2].value) radioElem[2].checked = true;

  radioElem[2].name = "colors";
  radioElem[2].style.position = "absolute";
  radioElem[2].style.marginTop = "-2px";
  radioElem[2].style.marginLeft = "985px";
  radioElem[2].addEventListener("change", drawSquareDetails);

  // Tipo de peça
  let pieceTypeChkbox = [];
  let labelType = [];
  let pieceTypeFilter = "";
  let marginLeftOffset = 55;
  let initialOffset = 1075;
  let marginTop = -2;
  let virgAdd = "";
  let labelSelected;
  let checkSelected;
  for (var i = 0; i < 5; i++) {
    typeValue = 0;
    pieceTypeChkbox[i] = document.getElementById("spsbchkboxtype" + i);
    if (pieceTypeChkbox[i] != null && pieceTypeChkbox[i].checked) {
      typeValue = 1;
      pieceTypeFilter += virgAdd + "[pc" + pieceColumnLookup[i] + "]";
      virgAdd = ",";
    } else virgAdd = "";

    document.querySelectorAll("[id=spsbchkboxtype" + i + "]").forEach((element) => {
      document.getElementById("container").removeChild(element);
    });
    document.querySelectorAll("[id=spsblbltype" + i + "]").forEach((element) => {
      document.getElementById("container").removeChild(element);
    });

    labelType[i] = document.createElement("label");
    labelType[i].setAttribute("for", "spsbchkboxtype" + i);
    labelType[i].id = "spsblbltype" + i;
    labelType[i].innerHTML = pieceTypeByColumn[i].split("PIECE")[0] + ":";
    labelType[i].style.position = "absolute";
    labelType[i].style.marginTop = marginTop + "px";
    labelType[i].style.marginLeft = initialOffset + "px";

    initialOffset += marginLeftOffset;
    pieceTypeChkbox[i] = document.createElement("input");
    pieceTypeChkbox[i].type = "checkbox";
    pieceTypeChkbox[i].id = "spsbchkboxtype" + i;
    pieceTypeChkbox[i].style.position = "absolute";
    pieceTypeChkbox[i].style.marginTop = marginTop + 3 + "px";
    pieceTypeChkbox[i].style.marginLeft = initialOffset + "px";

    if (typeValue) {
      pieceTypeChkbox[i].checked = 1;
    }
    initialOffset = initialOffset + 20;
    marginLeftOffset = marginLeftOffset + 10;
    if (i == 2) {
      marginTop = 15;
      initialOffset = 1075;
      marginLeftOffset = 55;
    }
  }
  typeValue = 0;
  labelType[i] = document.createElement("label");
  labelType[i].setAttribute("for", "spsbchkboxtype" + i);
  labelType[i].id = "spsblbltype" + i;
  labelType[i].innerHTML = SQUARE_TYPE_PAWN_PIECE.split("PIECE")[0] + ":";
  labelType[i].style.position = "absolute";
  labelType[i].style.marginTop = "15px";
  labelType[i].style.marginLeft = initialOffset + "px";
  initialOffset += 70;
  pieceTypeChkbox[i] = document.getElementById("spsbchkboxtype" + i);
  if (pieceTypeChkbox[i] != null && pieceTypeChkbox[i].checked) {
    typeValue = 1;
    if (pieceTypeFilter != "") virgAdd = ",";
    pieceTypeFilter += virgAdd + "[pc" + pieceColumnLookup[i] + "]";
  }
  document.querySelectorAll("[id=spsbchkboxtype" + i + "]").forEach((element) => {
    document.getElementById("container").removeChild(element);
  });
  document.querySelectorAll("[id=spsblbltype" + i + "]").forEach((element) => {
    document.getElementById("container").removeChild(element);
  });

  pieceTypeChkbox[i] = document.createElement("input");
  pieceTypeChkbox[i].type = "checkbox";
  pieceTypeChkbox[i].id = "spsbchkboxtype" + i;
  pieceTypeChkbox[i].style.position = "absolute";
  pieceTypeChkbox[i].style.marginTop = "18px";
  pieceTypeChkbox[i].style.marginLeft = initialOffset + "px";
  if (typeValue) {
    pieceTypeChkbox[i].checked = 1;
  }

  // Label seleção
  labelSelected = document.createElement("label");
  labelSelected.setAttribute("for", "spsbcheckslt");
  labelSelected.id = "spsblblcheck";
  labelSelected.innerHTML = "Seleção:";
  labelSelected.style.position = "absolute";
  labelSelected.style.marginTop = "10px";
  labelSelected.style.marginLeft = "1350px";
  // Checkbox Seleção
  checkSelected = document.getElementById("spsbcheckslt");
  typePieceSelected = false;
  if (checkSelected != null && checkSelected.checked) {
    typePieceSelected = checkSelected.checked;
  }
  document.querySelectorAll("[id=spsbcheckslt]").forEach((element) => {
    document.getElementById("container").removeChild(element);
  });
  document.querySelectorAll("[id=spsblblcheck]").forEach((element) => {
    document.getElementById("container").removeChild(element);
  });

  checkSelected = document.createElement("input");
  checkSelected.type = "checkbox";
  checkSelected.id = "spsbcheckslt";
  checkSelected.style.position = "absolute";
  checkSelected.style.marginTop = "13px";
  checkSelected.style.marginLeft = "1415px";
  if (typePieceSelected) checkSelected.checked = 1;

  checkSelected.addEventListener("change", drawSquareDetails);
  let sltd = "[sltd]";
  if (!typePieceSelected) {
    typePieceSelected = ":not([sltd])";
  } else {
    typePieceSelected = sltd;
  }

  filterDetails[FILTER_COLUMN] = columnVal;
  filterDetails[FILTER_ROW] = rowVal;
  filterDetails[FILTER_COLOR] = radioVal;
  filterDetails[FILTER_TYPE] = pieceTypeFilter;
  filterDetails[FILTER_SELECTED] = typePieceSelected;

  document.getElementById("container").appendChild(selectColumn);
  document.getElementById("container").appendChild(selectRow);
  document.getElementById("container").appendChild(radioElem[0]);
  document.getElementById("container").appendChild(radioLbl[0]);
  document.getElementById("container").appendChild(radioElem[1]);
  document.getElementById("container").appendChild(radioLbl[1]);
  document.getElementById("container").appendChild(radioElem[2]);
  document.getElementById("container").appendChild(radioLbl[2]);
  pieceTypeChkbox.map((val, ndx) => {
    document.getElementById("container").appendChild(labelType[ndx]);
    document.getElementById("container").appendChild(val);
  });
  if (selectType != -1 && selectType != null) {
    document.getElementById("container").appendChild(selectType);
  }
  if (checkSelected != -1 && checkSelected != null) {
    document.getElementById("container").appendChild(labelSelected);
    document.getElementById("container").appendChild(checkSelected);
  }
}
