// let gameBoard = [[],[],[],[],[],[],[],[]];
const LINE_SQUARE_COUNT = 8;
const COLUMN_SQUARE_ROW = 8;
const COLOR_NONE  = -1;
const COLOR_WHITE = 0;
const COLOR_BLACK = 1;
const SQUARE_SCAN = 1;
const FULL_SCAN = 1;

let pieceSelected = 0;
let playerColor = ['white', 'black'];
let playerColorStatus = 0;
let columnArray = ['a','b','c','d','e','f','g','h'];
let initialRows = [1, 2, 7, 8];
//                             0    1    2    3   4   5    6    7
let highValuePieceNotation = ['R1','N1','B1','Q','K','B2','N2','R2'];
let lowValuePieceNotation  = ['Pa', 'Pb', 'Pc', 'Pd', 'Pe', 'Pf', 'Pg', 'Ph'];
let pieceType              = ['R', 'N', 'B', 'Q', 'K', 'P'];
//                        R N B Q K P
let pieceMovementType  = [0,0,0,0,0,0];
//                        R N B Q K P
let pieceMovementRange = [0,0,0,0,0,0];

let mainDiagonalRange  = [];
let otherDiagonalRange = [];

let columnMovementRange = [];
let lineMovementRange = [];
let diagonalMovementRange = [];
let LMovementSquares = [];

const DIRECTION_COLUMN   = 0x01;
const DIRECTION_LINE     = 0x02;
const DIRECTION_DIAGONAL = 0x04;
const DIRECTION_L        = 0x08;
const SQUARE_RANGE       = 2;
const DOUBLE_SQUARE_RANGE= 3;
const L_RANGE            = 4;
const LINE_OF_SIGHT      = 8;
const PIECE_TYPE_ROOK    = 'R';
const PIECE_TYPE_KNIGHT  = 'N';
const PIECE_TYPE_BISHOP  = 'B';
const PIECE_TYPE_QUEEN   = 'Q';
const PIECE_TYPE_KING    = 'K';
const PIECE_TYPE_PAWN    = 'P';


function togglePlayerColor(){
    playerColorStatus = playerColorStatus ? 0 : 1;
    deleteBoard();
    drawBoard();
}
// const DIRECTION_COLUMN   = 0x01;
// const DIRECTION_LINE     = 0x02;
// const DIRECTION_DIAGONAL = 0x04;
// const DIRECTION_L        = 0x08;
function initPieceMovements(){
    for ( i = 0; i < pieceType.length; i++ ){
        switch(pieceType[i]){
            case PIECE_TYPE_ROOK:
                pieceMovementType[i]  |= DIRECTION_COLUMN;
                pieceMovementType[i]  |= DIRECTION_LINE;
                pieceMovementRange[i] = LINE_OF_SIGHT;
                break;     
            case PIECE_TYPE_KNIGHT:
                pieceMovementType[i]  |= DIRECTION_L;
                pieceMovementRange[i] = L_RANGE; // 2 movements 4way expressed
                break;
            case PIECE_TYPE_BISHOP:
                pieceMovementType[i] |= DIRECTION_DIAGONAL;
                pieceMovementRange[i] = LINE_OF_SIGHT;
                break;
            case PIECE_TYPE_QUEEN:
                pieceMovementType[i] |= DIRECTION_COLUMN;
                pieceMovementType[i] |= DIRECTION_LINE;
                pieceMovementType[i] |= DIRECTION_DIAGONAL;
                pieceMovementRange[i] = LINE_OF_SIGHT;
                break;
            case PIECE_TYPE_KING:
                pieceMovementType[i] |= DIRECTION_COLUMN;
                pieceMovementType[i] |= DIRECTION_LINE;
                pieceMovementType[i] |= DIRECTION_DIAGONAL;
                pieceMovementRange[i] |= SQUARE_RANGE;
                break;
            case PIECE_TYPE_PAWN:
                pieceMovementType[i] |= DIRECTION_COLUMN;
                pieceMovementType[i] |= DIRECTION_DIAGONAL;
                pieceMovementRange[i] = SQUARE_RANGE;
                break;
        }
    }
}

function movePiece(piece, movingFrom, movingTo){
    switch(piece){
        case PIECE_TYPE_ROOK:
            break;     
        case PIECE_TYPE_KNIGHT:
            break;
        case PIECE_TYPE_BISHOP:
            break;
        case PIECE_TYPE_QUEEN:
            break;
        case PIECE_TYPE_KING:
            break;
        case PIECE_TYPE_PAWN:
            break;
    }
}

