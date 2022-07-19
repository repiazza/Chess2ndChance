// let gameBoard = [[],[],[],[],[],[],[],[]];
const LINE_SQUARE_COUNT = 8;
const COLUMN_SQUARE_ROW = 8;

const COLOR_NONE  = -1;
const COLOR_WHITE = 0;
const COLOR_BLACK = 1;

const SQUARE_SCAN = 1;
const FULL_SCAN   = 2;

const MOVEMENT_RANGE_BEGIN_SQUARE = 0;
const MOVEMENT_RANGE_END_SQUARE   = 1;

const SQUARE_ALPHABETICAL_NDX = 0;
const SQUARE_NUMERIC_NDX      = 1;

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

let columnMovementRange   = [];
let lineMovementRange     = [];
let diagonalMovementRange = [];
let LMovementSquares      = [];

const DIRECTION_COLUMN   = 0x01;
const DIRECTION_LINE     = 0x02;
const DIRECTION_DIAGONAL = 0x04;
const DIRECTION_L        = 0x08;
const SQUARE_RANGE       = 1;
const DOUBLE_SQUARE_RANGE= 2;
const L_RANGE            = 4;
const LINE_OF_SIGHT      = 8;

const PIECE_TYPE_ROOK    = 'R';
const PIECE_TYPE_KNIGHT  = 'N';
const PIECE_TYPE_BISHOP  = 'B';
const PIECE_TYPE_QUEEN   = 'Q';
const PIECE_TYPE_KING    = 'K';
const PIECE_TYPE_PAWN    = 'P';

const PIECE_COLOR_WHITE = 'W';
const PIECE_COLOR_BLACK = 'B';

function togglePlayerColor(){
    playerColorStatus = playerColorStatus ? 0 : 1;
}
function togglePlayerColorAndRedrawBoard(){
    playerColorStatus = playerColorStatus ? 0 : 1;
    redrawBoard();
}
function redrawBoard(){
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
                pieceMovementRange[i] = SQUARE_RANGE;
                break;
            case PIECE_TYPE_PAWN:
                pieceMovementType[i] |= DIRECTION_COLUMN;
                pieceMovementRange[i] = SQUARE_RANGE;
                break;
        }
    }
}

function movePiece(piece, originSquare, destinationSquare){
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
    let squareIndex = Number(squareName[SQUARE_NUMERIC_NDX]);
    if ( squareIndex < 1 || squareIndex > 8 )
        return false;
    
    return true;
}

