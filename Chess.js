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

const PIECE_COLOR_INDEX = 0; // B or W
const PIECE_TYPE_INDEX = 1;  // R N B Q K P
const PIECE_COMPLEMENT_IDENTIFIER_INDEX = 2; // Column or Sequence 

const DIRECTION_COLUMN   = 0x01;
const DIRECTION_LINE     = 0x02;
const DIRECTION_DIAGONAL = 0x04;
const DIRECTION_L        = 0x08;
const DIRECTION_ALL      = DIRECTION_COLUMN | DIRECTION_LINE | DIRECTION_DIAGONAL | DIRECTION_L;
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

function togglePlayerColor(){
    playerColorStatus = playerColorStatus ? 0 : 1;
}
function togglePlayerColorAndRedrawBoard(){
    if ( !confirm('ATENÇÃO! Inverter as cores? (todo progresso será perdido)') )
        return;

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
    if ( squareIndex < 1 || squareIndex > 8 || isNaN(squareIndex) )
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
        
        let originColumn   = columnArray.indexOf(lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]);
        let destColumn     = columnArray.indexOf(lineMovementRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]);
        let columnInterval = ( originColumn <= destColumn ) ? 
                              columnArray.slice(originColumn, destColumn+1) :
                              columnArray.slice(destColumn, originColumn+1) ;
        
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
        let mainDiagColumnInterval = ( originColumn <= destColumn ) ? 
                               columnArray.slice(originColumn, destColumn+1) :
                               columnArray.slice(destColumn, originColumn+1) ;
        let mainDiagLineNdx = mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_NUMERIC_NDX];

        mainDiagColumnInterval.map(function(value){
            let squareId = "" + value + mainDiagLineNdx;
            document.getElementById(squareId).classList.add("squarehl");
            mainDiagLineNdx--;
        });

        originColumn = columnArray.indexOf(otherDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]);
        destColumn = columnArray.indexOf(otherDiagonalRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]);
        let otherDiagColumnInterval = ( originColumn <= destColumn ) ? 
                               columnArray.slice(originColumn, destColumn+1) :
                               columnArray.slice(destColumn, originColumn+1) ;
        let otherDiagLineNdx = otherDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_NUMERIC_NDX];
        
        otherDiagColumnInterval.map(function(value){
            let squareId = "" + value + otherDiagLineNdx;
            document.getElementById(squareId).classList.add("squarehl");
            otherDiagLineNdx++;
        });
        
    }
    if ( movementType & DIRECTION_L ){
        LMovementSquares.map(function(value){
            if ( isValidSquareIndex(value))
                document.getElementById(value).classList.add("squarehl");
        });
    }
}
function hasFullFilledRange(movementType, pieceRange){
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
        
        return ( Math.abs(lineNdx0-lineNdx1) >= Number(myRange) ) ? true : false;
    }
    if ( movementType & DIRECTION_LINE ){
        let originColumn = columnArray.indexOf(lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]);
        let destColumn = columnArray.indexOf(lineMovementRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]);
        let columnInterval = ( originColumn <= destColumn ) ? 
                                columnArray.slice(originColumn, destColumn+1) :
                                columnArray.slice(destColumn, originColumn+1) ;
                                
        return (columnInterval.length >= Number(myRange)) ?
                true : false;  
    }
    if ( movementType & DIRECTION_DIAGONAL ){
        let originColumn = columnArray.indexOf(mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]);
        let destColumn = columnArray.indexOf(mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]);
        let mainDiagColumnInterval = ( originColumn <= destColumn ) ? 
                                       columnArray.slice(originColumn, destColumn+1) :
                                       columnArray.slice(destColumn, originColumn+1) ;
        let hasFullFilledMain = (mainDiagColumnInterval.length >= Number(myRange));

        originColumn = columnArray.indexOf(otherDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]);
        destColumn = columnArray.indexOf(otherDiagonalRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]);
        let otherDiagColumnInterval = ( originColumn <= destColumn ) ? 
                               columnArray.slice(originColumn, destColumn+1) :
                               columnArray.slice(destColumn, originColumn+1) ;
        let hasFullFilledOther = (otherDiagColumnInterval.length >= Number(myRange));
        
        return (hasFullFilledMain && hasFullFilledOther) ? true : false;
    }
}
// Alcance do movimento da peca
function getMovementRange(piece){
    let pieceNdx = pieceType.indexOf(piece[PIECE_TYPE_INDEX]);
    return pieceMovementRange[pieceNdx];
}
// Direcoes que a peca anda
function getMovementType(piece){
    let pieceNdx = pieceType.indexOf(piece[PIECE_TYPE_INDEX]);
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
    if ( matchMovementDirection(movType, DIRECTION_LINE) ){
        let originColumn = columnArray.indexOf(lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]);
        let destColumn = columnArray.indexOf(lineMovementRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]);
        let columnInterval = ( originColumn <= destColumn ) ? 
                              columnArray.slice(originColumn, destColumn+1) :
                              columnArray.slice(destColumn, originColumn+1) ;
        if ( columnInterval.length > 1 ){
            return true;
        }
    }
    if ( matchMovementDirection(movType, DIRECTION_DIAGONAL) ){
        let originColumn = columnArray.indexOf(mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]);
        let destColumn = columnArray.indexOf(mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]);
        let mainDiagonalInterval = ( originColumn <= destColumn ) ? 
                              columnArray.slice(originColumn, destColumn+1) :
                              columnArray.slice(destColumn, originColumn+1) ;
        if ( mainDiagonalInterval.length > 1 ){
            return true;
        }
        originColumn = columnArray.indexOf(otherDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE][SQUARE_ALPHABETICAL_NDX]);
        destColumn = columnArray.indexOf(otherDiagonalRange[MOVEMENT_RANGE_END_SQUARE][SQUARE_ALPHABETICAL_NDX]);
        let otherDiagonalInterval = ( originColumn <= destColumn ) ? 
                              columnArray.slice(originColumn, destColumn+1) :
                              columnArray.slice(destColumn, originColumn+1) ;
        if ( otherDiagonalInterval.length > 1 ){
            return true;
        }
    }
    if ( matchMovementDirection(movType, DIRECTION_L) ){
        return (LMovementSquares[0] != -1) ? true : false;
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

const TOP_OFFSET = 1;
const BOT_OFFSET = 2;
const LFT_OFFSET = 3;
const RGT_OFFSET = 4;

function setMovOffset(movementOrientation, pieceColor){
    switch ( movementOrientation ){
        case TOP_OFFSET:
            return (pieceColor == PIECE_COLOR_WHITE) ? 1 : -1;
        case BOT_OFFSET:
            return (pieceColor == PIECE_COLOR_WHITE) ? -1 : 1;
        case LFT_OFFSET:
            return (pieceColor == PIECE_COLOR_WHITE) ? -1 : 1;
        case RGT_OFFSET:
            return (pieceColor == PIECE_COLOR_WHITE) ? 1 : -1;
    }
    return 0;
}

function movementMatchesAnyDirection(movementType){
    return (movementType & DIRECTION_ALL) ? true : false;
}

function scanMovementDirections(movementType, originSquare, piece, scanType){
    // const DIRECTION_COLUMN   = 0x01;
    // const DIRECTION_LINE     = 0x02;
    // const DIRECTION_DIAGONAL = 0x04;
    // const DIRECTION_L        = 0x08;
    let myColor        = piece[PIECE_COLOR_INDEX];
    let pieceNdx       = pieceType.indexOf(piece[PIECE_TYPE_INDEX]);
    let myLineIndex    = Number(originSquare[SQUARE_NUMERIC_NDX]);
    let myFirstLineNdx = myLineIndex;
    let myMovType      = movementType;
    let myColumnIndex  = columnArray.indexOf(originSquare[SQUARE_ALPHABETICAL_NDX]);
    let nextTopLineOffset     = setMovOffset(TOP_OFFSET, myColor);
    let nextBottomLineOffset  = setMovOffset(BOT_OFFSET, myColor);
    let nextLeftColumnOffset  = setMovOffset(LFT_OFFSET, myColor);
    let nextRightColumnOffset = setMovOffset(RGT_OFFSET, myColor);
    
    resetAllDirectionMovementRange();
    
    do {
        if ( matchMovementDirection(myMovType, DIRECTION_COLUMN) ){
            let nextTopLine    = myLineIndex + nextTopLineOffset;
            let nextBottomLine = myLineIndex + nextBottomLineOffset;
            let nextTopSquareName    = originSquare[SQUARE_ALPHABETICAL_NDX] + nextTopLine;
            let nextBottomSquareName = originSquare[SQUARE_ALPHABETICAL_NDX] + nextBottomLine;
            let hadBlankSpaces = false;
            
            if ( scanType == FULL_SCAN ){
                let stillHasMovements = false;
                if ( Number(columnMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE]) == -1 )
                    columnMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE] = originSquare;
                if ( Number(columnMovementRange[MOVEMENT_RANGE_END_SQUARE]) == -1 )
                    columnMovementRange[MOVEMENT_RANGE_END_SQUARE] = originSquare;
                
                if ( hasBlankSpace(nextBottomSquareName) && piece[PIECE_TYPE_INDEX] != PIECE_TYPE_PAWN ){
                    stillHasMovements = true;
                    columnMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE] = nextBottomSquareName;
                    nextBottomLineOffset += setMovOffset(BOT_OFFSET, myColor);  
                }
                if ( hasBlankSpace(nextTopSquareName) ){
                    if ( (piece[PIECE_TYPE_INDEX] == PIECE_TYPE_PAWN && myColor == 'W' && myFirstLineNdx == 2) 
                         || (piece[PIECE_TYPE_INDEX] == PIECE_TYPE_PAWN && myColor == 'B' && myFirstLineNdx == 7) ){
                        pieceMovementRange[pieceNdx] = DOUBLE_SQUARE_RANGE;
                        nextTopSquareName = originSquare[SQUARE_ALPHABETICAL_NDX] + (Number(nextTopLine) + Number(nextTopLineOffset));
                        myFirstLineNdx++;
                    }
                    else if ( piece[PIECE_TYPE_INDEX] == PIECE_TYPE_PAWN ){
                        pieceMovementRange[pieceNdx] = SQUARE_RANGE;
                        hadBlankSpaces = false;
                    }
                    stillHasMovements = true;
                    columnMovementRange[MOVEMENT_RANGE_END_SQUARE] = nextTopSquareName;
                    nextTopLineOffset += setMovOffset(TOP_OFFSET, myColor);
                    hadBlankSpaces = true;
                }
                
                if ( hasFullFilledRange(DIRECTION_COLUMN, pieceMovementRange[pieceNdx]) ){
                    myMovType = myMovType ^ DIRECTION_COLUMN;
                    nextTopLineOffset     = setMovOffset(TOP_OFFSET, myColor);
                    nextBottomLineOffset  = setMovOffset(BOT_OFFSET, myColor);
                    continue;
                }

                if ( stillHasMovements == false ){
                    myMovType = myMovType ^ DIRECTION_COLUMN;
                    nextTopLineOffset     = setMovOffset(TOP_OFFSET, myColor);
                    nextBottomLineOffset  = setMovOffset(BOT_OFFSET, myColor);
                    continue;
                }

            }
            else if ( hasBlankSpace(nextTopSquareName)
                      || hasBlankSpace(nextBottomSquareName) ){
                return true;
            }
            else{
                myMovType = myMovType ^ DIRECTION_COLUMN;
                continue;
            }
        }
        else if ( matchMovementDirection(myMovType, DIRECTION_LINE) ){
            let nextLeftColumn  = myColumnIndex + nextLeftColumnOffset;
            let nextRightColumn = myColumnIndex + nextRightColumnOffset;
            let nextLeftSquareName  = (columnArray[nextLeftColumn] !== undefined) ?
                                       columnArray[nextLeftColumn] + originSquare[SQUARE_NUMERIC_NDX] :
                                       -1;
            let nextRightSquareName = (columnArray[nextRightColumn] !== undefined) ?
                                       columnArray[nextRightColumn] + originSquare[SQUARE_NUMERIC_NDX] :
                                       -1;
            if ( scanType == FULL_SCAN ){
                let stillHasMovements = false;
                if ( Number(lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE]) == -1 )
                    lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE] = originSquare;
                if ( Number(lineMovementRange[MOVEMENT_RANGE_END_SQUARE]) == -1 )
                    lineMovementRange[MOVEMENT_RANGE_END_SQUARE]   = originSquare;

                if ( hasBlankSpace(nextLeftSquareName) ){
                    stillHasMovements = true;
                    lineMovementRange[MOVEMENT_RANGE_BEGIN_SQUARE] = nextLeftSquareName;
                    nextLeftColumnOffset += setMovOffset(LFT_OFFSET, myColor);
                }
                if ( hasBlankSpace(nextRightSquareName) ){
                    stillHasMovements = true;
                    lineMovementRange[MOVEMENT_RANGE_END_SQUARE]   = nextRightSquareName;
                    nextRightColumnOffset += setMovOffset(RGT_OFFSET, myColor);
                }
                if ( hasFullFilledRange(DIRECTION_LINE, pieceMovementRange[pieceNdx]) || stillHasMovements == false ){
                    myMovType = myMovType ^ DIRECTION_LINE;
                    nextLeftColumnOffset  = setMovOffset(LFT_OFFSET, myColor);
                    nextRightColumnOffset = setMovOffset(RGT_OFFSET, myColor);
                    continue;
                }
            }
            else if ( hasBlankSpace(nextLeftSquareName)
                      || hasBlankSpace(nextRightSquareName) ){
                return true;
            }
            else{
                myMovType = myMovType ^ DIRECTION_LINE;
                continue;
            }
        }
        else if ( matchMovementDirection(myMovType, DIRECTION_DIAGONAL) ){
            // Column offset
            let nextLeftColumn  = myColumnIndex + nextLeftColumnOffset;
            let nextRightColumn = myColumnIndex + nextRightColumnOffset;
            // Line Offset
            let nextTopLine    = myLineIndex + nextTopLineOffset;
            let nextBottomLine = myLineIndex + nextBottomLineOffset;
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
            // alert("main : " + mainDiagonalRange);
            // alert("other: " + otherDiagonalRange);
            // alert("NLCO:" + nextLeftColumnOffset + " NRCO:" + nextRightColumnOffset + " NTLO:" + nextTopLineOffset + " NBLO:" + nextBottomLineOffset);
            // alert("NLC:" + nextLeftColumn + " NRC:" + nextRightColumn + " NTL:" + nextTopLine + " NBL:" + nextBottomLine);
            // alert("TL:" + nextTopLeftSquareName + " TR:" + nextTopRightSquareName + " BL:" + nextBottomLeftSquareName + " BR:" + nextBottomRightSquareName);
            if ( scanType == FULL_SCAN ){
                let stillHasMovements = false;
                let leftColumnOffsetChanged  = 0;
                let bottomLineOffsetChanged  = 0;
                let rightColumnOffsetChanged = 0;
                let topLineOffsetChanged     = 0;
                //
                // main Diagonal
                //
                if ( Number(mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE]) == -1 )
                    mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE] = originSquare;
                if ( Number(mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE]) == -1 )
                    mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE]   = originSquare;

                if ( hasBlankSpace(nextTopLeftSquareName) && !mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE].includes("#") ){
                    stillHasMovements = true;
                    mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE] = nextTopLeftSquareName;
                    nextLeftColumnOffset += setMovOffset(LFT_OFFSET, myColor);  
                    nextTopLineOffset    += setMovOffset(TOP_OFFSET, myColor);
                    leftColumnOffsetChanged = 1;
                    topLineOffsetChanged    = 1;
                }
                else{
                    mainDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE] += '#';
                }
                if ( hasBlankSpace(nextBottomRightSquareName) && !mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE].includes("#") ){
                    stillHasMovements = true;
                    mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE] = nextBottomRightSquareName;
                    nextRightColumnOffset += setMovOffset(RGT_OFFSET, myColor); 
                    nextBottomLineOffset  += setMovOffset(BOT_OFFSET, myColor); 
                    rightColumnOffsetChanged = 1;
                    bottomLineOffsetChanged  = 1;
                }
                else {
                    mainDiagonalRange[MOVEMENT_RANGE_END_SQUARE] += '#';
                }
                //
                // other Diagonal
                //
                if ( Number(otherDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE]) == -1 )
                    otherDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE] = originSquare;
                if ( Number(otherDiagonalRange[MOVEMENT_RANGE_END_SQUARE]) == -1 )
                    otherDiagonalRange[MOVEMENT_RANGE_END_SQUARE]   = originSquare;

                if ( hasBlankSpace(nextBottomLeftSquareName) && !otherDiagonalRange[MOVEMENT_RANGE_END_SQUARE].includes("#") ){
                    stillHasMovements = true;
                    otherDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE] = nextBottomLeftSquareName;
                    // So incrementar se ja nao houve avanco anterior
                    nextLeftColumnOffset += leftColumnOffsetChanged ? 0 : setMovOffset(LFT_OFFSET, myColor);
                    nextBottomLineOffset += bottomLineOffsetChanged ? 0 : setMovOffset(BOT_OFFSET, myColor);
                }
                else{
                    otherDiagonalRange[MOVEMENT_RANGE_BEGIN_SQUARE] += '#';
                }
                if ( hasBlankSpace(nextTopRightSquareName) && !otherDiagonalRange[MOVEMENT_RANGE_END_SQUARE].includes("#") ){
                    stillHasMovements = true;
                    otherDiagonalRange[MOVEMENT_RANGE_END_SQUARE] = nextTopRightSquareName;
                    // So incrementar se ja nao houve avanco anterior
                    nextRightColumnOffset += rightColumnOffsetChanged ? 0 : setMovOffset(RGT_OFFSET, myColor);
                    nextTopLineOffset     += topLineOffsetChanged     ? 0 : setMovOffset(TOP_OFFSET, myColor);
                }
                else{
                    otherDiagonalRange[MOVEMENT_RANGE_END_SQUARE] += '#';
                }
                if ( hasFullFilledRange(DIRECTION_DIAGONAL, pieceMovementRange[pieceNdx]) || stillHasMovements == false ){
                    myMovType = myMovType ^ DIRECTION_DIAGONAL;
                    nextTopLineOffset     = setMovOffset(TOP_OFFSET, myColor);
                    nextBottomLineOffset  = setMovOffset(BOT_OFFSET, myColor);
                    nextLeftColumnOffset  = setMovOffset(LFT_OFFSET, myColor);
                    nextRightColumnOffset = setMovOffset(RGT_OFFSET, myColor);
                    continue;
                }
            }
            else if ( hasBlankSpace(nextTopLeftSquareName)
                      || hasBlankSpace(nextTopRightSquareName)
                      || hasBlankSpace(nextBottomLeftSquareName)
                      || hasBlankSpace(nextBottomRightSquareName) ){
                return true;
            }
            else{
                myMovType = myMovType ^ DIRECTION_DIAGONAL;
                nextTopLineOffset     = setMovOffset(TOP_OFFSET, myColor);
                nextBottomLineOffset  = setMovOffset(BOT_OFFSET, myColor);
                nextLeftColumnOffset  = setMovOffset(LFT_OFFSET, myColor);
                nextRightColumnOffset = setMovOffset(RGT_OFFSET, myColor);
                continue;
            }
        }    
        else if ( matchMovementDirection(myMovType, DIRECTION_L) ){
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
            let sprintMovement     = nextLeftColumn + nextLeftColumnOffset;
            let leftZoneMoveTop    = (columnArray[sprintMovement] !== undefined) ?
                                      columnArray[sprintMovement] + turnMovementTop:
                                      -1;
            let leftZoneMoveBottom = (columnArray[sprintMovement] !== undefined) ?
                                      columnArray[sprintMovement] + turnMovementBottom:
                                      -1;
            // Quadrante Right
                sprintMovement      = nextRightColumn + nextRightColumnOffset;
            let rightZoneMoveTop    = (columnArray[sprintMovement] !== undefined) ?
                                       columnArray[sprintMovement] + turnMovementTop:
                                       -1;
            let rightZoneMoveBottom = (columnArray[sprintMovement] !== undefined) ?
                                       columnArray[sprintMovement] + turnMovementBottom:
                                       -1;
            // Quadrante Top
                sprintMovement     = nextTopLine + nextTopLineOffset;
            let topZoneMoveLeft    = (columnArray[turnMovementLeft] !== undefined) ?
                                      columnArray[turnMovementLeft] + sprintMovement:
                                      -1;
            let topZoneMoveRight   = (columnArray[turnMovementRight] !== undefined) ?
                                      columnArray[turnMovementRight] + sprintMovement:
                                      -1;
            // Quadrante Bottom
            sprintMovement            = nextBottomLine + nextBottomLineOffset;
            let bottomZoneMoveLeft    = (columnArray[turnMovementLeft] !== undefined) ?
                                         columnArray[turnMovementLeft] + sprintMovement:
                                         -1;
            let bottomZoneMoveRight   = (columnArray[turnMovementRight] !== undefined) ?
                                         columnArray[turnMovementRight] + sprintMovement:
                                         -1;

            // alert("LzmT:" + leftZoneMoveTop + " LzmB:" + leftZoneMoveBottom);
            // alert("RzmT:" + rightZoneMoveTop + " RzmB:" + rightZoneMoveBottom);
            // alert("TzmL:" + topZoneMoveLeft + " TzmR:" + topZoneMoveRight);
            // alert("BzmL:" + bottomZoneMoveLeft + " BzmR:" + bottomZoneMoveRight);

            if ( scanType == FULL_SCAN ){
                let LSquareMovementCtr = 0;             
                if ( hasBlankSpace(leftZoneMoveTop) )
                    LMovementSquares[LSquareMovementCtr++] = leftZoneMoveTop;
                if ( hasBlankSpace(leftZoneMoveBottom) )
                    LMovementSquares[LSquareMovementCtr++] = leftZoneMoveBottom;    
                if ( hasBlankSpace(rightZoneMoveTop) )
                    LMovementSquares[LSquareMovementCtr++] = rightZoneMoveTop;
                if ( hasBlankSpace(rightZoneMoveBottom) )
                    LMovementSquares[LSquareMovementCtr++] = rightZoneMoveBottom;
                if ( hasBlankSpace(topZoneMoveLeft) )
                    LMovementSquares[LSquareMovementCtr++] = topZoneMoveLeft;
                if ( hasBlankSpace(topZoneMoveRight) )
                    LMovementSquares[LSquareMovementCtr++] = topZoneMoveRight;
                if ( hasBlankSpace(bottomZoneMoveLeft) )
                    LMovementSquares[LSquareMovementCtr++] = bottomZoneMoveLeft;
                if ( hasBlankSpace(bottomZoneMoveRight) )
                    LMovementSquares[LSquareMovementCtr++] = bottomZoneMoveRight;

                myMovType = myMovType ^ DIRECTION_L;
                nextTopLineOffset     = setMovOffset(TOP_OFFSET, myColor);
                nextBottomLineOffset  = setMovOffset(BOT_OFFSET, myColor);
                nextLeftColumnOffset  = setMovOffset(LFT_OFFSET, myColor);
                nextRightColumnOffset = setMovOffset(RGT_OFFSET, myColor);

                // alert(LMovementSquares);
            }
            else if ( hasBlankSpace(leftZoneMoveTop)
                      || hasBlankSpace(leftZoneMoveBottom)
                      || hasBlankSpace(rightZoneMoveTop)
                      || hasBlankSpace(rightZoneMoveBottom)
                      || hasBlankSpace(topZoneMoveLeft)
                      || hasBlankSpace(topZoneMoveRight)
                      || hasBlankSpace(bottomZoneMoveLeft)
                      || hasBlankSpace(bottomZoneMoveRight) ){
                return true;
            }
        }
    } while( movementMatchesAnyDirection(myMovType) );

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

    clearActiveSelection();
    evaluatePieceMovementRange(piece, originSquare);
    document.getElementById(originSquare).classList.add("squarehl");
    pieceSelected = piece;
    colorMovementPath(getMovementType(piece));
}
function clearActiveSelection(){
    $(".squarehl").removeClass("squarehl");
    pieceSelected = 0;
    return;
}

function deleteBoard(){
    $(".pieceSquare").remove();
}

function drawBoard() {
    let board = document.querySelector('.board');
    let style = getComputedStyle(board);
    let myWidth  = style.width.split('p')[0];  // gets size before 'px' literal
    let myHeight = style.height.split('p')[0];// gets size before 'px' literal
    let iSquareWidth  = myWidth / 8;
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