function isValidSquareIndex(squareName){
    let myIndex = Number(squareName[1]);
    if ( myIndex < 1 || myIndex > 8 )
        return false;
    
    return true;
}

function hasBlankSpace(squareName){
    if ( squareName == -1 )
        return false
    
    if ( isValidSquareIndex(squareName) == false )
        return false

    return document.getElementById(squareName).innerHTML == "" ? true : false;
}
// let columnMovementRange = [];
// let lineMovementRange = [];
// let diagonalMovementRange = [];
// let LMovementSquares = [];
function colorMovementPath(movementType){
    if ( movementType & DIRECTION_LINE ){
        let lineNdx = columnArray.indexOf(lineMovementRange[0][1]);
        let charNdx0 = columnArray.indexOf(lineMovementRange[0][0]);
        let charNdx1 = columnArray.indexOf(lineMovementRange[1][0]);
        let columnInterval = columnArray.slice(charNdx0, charNdx1);

        columnInterval.map(function(position,value){
            let squareId = "" + value + lineNdx;
            document.getElementById(squareId).classList.add("squarehl");
        });
    }
    if ( movementType & DIRECTION_COLUMN ){
        let columnChar = columnMovementRange[0][0];
        let lineNdx0 = Number(columnMovementRange[0][1]);
        let lineNdx1 = Number(columnMovementRange[1][1]);
        
        let i = (lineNdx0 < lineNdx1) ? lineNdx0 : lineNdx1;
        let greaterLineVal = (lineNdx0 < lineNdx1) ? lineNdx1 : lineNdx0;

        for ( ; i <= greaterLineVal; i++ ){
            let squareId = "" + columnChar + i;
            document.getElementById(squareId).classList.add("squarehl");
        }
    }
    if ( movementType & DIRECTION_DIAGONAL ){
        let charNdx0 = columnArray.indexOf(mainDiagonalRange[0][0]);
        let charNdx1 = columnArray.indexOf(mainDiagonalRange[1][0]);
        let columnInterval = columnArray.slice(charNdx0, charNdx1);
        let columnChar = mainDiagonalRange[1][0];
        let lineNdx0 = Number(mainDiagonalRange[0][1]);
        let lineNdx1 = Number(mainDiagonalRange[1][1]);
        let i = lineNdx0 < lineNdx1 ? lineNdx0 : lineNdx1;
        let greaterLineVal = lineNdx0 < lineNdx1 ? lineNdx1 : lineNdx0;
        columnInterval.map(function(){
            for ( ; i <= greaterLineVal; i++ ){
                let squareId = "" + columnChar + i;
                document.getElementById(squareId).classList.add("squarehl");
            }
        });
    }
    if ( movementType & DIRECTION_L){

    }
}
function hasFullFilledRanged(movementType, pieceRange){
    let myRange = 0;
    if ( pieceRange == SQUARE_RANGE )
        myRange = SQUARE_RANGE;
    else if ( pieceRange == DOUBLE_SQUARE_RANGE )
        myRange = DOUBLE_SQUARE_RANGE;
    else if ( pieceRange == LINE_OF_SIGHT )
        myRange = 8;

    if ( movementType & DIRECTION_COLUMN ){
        // alert(columnMovementRange + " " + myRange);
        let lineNdx0 = Number(columnMovementRange[0][1]);
        let lineNdx1 = Number(columnMovementRange[1][1]);
        return  (Math.abs(lineNdx0-lineNdx1) >= Number(myRange)) ?
                true : false;
    }
    if ( movementType & DIRECTION_LINE ){
        let charNdx0 = columnArray.indexOf(lineMovementRange[0][0]);
        let charNdx1 = columnArray.indexOf(lineMovementRange[1][0]);
        let columnInterval = columnArray.slice(charNdx0, charNdx1);
        return (columnInterval.length >= Number(myRange)) ?
                true : false;  
    }
}
// Alcance do movimento da peca
function getMovementRange(pieceType){
    let pieceNdx = pieceType.indexOf(piece[1]);
    return pieceMovementRange[pieceNdx];
}
// Direcoes que a peca anda
function getMovementType(pieceType){
    let pieceNdx = pieceType.indexOf(piece[1]);
    return pieceMovementType[pieceNdx];
}
function matchMovementDirection(pieceMovementType, direction){
    return (pieceMovementType & direction) ? true : false;
}
function getPieceLocation(piece){
    for ( let i = 0; i < LINE_SQUARE_COUNT; i++ ){
        for( let j = 0; j < COLUMN_SQUARE_ROW; j++ ){
            document.getElementById(toString(piece));
        }
    }
    return  
}
function scanMovementDirections(movementType, movingFrom, piece, scanType){
    // const DIRECTION_COLUMN   = 0x01;
    // const DIRECTION_LINE     = 0x02;
    // const DIRECTION_DIAGONAL = 0x04;
    // const DIRECTION_L        = 0x08;
    let myColor = piece[0];
    let pieceNdx = pieceType.indexOf(piece[1]);
    let myLineIndex = Number(movingFrom[1]);
    let myMovType = movementType;
    let myColumnIndex = columnArray.indexOf(movingFrom[0]);
    let nextTopLineAdder     = (myColor == 'W') ? 1 : -1;
    let nextBottomLineAdder  = (myColor == 'W') ? -1 : 1;
    let nextLeftColumnAdder  = (myColor == 'W') ? 1 : -1;
    let nextRightColumnAdder = (myColor == 'W') ? -1 : 1;
    let hasLeftDirections;
    columnMovementRange[0] = -1;
    columnMovementRange[1] = -1;
    lineMovementRange[0] = -1;
    lineMovementRange[1] = -1;
    mainDiagonalRange[0] = -1;
    mainDiagonalRange[1] = -1;
    otherDiagonalRange[0] = -1;
    otherDiagonalRange[1] = -1;
    do {
        hasLeftDirections = false
        if ( myMovType & DIRECTION_COLUMN ){
            hasLeftDirections = true;
            let nextTopLine  = myLineIndex + nextTopLineAdder;
            let nextBottomLine = myLineIndex + nextBottomLineAdder;
            let movingTop    = movingFrom[0] + nextTopLine;
            let movingBottom =  movingFrom[0] + nextBottomLine;
            if ( scanType == FULL_SCAN ){
                let hasLeftMovements = false;
                if ( Number(columnMovementRange[0]) == -1 )
                    columnMovementRange[0] = movingFrom;
                
                
                if ( piece[1] != 'P' && hasBlankSpace(movingBottom) ){
                    hasLeftMovements = true;
                    columnMovementRange[0] = movingBottom;
                    nextBottomLineAdder++;
                }
                // alert(piece[1] + " " + hasBlankSpace(movingTop) + " "+ myColor + " " + myLineIndex);
                
                if ( hasBlankSpace(movingTop) ){
                    if ( piece[1] != 'P' && myColor == 'W' && myLineIndex == 2 ){
                        pieceMovementRange[pieceNdx] = DOUBLE_SQUARE_RANGE;   
                    }
                    else if ( piece[1] != 'P' && myColor == 'B' && myLineIndex == 7 ){
                        pieceMovementRange[pieceNdx] = DOUBLE_SQUARE_RANGE;
                    }
                    hasLeftMovements = true;
                    columnMovementRange[1] = movingTop;
                    nextTopLineAdder++;
                }
                if ( hasFullFilledRanged(DIRECTION_COLUMN, pieceMovementRange[pieceNdx]) ){
                    myMovType = myMovType ^ DIRECTION_COLUMN;
                    continue;
                }
                
                if ( hasLeftMovements == false ){
                    myMovType = myMovType ^ DIRECTION_COLUMN;
                    continue;
                }

            }
            else if ( hasBlankSpace(movingTop)
                || hasBlankSpace(movingBottom) ){
                return true;
            }
        }
        else if ( myMovType & DIRECTION_LINE ){
            hasLeftDirections = true;
            let nextLeftColumn = myColumnIndex + nextLeftColumnAdder;
            let nextRightColumn = myColumnIndex + nextRightColumnAdder;
            let movingLeft   = (columnArray[nextLeftColumn] !== undefined) ?
                                columnArray[nextLeftColumn] + movingFrom[1] :
                                -1;
            let movingRight =  (columnArray[nextRightColumn] !== undefined) ?
                                columnArray[nextLeftColumn] + movingFrom[1] :
                                -1;
            if ( scanType == FULL_SCAN ){
                let hasLeftMovements = false;
                if ( Number(lineMovementRange[0]) == -1 )
                     lineMovementRange = movingFrom;
                if ( hasBlankSpace(movingLeft) ){
                    hasLeftMovements = true;
                    lineMovementRange[0] = movingLeft;
                    nextLeftColumnAdder++
                }
                if ( hasBlankSpace(movingRight) ){
                    hasLeftMovements = true;
                    lineMovementRange[1] = movingRight;
                    nextRightColumnAdder++
                }
                if ( hasLeftMovements == false ){
                    myMovType = myMovType ^ DIRECTION_LINE;
                }
                // alert("line:" + lineMovementRange);
            }
            else if ( hasBlankSpace(movingLeft)
                      || hasBlankSpace(movingRight) ){
                return true;
            }
        }
        else if ( myMovType & DIRECTION_DIAGONAL ){
            hasLeftDirections = true;
            let nextLeftColumn = myColumnIndex + nextLeftColumnAdder;
            let nextRightColumn = myColumnIndex + nextRightColumnAdder;
            let nextTopLine = myLineIndex + nextTopLineAdder;
            let nextBottomLine = myLineIndex + nextBottomLineAdder;
            let movingTopLeft = (columnArray[nextLeftColumn] !== undefined) ?
                                columnArray[nextLeftColumn] + nextTopLine :
                                -1
            let movingTopRight = (columnArray[nextRightColumn] !== undefined) ?
                                columnArray[nextRightColumn] + nextTopLine:
                                -1
            let movingBottomLeft = (columnArray[nextLeftColumn] !== undefined) ?
                                    columnArray[nextLeftColumn] + nextBottomLine :
                                    -1; 
            let movingBottomRight = (columnArray[nextRightColumn] !== undefined) ?
                                    columnArray[nextRightColumn] + nextBottomLine:
                                    -1;
            if ( scanType == FULL_SCAN ){
                let hasLeftMovements = false;
                // Main Diagonal
                let leftColumnAdderChanged = 0;
                let topLineAdderChanged = 0;
                let rightColumnAdderChanged = 0;
                let bottomLineAdderChanged = 0;
                if ( Number(mainDiagonalRange[0]) == -1 )
                    mainDiagonalRange = movingFrom;
                if ( hasBlankSpace(movingTopLeft) ){
                    hasLeftMovements = true;
                    mainDiagonalRange[0] = movingTopLeft;
                    nextLeftColumnAdder++; leftColumnAdderChanged = 1;
                    nextTopLineAdder++; topLineAdderChanged = 1;
                }
                if ( hasBlankSpace(movingBottomRight) ){
                    hasLeftMovements = true;
                    mainDiagonalRange[1] = movingBottomRight;
                    nextRightColumnAdder++; rightColumnAdderChanged = 1;
                    nextBottomLine++; bottomLineAdderChanged = 1;
                }
                // other Diagonal
                if ( Number(otherDiagonalRange[0]) == -1 )
                    otherDiagonalRange = movingFrom;
                if ( hasBlankSpace(movingBottomLeft) ){
                    hasLeftMovements = true;
                    otherDiagonalRange[0] = movingBottomLeft;
                    // So incrementar se ja nao houve avanco anterior
                    nextBottomLineAdder += !bottomLineAdderChanged;
                    nextLeftColumnAdder += !leftColumnAdderChanged;
                }
                if ( hasBlankSpace(movingTopRight) ){
                    hasLeftMovements = true;
                    otherDiagonalRange[1] = movingTopRight;
                    nextRightColumnAdder += !rightColumnAdderChanged;
                    nextTopLineAdder +=  !topLineAdderChanged
                }
                if ( hasLeftMovements == false ){
                    myMovType = myMovType ^ DIRECTION_DIAGONAL;
                }
            }
            else if ( hasBlankSpace(movingTopLeft)
                || hasBlankSpace(movingTopRight)
                || hasBlankSpace(movingBottomLeft)
                || hasBlankSpace(movingBottomRight) ){
                return true;
            }
        }    
        else if ( myMovType & DIRECTION_L ){
            // Movimento:
            //  Sprint(2 sq) no sentido do quadrante
            //  Turn (1 sq) nos sentido perpendiculares ao quadrante
            //  - Destino
            //    Movimentos nos quadrantes horizontais:
            //    deslocamento no array de letras valor de sprint
            //    deslocamento no eixo vertical no valor de turn

            hasLeftDirections = true;
            let nextBottomLine = myLineIndex + nextBottomLineAdder;
            let nextTopLine = myLineIndex + nextTopLineAdder;
            let nextLeftColumn = myColumnIndex + nextLeftColumnAdder;
            let nextRightColumn = myColumnIndex + nextRightColumnAdder;
            let turnMovementTop = nextTopLine;
            let turnMovementBottom = nextBottomLine;
            let turnMovementLeft = nextLeftColumn;
            let turnMovementRight = nextRightColumn;
            // Quadrante Left
            let sprintMovement     = nextLeftColumn + nextLeftColumnAdder;
            let leftZoneMoveTop    = columnArray[sprintMovement] + turnMovementTop
            let leftZoneMoveBottom = columnArray[sprintMovement] + turnMovementBottom
            // Quadrante Right
                sprintMovement     = nextRightColumn + nextRightColumnAdder;
            let rightZoneMoveTop    = columnArray[sprintMovement] + turnMovementTop
            let rightZoneMoveBottom = columnArray[sprintMovement] + turnMovementBottom
            // Quadrante Top
                sprintMovement     = nextTopLine + nextTopLineAdder;
            let topZoneMoveLeft    = columnArray[turnMovementLeft] + sprintMovement
            let topZoneMoveRight   = columnArray[turnMovementRight] + sprintMovement
            // Quadrante Bottom
            sprintMovement            = nextBottomLine + nextBottomLineAdder;
            let bottomZoneMoveLeft    = columnArray[turnMovementLeft] + sprintMovement
            let bottomZoneMoveRight   = columnArray[turnMovementRight] + sprintMovement
            if (   hasBlankSpace(leftZoneMoveTop)
                || hasBlankSpace(leftZoneMoveBottom)
                || hasBlankSpace(rightZoneMoveTop)
                || hasBlankSpace(rightZoneMoveBottom)
                || hasBlankSpace(topZoneMoveLeft)
                || hasBlankSpace(topZoneMoveRight)
                || hasBlankSpace(bottomZoneMoveLeft)
                || hasBlankSpace(bottomZoneMoveRight) 
            ){
                return true;
            }
        }
    } while( scanType == FULL_SCAN && hasLeftDirections == true );
    if ( scanType == FULL_SCAN )
        return true;

    return false;
}