function hasBlankSpace(squareName){
    if ( squareName == -1 )
        return false
    
    if ( isValidSquareIndex(squareName) == false )
        return false

    return (document.getElementById(squareName).innerHTML == "") ? true : false;
}
function colorMovementPath(movementType){
    if ( movementType & DIRECTION_LINE ){
        let lineNdx = lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_NUMERIC_NDX];
        let originColumn = columnArray.indexOf(lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]);
        let destColumn   = columnArray.indexOf(lineMovementRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]);
        let columnInterval = columnArray.slice(originColumn, destColumn);

        columnInterval.map(function(value){
            let squareId = "" + value + lineNdx;
            document.getElementById(squareId).classList.add("squarehl");
        });
    }
    if ( movementType & DIRECTION_COLUMN ){
        let columnChar = columnMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX];
        let lineNdx0 = Number(columnMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_NUMERIC_NDX]);
        let lineNdx1 = Number(columnMovementRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_NUMERIC_NDX]);
        
        let i = (lineNdx0 < lineNdx1) ? lineNdx0 : lineNdx1;
        let greaterLineVal = (lineNdx0 < lineNdx1) ? lineNdx1 : lineNdx0;

        for ( ; i <= greaterLineVal; i++ ){
            let squareId = "" + columnChar + i;
            document.getElementById(squareId).classList.add("squarehl");
        }
    }
    if ( movementType & DIRECTION_DIAGONAL ){
        let originColumn = columnArray.indexOf(mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]);
        let destColumn = columnArray.indexOf(mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]);
        let columnInterval = columnArray.slice(originColumn, destColumn);
        let columnChar = mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX];
        let lineNdx0 = Number(mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_NUMERIC_NDX]);
        let lineNdx1 = Number(mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_NUMERIC_NDX]);
        let i = lineNdx0 < lineNdx1 ? lineNdx0 : lineNdx1;
        let greaterLineVal = lineNdx0 < lineNdx1 ? lineNdx1 : lineNdx0;
        columnInterval.map(function(){
            for ( ; i <= greaterLineVal; i++ ){
                let squareId = "" + columnChar + i;
                document.getElementById(squareId).classList.add("squarehl");
            }
        });
    }
    if ( movementType & DIRECTION_L ){

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
        let lineNdx0 = Number(columnMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_NUMERIC_NDX]);
        let lineNdx1 = Number(columnMovementRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_NUMERIC_NDX]);

        // alert(lineNdx0 + " " + lineNdx1 + " " + Math.abs(lineNdx0-lineNdx1) + " " +  Number(myRange))
        
        return ( Number(myRange) >= Math.abs(lineNdx0-lineNdx1) ) ? true : false;
    }
    if ( movementType & DIRECTION_LINE ){
        let charNdx0 = columnArray.indexOf(lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_NUMERIC_NDX]);
        let charNdx1 = columnArray.indexOf(lineMovementRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_NUMERIC_NDX]);
        let columnInterval = columnArray.slice(charNdx0, charNdx1);
        return (columnInterval.length >= Number(myRange)) ?
                true : false;  
    }
}
// Alcance do movimento da peca
function getMovementRange(piece){
    let pieceNdx = pieceType.indexOf(piece[1]);
    return pieceMovementRange[pieceNdx];
}
// Direcoes que a peca anda
function getMovementType(piece){
    let pieceNdx = pieceType.indexOf(piece[1]);
    return pieceMovementType[pieceNdx];
}
function matchMovementDirection(pieceMovementType, direction){
    return (pieceMovementType & direction) ? true : false;
}
function getPieceLocation(piece){
    for ( let i = 1; i <= LINE_SQUARE_COUNT; i++ ){
        for( let j = 0; j < columnArray.length; j++ ){
            divId = "" + columnArray[j] + i; 
            // alert(divId);
            div = document.getElementById(divId)
            if ( div.innerHTML.includes(piece) )
                return divId;
        }
    }
    return false; 
}
function hasAnyMovementRange(piece){
    movType = getMovementType(piece);
    if ( matchMovementDirection(movType, DIRECTION_COLUMN) ){
        let lineNdx0 = Math.abs(Number(columnMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_NUMERIC_NDX]));
        let lineNdx1 = Math.abs(Number(columnMovementRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_NUMERIC_NDX]));
        if ( Math.abs(lineNdx0-lineNdx1) > 0 ){
            return true;
        }
    }
    return false;
}
function resetAllDirectionMovementRange(){
    columnMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE] = -1;
    columnMovementRange[MOVEMENT_RANGE_END_SQUARE]   = -1;

    lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE]   = -1;
    lineMovementRange[MOVEMENT_RANGE_END_SQUARE]     = -1;
    
    mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE]   = -1;
    mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE]     = -1;
    
    otherDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE]  = -1;
    otherDiagonalRange[MOVEMENT_RANGE_END_SQUARE]    = -1;
}
function scanMovementDirections(movementType, originSquare, piece, scanType){
    // const DIRECTION_COLUMN   = 0x01;
    // const DIRECTION_LINE     = 0x02;
    // const DIRECTION_DIAGONAL = 0x04;
    // const DIRECTION_L        = 0x08;
    let myColor = piece[0];
    let pieceNdx = pieceType.indexOf(piece[1]);
    let myLineIndex = Number(originSquare[SQUARE_NUMERIC_NDX]);
    let myFirstLineNdx = myLineIndex;
    let myMovType = movementType;
    let myColumnIndex = columnArray.indexOf(originSquare[SQUARE_ALPHABETICAL_NDX]);
    let nextTopLineAdder     = (myColor == PIECE_COLOR_WHITE) ?  1 : -1;
    let nextBottomLineAdder  = (myColor == PIECE_COLOR_WHITE) ? -1 :  1;
    let nextLeftColumnAdder  = (myColor == PIECE_COLOR_WHITE) ?  1 : -1;
    let nextRightColumnAdder = (myColor == PIECE_COLOR_WHITE) ? -1 :  1;
    let stillHasDirections;
    
    resetAllDirectionMovementRange();

    do {
        stillHasDirections = false
        if ( myMovType & DIRECTION_COLUMN ){
            stillHasDirections = true;
            
            let nextTopLine    = myLineIndex + nextTopLineAdder;
            let nextBottomLine = myLineIndex + nextBottomLineAdder;
            let nextTopSquareName    = originSquare[SQUARE_ALPHABETICAL_NDX] + nextTopLine;
            let nextBottomSquareName = originSquare[SQUARE_ALPHABETICAL_NDX] + nextBottomLine;
            let hadBlankSpaces = false;
            if ( scanType == FULL_SCAN ){
                let stillHasMovements = false;
                if ( Number(columnMovementRange[0]) == -1 )
                    columnMovementRange[0] = originSquare;
                if ( Number(columnMovementRange[1]) == -1 )
                    columnMovementRange[1] = originSquare;
                
                if ( piece[1] != PIECE_TYPE_PAWN && hasBlankSpace(nextBottomSquareName) ){
                    stillHasMovements = true;
                    columnMovementRange[0] = nextBottomSquareName;
                    nextBottomLineAdder++;
                }
                // alert(piece[1] + " " + hasBlankSpace(nextTopSquareName) + " "+ myColor + " " + myLineIndex);
                
                if ( hasBlankSpace(nextTopSquareName) ){
                    if ( piece[1] == PIECE_TYPE_PAWN && myColor == 'W' && myFirstLineNdx == 2 ){
                        pieceMovementRange[pieceNdx] = DOUBLE_SQUARE_RANGE;
                        nextTopSquareName = originSquare[0] + (Number(nextTopLine) + Number(nextTopLineAdder));
                        myFirstLineNdx++;
                    }
                    else if ( piece[1] == PIECE_TYPE_PAWN && myColor == 'B' && myFirstLineNdx == 7 ){
                        pieceMovementRange[pieceNdx] = DOUBLE_SQUARE_RANGE;
                        nextTopSquareName = originSquare[0] + (Number(nextTopLine) + Number(nextTopLineAdder));
                        myFirstLineNdx++;  
                    }
                    stillHasMovements = true;
                    columnMovementRange[1] = nextTopSquareName;
                    nextTopLineAdder++;
                    hadBlankSpaces = true;
                }
                
                if ( hasFullFilledRanged(DIRECTION_COLUMN, pieceMovementRange[pieceNdx]) ){
                    myMovType = myMovType ^ DIRECTION_COLUMN;
                    continue;
                }
                else if ( piece[1] == PIECE_TYPE_PAWN && nextTopSquareName && hadBlankSpaces == true ){
                    pieceMovementRange[pieceNdx] = SQUARE_RANGE;
                    hadBlankSpaces = false;
                }
                
                if ( stillHasMovements == false ){
                    myMovType = myMovType ^ DIRECTION_COLUMN;
                    continue;
                }

            }
            else if ( hasBlankSpace(nextTopSquareName)
                || hasBlankSpace(nextBottomSquareName) ){
                return true;
            }
        }
        else if ( myMovType & DIRECTION_LINE ){
            stillHasDirections = true;
            let nextLeftColumn  = myColumnIndex + nextLeftColumnAdder;
            let nextRightColumn = myColumnIndex + nextRightColumnAdder;
            let nextLeftSquareName  = (columnArray[nextLeftColumn] !== undefined) ?
                                       columnArray[nextLeftColumn] + originSquare[SQUARE_NUMERIC_NDX] :
                                       -1;
            let nextRightSquareName = (columnArray[nextRightColumn] !== undefined) ?
                                       columnArray[nextRightColumn] + originSquare[SQUARE_NUMERIC_NDX] :
                                       -1;
            if ( scanType == FULL_SCAN ){
                let stillHasMovements = false;
                if ( Number(lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE]) == -1 )
                    lineMovementRange = originSquare;
                if ( Number(lineMovementRange[MOVEMENT_RANGE_END_SQUARE]) == -1 )
                    lineMovementRange = originSquare;

                if ( hasBlankSpace(nextLeftSquareName) ){
                    stillHasMovements = true;
                    lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE] = nextLeftSquareName;
                    nextLeftColumnAdder++
                }
                if ( hasBlankSpace(nextRightSquareName) ){
                    stillHasMovements = true;
                    lineMovementRange[MOVEMENT_RANGE_END_SQUARE] = nextRightSquareName;
                    nextRightColumnAdder++
                }
                if ( stillHasMovements == false ){
                    myMovType = myMovType ^ DIRECTION_LINE;
                }
                alert("line:" + lineMovementRange);
            }
            else if ( hasBlankSpace(nextLeftSquareName)
                      || hasBlankSpace(nextRightSquareName) ){
                return true;
            }
        }
        else if ( myMovType & DIRECTION_DIAGONAL ){
            stillHasDirections = true;
            // Column offset
            let nextLeftColumn  = myColumnIndex + nextLeftColumnAdder;
            let nextRightColumn = myColumnIndex + nextRightColumnAdder;
            // Line Offset
            let nextTopLine    = myLineIndex + nextTopLineAdder;
            let nextBottomLine = myLineIndex + nextBottomLineAdder;
            // Destination Squares
            let nextTopLeftSquareName     = (columnArray[nextLeftColumn] !== undefined) ?
                                             columnArray[nextLeftColumn]  + nextTopLine :
                                             -1;
            let nextTopRightSquareName    = (columnArray[nextRightColumn] !== undefined) ?
                                             columnArray[nextRightColumn] + nextTopLine :
                                             -1;
            let nextBottomLeftSquareName  = (columnArray[nextLeftColumn] !== undefined) ?
                                             columnArray[nextLeftColumn] + nextBottomLine :
                                             -1; 
            let nextBottomRightSquareName = (columnArray[nextRightColumn] !== undefined) ?
                                             columnArray[nextRightColumn] + nextBottomLine:
                                             -1;
            if ( scanType == FULL_SCAN ){
                let stillHasMovements = false;
                // Main Diagonal
                let leftColumnAdderChanged  = 0;
                let topLineAdderChanged     = 0;
                let rightColumnAdderChanged = 0;
                let bottomLineAdderChanged  = 0;
                
                if ( Number(mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE]) == -1 )
                    mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE] = originSquare;
                if ( Number(mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE]) == -1 )
                    mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE]   = originSquare;

                if ( hasBlankSpace(nextTopLeftSquareName) ){
                    stillHasMovements = true;
                    mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE] = nextTopLeftSquareName;
                    nextLeftColumnAdder++; leftColumnAdderChanged = 1;
                    nextTopLineAdder++;    topLineAdderChanged = 1;
                }
                if ( hasBlankSpace(nextBottomRightSquareName) ){
                    stillHasMovements = true;
                    mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE] = nextBottomRightSquareName;
                    nextRightColumnAdder++; rightColumnAdderChanged = 1;
                    nextBottomLine++;       bottomLineAdderChanged = 1;
                }
                // other Diagonal
                if ( Number(otherDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE]) == -1 )
                    otherDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE] = originSquare;
                if ( Number(otherDiagonalRange[MOVEMENT_RANGE_END_SQUARE]) == -1 )
                    otherDiagonalRange[MOVEMENT_RANGE_END_SQUARE] = originSquare;

                if ( hasBlankSpace(nextBottomLeftSquareName) ){
                    stillHasMovements = true;
                    otherDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE] = nextBottomLeftSquareName;
                    // So incrementar se ja nao houve avanco anterior
                    nextBottomLineAdder += !bottomLineAdderChanged;
                    nextLeftColumnAdder += !leftColumnAdderChanged;
                }
                if ( hasBlankSpace(nextTopRightSquareName) ){
                    stillHasMovements = true;
                    otherDiagonalRange[MOVEMENT_RANGE_END_SQUARE] = nextTopRightSquareName;
                    nextRightColumnAdder += !rightColumnAdderChanged;
                    nextTopLineAdder     += !topLineAdderChanged;
                }
                if ( stillHasMovements == false ){
                    myMovType = myMovType ^ DIRECTION_DIAGONAL;
                }
            }
            else if ( hasBlankSpace(nextTopLeftSquareName)
                      || hasBlankSpace(nextTopRightSquareName)
                      || hasBlankSpace(nextBottomLeftSquareName)
                      || hasBlankSpace(nextBottomRightSquareName) ){
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

            stillHasDirections = true;
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
    } while( scanType == FULL_SCAN && stillHasDirections == true );

    if ( scanType == FULL_SCAN ){
        if ( hasAnyMovementRange(piece) == false )
            return false;

        return true;
    }

    return false;
}