function pieceMovementIsPossible(piece, movingFrom){
    // alert(piece[1]);
    let movementNdx = pieceType.indexOf(piece[1]);
    // alert("MovType: " + pieceMovementType[movementNdx] + " Origin: " + movingFrom + " Piece:" + piece);
    return scanMovementDirections(pieceMovementType[movementNdx], movingFrom, piece, SQUARE_SCAN);
    // switch(piece){
    //     case PIECE_TYPE_ROOK:
    //         return scanMovementDirections(pieceMovementType[movementNdx], movingFrom);
    //     case PIECE_TYPE_KNIGHT:
    //         return scanMovementDirections(
    //     case PIECE_TYPE_BISHOP:
    //         return scanMovementDirections(
    //     case PIECE_TYPE_QUEEN:
    //         return scanMovementDirections(
    //     case PIECE_TYPE_KING:
    //         return scanMovementDirections(
    //     case PIECE_TYPE_PAWN:
    //         return scanMovementDirections(
    // }
    return false;
}
function isSquareOnMovementRange(squareId){
    pieceSelected
}
function selectEmptySquare(squareId){
    if ( pieceSelected == 0 )
        return;
    
    if ( isSquareOnMovementRange(squareId) == false ){

    }
}
function selectSquare(content, squareName){
    if ( content != ""){
        return selectPiece(content, squareName)
    }

    return selectEmptySquare(squareName);
}
//background-blend-mode: screen;
//                         column+index
function selectPiece(piece, movingFrom){
    if ( pieceMovementIsPossible(piece, movingFrom) == false )
        return;

    document.getElementById(movingFrom).classList.add("squarehl");
    pieceSelected = piece;
    let movementNdx = pieceType.indexOf(piece[1]);
    colorMovementPath(pieceMovementType[movementNdx]);

    // switch(piece[1]){
    //     case PIECE_TYPE_ROOK:
    //         if ( pieceMovementIsPossible(piece, movingFrom) == false )
    //             return;
            
    //         document.getElementById(movingFrom).classList.add("squarehl");
    //         break;     
    //     case PIECE_TYPE_KNIGHT:
    //         break;
    //     case PIECE_TYPE_BISHOP:
    //         break;
    //     case PIECE_TYPE_QUEEN:
    //         break;
    //     case PIECE_TYPE_KING:
    //         break;
    //     case PIECE_TYPE_PAWN:
    //         if ( pieceMovementIsPossible(piece, movingFrom) == false )
    //             return;
            
    //         document.getElementById(movingFrom).classList.add("squarehl");
    //         break;
    // }
}

function deleteBoard(){
    // divsPieceSquare = document.getElementsByClassName('pieceSquare');
    // for ( let i = 0; typeof(divsPieceSquare[i]) == 'undefined' ; i++ ){
    //     if ( !columnArray.contains(divsPieceSquare[i].id[0]) )
    //         continue;

    //     divsPieceSquare[i].remove();
    // }
    $(".pieceSquare").remove();
}

function drawBoard() {
    let board = document.querySelector('.board');
    let style = getComputedStyle(board);
    let myWidth = style.width.split('p')[0];
    let myHeight = style.height.split('p')[0];
    let iSquareWidth = myWidth / 8;
    let iSquareHeight = myHeight / 8;
    let sqMarginLeft = 0;
    let sqMarginTop = 0;
    let rowNumber = 0;
    let columnChar = 'a';
    let rowColorToggle = true;
    for ( let i = 0; i < LINE_SQUARE_COUNT; i++ ){
        for( let j = 0; j < COLUMN_SQUARE_ROW; j++ ){
            var divSquare = document.createElement('div');
            if ( j%2 != rowColorToggle ) 
                divSquare.style.backgroundColor = 'rgba(221,160,221,0.5)';
            else
                divSquare.style.backgroundColor = 'rgba(128,0,128, 0.3)';
                
            divSquare.style.width  = iSquareWidth;
            divSquare.style.height = iSquareHeight;
            divSquare.style.position = 'absolute';
            divSquare.style.marginLeft = sqMarginLeft;
            divSquare.style.marginTop = sqMarginTop;
            divSquare.classList.add('pieceSquare');
            if (playerColor[playerColorStatus] == 'white') {
                 rowNumber = LINE_SQUARE_COUNT - i
                 columnChar = columnArray[j];
            }
            else{
                rowNumber = i + 1;
                columnChar = columnArray[(COLUMN_SQUARE_ROW - j - 1)];
            }
            divSquare.id = "" + columnChar + rowNumber;
            board.appendChild(divSquare);
            divSquare = document.getElementById(divSquare.id);
            if ( initialRows.includes(rowNumber) ){
                // drawSinglePiece(divSquare.id);
                let pieceColorDrew = drawSinglePiece(divSquare.id);
                if ( pieceColorDrew == playerColorStatus ){
                    //                                              piece           sq
                    divSquare.setAttribute("onclick", "selectSquare(this.innerHTML, this.id)");
                }
            }
            else{
                divSquare.setAttribute("onclick", "selectSquare(this.innerHTML, this.id)");
            }
            sqMarginLeft += iSquareWidth;
        }
        sqMarginTop += iSquareHeight;
        sqMarginLeft = 0;
        rowColorToggle = !rowColorToggle;
    }
}
// function drawPieces(){
//     if ( playerColor[playerColorStatus] == 'white' )
//         drawWhite();
//     else
//         drawBlack();
    