// piece has possible movement on any of its own directions?
function pieceMovementIsPossible(piece, originSquare){
    return scanMovementDirections(getMovementType(piece), originSquare, piece, SQUARE_SCAN);
}
// set full movement range array 
function evaluatePieceMovementRange(piece, originSquare){
    return scanMovementDirections(getMovementType(piece), originSquare, piece, FULL_SCAN);
}
function isSquareOnMovementRange(squareId){
    let divSquare = document.querySelector('#' + squareId);
    return divSquare.getAttribute("class").includes('squarehl') ? 
            true : false;
}
function doMovePiece(piece, destinationSquare){
    var originSquare = getPieceLocation(piece);
    document.getElementById(originSquare).innerHTML = "";
    document.getElementById(destinationSquare).innerHTML = piece;
}

function selectEmptySquare(squareId){
    if ( pieceSelected == 0 )
        return;
    
    if ( isSquareOnMovementRange(squareId) == false ){
        $(".squarehl").removeClass("squarehl");
        pieceSelected = 0;
        return;
    }

    doMovePiece(pieceSelected, squareId);
    $(".squarehl").removeClass("squarehl");
    pieceSelected = 0;
    
    return;
}
function selectSquare(content, squareName){
    if ( content == "" ){
        return selectEmptySquare(squareName);
    }
    return selectPiece(content, squareName);
}
function selectPiece(piece, originSquare){
    if ( pieceMovementIsPossible(piece, originSquare) == false )
        return;

    evaluatePieceMovementRange(piece, originSquare);
    document.getElementById(originSquare).classList.add("squarehl");
    pieceSelected = piece;
    colorMovementPath(getMovementType(piece));
}

function deleteBoard(){
    $(".pieceSquare").remove();
}

function drawBoard() {
    let board = document.querySelector('.board');
    let style = getComputedStyle(board);
    let myWidth = style.width.split('p')[0];  // gets size before 'px' literal
    let myHeight = style.height.split('p')[0];// gets size before 'px' literal
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

function drawSinglePiece(squareName){
    let pawnColumn = columnArray[columnArray.indexOf(squareName[SQUARE_ALPHABETICAL_NDX])];
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