//     playerColor = (playerColor == 'white') ? 'white' : 'black';
// }
// function drawWhite(){
//     for ( let i = 0; i < LINE_SQUARE_COUNT; i++ ){
//         for( let j = 0; j < COLUMN_SQUARE_ROW; j++ ){
            
//         }
//     }
// }
function drawSinglePiece(squareName){
    // if 
    // (
    //     !toString(squareName).includes("1") &&
    //     !toString(squareName).includes("2") &&
    //     !toString(squareName).includes("7") &&
    //     !toString(squareName).includes("8")
    // )
    //     return -1;
    
    let pawnColumn = columnArray[columnArray.indexOf(squareName[0])];
    if ( squareName.includes("2") ){
        document.getElementById(squareName).innerHTML = "WP" + pawnColumn;
        return COLOR_WHITE;
    }
    if ( squareName.includes("7") ){
        document.getElementById(squareName).innerHTML = "BP" + pawnColumn;
        return COLOR_BLACK;
    }
    // let pieceName = ""; 
    for ( i = 0 ; i < columnArray.length; i++ ){
        if ( squareName.includes(columnArray[i]) ){
            let pieceColor = squareName.includes("1") ? "W" : "B";
            document.getElementById(squareName).innerHTML = "" + pieceColor + highValuePieceNotation[i];
            pieceName = "" + pieceColor + highValuePieceNotation[i];
            // document.getElementById(squareName).innerHTML =
            // "<img src='" + pieceName + ".png'>"
            return (pieceColor == "W") ? COLOR_WHITE : COLOR_BLACK;
        }
    }
    return COLOR_NONE;
}
$(document).ready(function () {
    initPieceMovements();
    drawBoard();
});