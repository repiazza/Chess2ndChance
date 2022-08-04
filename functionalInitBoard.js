// import ('./Chess.js');
// import  Movement  from "./Chess.js"

const DARK_BGCOLOR = 0;
const LIGHT_BGCOLOR = 1;

const highlightClasses = 
[
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
    "orangeh1dark"
];
const captureClasses =
[
    "capturehl",
    "capturehldark"             
];


const bgBoardColors = [
    "darksquarecolor",
    "lightsquarecolor"
];

const SQUARE_RANGE        = 1;
const DOUBLE_SQUARE_RANGE = 2;
const L_RANGE             = 4;
const LINE_OF_SIGHT       = 8;
const MOVEMENT_TYPE_NONE  = 0;
const RANGE_TYPE_NONE     = 0;

const PIECE_TYPE_ROOK    = 'R';
const PIECE_TYPE_KNIGHT  = 'N';
const PIECE_TYPE_BISHOP  = 'B';
const PIECE_TYPE_QUEEN   = 'Q';
const PIECE_TYPE_KING    = 'K';
const PIECE_TYPE_PAWN    = 'P';
const PIECE_TYPE_NONE    =  0;

const SQUARE_TYPE_BLANK = 'BLANK';
const SQUARE_TYPE_PAWN_PIECE = 'PAWNPIECE';
const SQUARE_TYPE_HIGHVALUE_PIECE = 'NOTPAWNPIECE';
const SQUARE_TYPE_KNIGHT_PIECE = 'KNIGHTPIECE';
const SQUARE_TYPE_BISHOP_PIECE = 'BISHOPPIECE';
const SQUARE_TYPE_QUEEN_PIECE = 'QUEENPIECE';
const SQUARE_TYPE_KING_PIECE = 'KINGPIECE';
const SQUARE_TYPE_ROOK_PIECE = 'ROOKPIECE';
    //                0   1   2    3
    //                l   r   t    b
const TOP_LEFT     = [0 , 2];
const TOP_RIGHT    = [1 , 2];
const BOTTOM_LEFT  = [0 , 3];
const BOTTOM_RIGHT = [1 , 3];
const LEFT         = 0 ;
const RIGHT        = 1 ;
const TOP          = 2 ;
const BOTTOM       = 3 ;
const DIRECTION_ROTATE = [
                            [[TOP_LEFT, TOP], [TOP_RIGHT, TOP]], 
                            [[TOP_RIGHT, RIGHT], [BOTTOM_RIGHT, RIGHT]],
                            [[BOTTOM_RIGHT, BOTTOM], [BOTTOM_LEFT, BOTTOM]],
                            [[BOTTOM_LEFT, LEFT], [TOP_LEFT, LEFT]]
                         ];

let LSquares = [];

function validateAndSetCaptureSquare(mySquare){
    if ( mySquare.id === undefined || mySquare.id == null)
        mySquare = document.getElementById(mySquare);

    if ( validateEnemyPieceSquare(mySquare) ){
        mySquare.classList.add("captureclass");
    }
}
function getLSquaresFromSquare(square, ignoreColision=false){
    LSquares = [];
    let mySquareLeft = 0;
    let mySquareRight = 0;
    DIRECTION_ROTATE.map(pair => {
        mySquareLeft = getSquare(square, pair[0][0]);
        if ( mySquareLeft ){
            mySquareLeft = getSquare(document.getElementById(mySquareLeft), pair[0][1]);
            if ( mySquareLeft && (!ignoreColision && !validateFriendlyPieceSquare(document.getElementById(mySquareLeft))) ){
                validateAndSetCaptureSquare(mySquareLeft);
                LSquares.push(mySquareLeft);
                document.getElementById(mySquareLeft).classList.add("moveclass");
            }
        }
        mySquareRight = getSquare(square,pair[1][0])
        if ( mySquareRight ){
            // alert(mySquareRight);
            mySquareRight = getSquare(document.getElementById(mySquareRight),pair[1][1]);
            
            if ( mySquareRight ){
                LSquares.push(mySquareRight);
                document.getElementById(mySquareRight).classList.add("moveclass");
            }
        }
    });
    // let initSquareL = getSquare(square,TOP_LEFT)
    // initSquareL = getSquare(document.getElementById(initSquareL),TOP)
    // let initSquareR = getSquare(square,TOP_RIGHT)
    // initSquareR = getSquare(document.getElementById(initSquareR),TOP)
    // LSquares.push(initSquareL, initSquareR);
    // let i = 90;
    // while ( i < 360 ){
    //     $(square).css("transform", "rotate('"+i+"deg')");
    //     initSquareL = getSquare(square,DIRECTION_ROTATE[])
    //     initSquareL = getSquare(document.getElementById(initSquareL),TOP)
    //     initSquareR = getSquare(square,TOP_RIGHT)
    //     initSquareR = getSquare(document.getElementById(initSquareR),TOP)
    //     i += 90;
    //     LSquares.push(initSquareL, initSquareR);
    // }
    console.debug(LSquares);
}                      
        
const MOVEMENT_DIRECTION_COLUMN   = 0x01;
const MOVEMENT_DIRECTION_LINE     = 0x02; 
const MOVEMENT_DIRECTION_DIAGONAL = 0x04; 
const MOVEMENT_DIRECTION_L        = 0x08;

const SUBTYPE_DIAG_MAIN_BEGIN     = 0x10;
const SUBTYPE_DIAG_MAIN_END       = 0x20;
const SUBTYPE_DIAG_OPPOSITE_BEGIN = 0x40;
const SUBTYPE_DIAG_OPPOSITE_END   = 0x80;

const SUBTYPE_COLUMN_TOP      = 1024; 
const SUBTYPE_COLUMN_BOTTOM   = 2048;
const SUBTYPE_LINE_LEFT       = 4096;
const SUBTYPE_LINE_RIGHT      = 8192;

const SPECIAL_MOVEMENT_CASTLE     = 16384; 
const SPECIAL_MOVEMENT_EN_PASSANT = 32768; 
const SPECIAL_MOVEMENT_ALL = SPECIAL_MOVEMENT_CASTLE | SPECIAL_MOVEMENT_EN_PASSANT; 

const MAIN_DIAGONAL        = SUBTYPE_DIAG_MAIN_BEGIN | SUBTYPE_DIAG_MAIN_END;
const OPPOSITE_DIAGONAL    = SUBTYPE_DIAG_OPPOSITE_BEGIN | SUBTYPE_DIAG_OPPOSITE_END;
const DIAGONAL_FOUR_SQUARE = MAIN_DIAGONAL | OPPOSITE_DIAGONAL;

const MOVEMENT_DIRECTION_ALL = MOVEMENT_DIRECTION_COLUMN 
                                | MOVEMENT_DIRECTION_LINE 
                                | MOVEMENT_DIRECTION_DIAGONAL
                                | MOVEMENT_DIRECTION_L;
                                       
const SUBTYPE_DIAG_ALL = SUBTYPE_DIAG_MAIN_BEGIN 
                         | SUBTYPE_DIAG_MAIN_END 
                         | SUBTYPE_DIAG_OPPOSITE_BEGIN 
                         | SUBTYPE_DIAG_OPPOSITE_END;

const SUBTYPE_COLUMN_ALL = SUBTYPE_COLUMN_TOP | SUBTYPE_COLUMN_BOTTOM;  
const SUBTYPE_LINE_ALL   = SUBTYPE_LINE_LEFT  | SUBTYPE_LINE_RIGHT;            

const SUBTYPE_ALL        = SUBTYPE_COLUMN_ALL | SUBTYPE_LINE_ALL | SUBTYPE_DIAG_ALL;

const MOVEMENT_DIRECTION_SUBTYPE_ALL  = MOVEMENT_DIRECTION_ALL | SUBTYPE_ALL;

const MOVEMENT_TYPE_ALL  = MOVEMENT_DIRECTION_ALL | SUBTYPE_ALL | SPECIAL_MOVEMENT_ALL;


//ROOK
const ROOK_INITIAL_MOVEMENT = MOVEMENT_DIRECTION_COLUMN
                                | MOVEMENT_DIRECTION_LINE
                                | SPECIAL_MOVEMENT_CASTLE;
const ROOK_CASTLED_MOVEMENT = (ROOK_INITIAL_MOVEMENT ^ SPECIAL_MOVEMENT_CASTLE)
const ROOK_MOVEMENT_RANGE = LINE_OF_SIGHT;

//KNIGHT  
const KNIGHT_INITIAL_MOVEMENT = MOVEMENT_DIRECTION_L;
const KNIGHT_MOVEMENT_RANGE   = L_RANGE; // 2 movements 4way expressed

//BISHOP
const BISHOP_INITIAL_MOVEMENT = MOVEMENT_DIRECTION_DIAGONAL
const BISHOP_MOVEMENT_RANGE   = LINE_OF_SIGHT;

// QUEEN
const QUEEN_INITIAL_MOVEMENT =  MOVEMENT_DIRECTION_COLUMN
                            | MOVEMENT_DIRECTION_LINE
                            | MOVEMENT_DIRECTION_DIAGONAL;
const QUEEN_MOVEMENT_RANGE  = LINE_OF_SIGHT;

//KING
const KING_INITIAL_MOVEMENT = SPECIAL_MOVEMENT_CASTLE
                            | MOVEMENT_DIRECTION_COLUMN
                            | MOVEMENT_DIRECTION_LINE
                            | MOVEMENT_DIRECTION_DIAGONAL;
const KING_CASTLED_MOVEMENT = (KING_INITIAL_MOVEMENT ^ SPECIAL_MOVEMENT_CASTLE)
const KING_MOVEMENT_RANGE   =  SQUARE_RANGE;

//PAWN
const PAWN_INITIAL_MOVEMENT = MOVEMENT_DIRECTION_COLUMN
                                | SUBTYPE_COLUMN_TOP
                            | MOVEMENT_DIRECTION_DIAGONAL
                                | SUBTYPE_DIAG_MAIN_BEGIN
                                | SUBTYPE_DIAG_OPPOSITE_END;
const PAWN_INITIAL_RANGE = DOUBLE_SQUARE_RANGE;
const PAWN_MOVED_RANGE   = SQUARE_RANGE;


const TOP_RIGHT_DIRECTION = 'trsq';
const TOP_LEFT_DIRECTION = 'tlsq';
const BOTTOM_RIGHT_DIRECTION = 'brsq';
const BOTTOM_LEFT_DIRECTION = 'blsq';
const TOP_DIRECTION = 'tsq';
const LEFT_DIRECTION = 'lsq';
const BOTTOM_DIRECTION = 'bsq';
const RIGHT_DIRECTION = 'rsq';
const LINE_DIRECTION              = [ LEFT_DIRECTION, RIGHT_DIRECTION ];
const COLUMN_DIRECTION            = [ BOTTOM_DIRECTION, TOP_DIRECTION ];
const MAIN_DIAGONAL_DIRECTION     = [ BOTTOM_LEFT_DIRECTION,  TOP_RIGHT_DIRECTION];
const OPPOSITE_DIAGONAL_DIRECTION = [ BOTTOM_RIGHT_DIRECTION,  TOP_LEFT_DIRECTION];
const DIAGONAL_DIRECTION          = [ MAIN_DIAGONAL_DIRECTION, OPPOSITE_DIAGONAL_DIRECTION]

const CROSS_DIRECTION             = LINE_DIRECTION.concat(COLUMN_DIRECTION);
const STAR_DIRECTION              = CROSS_DIRECTION.concat(MAIN_DIAGONAL_DIRECTION).concat(OPPOSITE_DIAGONAL_DIRECTION);


const BLANK_ON_ORIGIN = 'BLKORIGIN';
const FULL_SWAP = 'FULLSWAP';

const FRIENDLY_SIDE = 'FRIENDLY';
const ENEMY_SIDE = 'ENEMY';

const SQUARE_TYPE_BLACK_PIECE = 'BLACKPIECE';
const SQUARE_TYPE_WHITE_PIECE = 'WHITEPIECE';

const PAWN_INIT_ROWS = ["2", "7"];
const HIGHVALUE_INIT_ROWS = ["1", "8"];

const WHITEPIECE_ROWS = ["1", "2"];
const BLACKPIECE_ROWS = ["7", "8"];
const BLANKSQUARE_ROWS = ["3", "4", "5", "6"];

let playerColor = 'BLACKPIECE';
const avaliableColors = ['WHITEPIECE','BLACKPIECE'];
const BLANK_SQUARE_COLOR = 0;

const columnArray = ['a','b','c','d','e','f','g','h'];
const columnPieceType = [
                            SQUARE_TYPE_ROOK_PIECE,
                            SQUARE_TYPE_KNIGHT_PIECE,
                            SQUARE_TYPE_BISHOP_PIECE,
                            SQUARE_TYPE_QUEEN_PIECE,
                            SQUARE_TYPE_KING_PIECE,
                            SQUARE_TYPE_BISHOP_PIECE,
                            SQUARE_TYPE_KNIGHT_PIECE,
                            SQUARE_TYPE_ROOK_PIECE
                        ];
const FILTER_ROW = 0;
const FILTER_COLUMN = 1;
const FILTER_COLOR = 2
const FILTER_TYPE = 3
const FILTER_SELECTED = 4
const FILTER_NOT_SELECTED = 5
const FILTER_EMPTY = 6
                  // 'row', 'column', 'color', 'type', 'selected', 'notselected', 'empty'
let filterDetails = [ -1, -1, -1, -1, -1, -1, -1];
let capturedPieces = "";
function movementMatchesAnyDirection(movementType){
    return (movementType & MOVEMENT_DIRECTION_ALL) ? true : false;
}

function getPieceTypeFromSquareType(type){
    if (type == SQUARE_TYPE_PAWN_PIECE) 
        return PIECE_TYPE_PAWN;
    else if (type == SQUARE_TYPE_ROOK_PIECE) 
        return PIECE_TYPE_ROOK;
    else if (type == SQUARE_TYPE_BISHOP_PIECE) 
        return PIECE_TYPE_BISHOP;
    else if (type == SQUARE_TYPE_KING_PIECE) 
        return PIECE_TYPE_KING;
    else if (type == SQUARE_TYPE_QUEEN_PIECE) 
        return PIECE_TYPE_QUEEN;
    else if (type == SQUARE_TYPE_KNIGHT_PIECE) 
        return PIECE_TYPE_KNIGHT;
            
    return PIECE_TYPE_NONE;
}
function getMovementRangeFromPieceType(value, moved=0){
    switch (value){
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

function getMovementTypeFromPieceType(value, moved=0){
    switch (value){
        case PIECE_TYPE_BISHOP:
            return BISHOP_INITIAL_MOVEMENT;
        case PIECE_TYPE_KING:
            return moved ? KING_CASTLED_MOVEMENT : KING_INITIAL_MOVEMENT;
        case PIECE_TYPE_PAWN:
            return PAWN_INITIAL_MOVEMENT;
        case PIECE_TYPE_KNIGHT:
            return KNIGHT_INITIAL_MOVEMENT;
        case PIECE_TYPE_ROOK:
            return moved ?  ROOK_CASTLED_MOVEMENT : ROOK_INITIAL_MOVEMENT;
        case PIECE_TYPE_QUEEN:
            return QUEEN_INITIAL_MOVEMENT;
    }
    return MOVEMENT_TYPE_NONE;
}

// function validateSquare(square, flag){
//     if ( flag === SQUARE_TYPE_BLANK )
//         return square.innerHTML == "";
//     if ( flag === SQUARE_TYPE_PIECE )
//         return square.innerHTML != "";
// }
function validateSquare(square, flag){
    if ( square === undefined )
        return false;

    if ( flag === SQUARE_TYPE_PAWN_PIECE ){
        return PAWN_INIT_ROWS.includes(square.id[1]);
    }
    if ( flag === SQUARE_TYPE_HIGHVALUE_PIECE ){
        return HIGHVALUE_INIT_ROWS.includes(square.id[1]);
    }
    if ( flag === SQUARE_TYPE_BLANK ){
        return (!validateSquare(square, SQUARE_TYPE_PAWN_PIECE)
                && !validateSquare(square, SQUARE_TYPE_HIGHVALUE_PIECE));
    }
}
function validateSquareColor(square, flag){
    if ( square.id === undefined )
        return false;

    if ( flag === SQUARE_TYPE_WHITE_PIECE )
        return WHITEPIECE_ROWS.includes(square.id[1]);
    if ( flag === SQUARE_TYPE_BLACK_PIECE )
        return BLACKPIECE_ROWS.includes(square.id[1]);
    if ( flag === SQUARE_TYPE_BLANK )
        return BLANKSQUARE_ROWS.includes(square.id[1]);
}
function createSquare(square){
    let sqType = 0;
    let sqColor = 0;
    let tlSquare = 0;
    let trSquare = 0;
    let blSquare = 0;
    let brSquare = 0;
    let lSquare = 0;
    let rSquare = 0;
    let tSquare = 0;
    let bSquare = 0;
    if ( validateSquare(square, SQUARE_TYPE_BLANK) )
        sqType = SQUARE_TYPE_BLANK;
    else if ( validateSquare(square, SQUARE_TYPE_PAWN_PIECE) )
        sqType = SQUARE_TYPE_PAWN_PIECE;
    else if (validateSquare(square, SQUARE_TYPE_HIGHVALUE_PIECE) )
        sqType = columnPieceType[columnArray.indexOf(square.id[0])];
    else{
        throw new Error(
            "Square invalido"
        );
    }

    if ( validateSquareColor(square, SQUARE_TYPE_BLACK_PIECE) )
        sqColor = SQUARE_TYPE_BLACK_PIECE;
    if ( validateSquareColor(square, SQUARE_TYPE_WHITE_PIECE) )
        sqColor = SQUARE_TYPE_WHITE_PIECE;
    if ( validateSquareColor(square, SQUARE_TYPE_BLANK) )
        sqColor = BLANK_SQUARE_COLOR;

        blSquare = getSquare(square, BOTTOM_LEFT);
        brSquare = getSquare(square, BOTTOM_RIGHT);
        tlSquare = getSquare(square, TOP_LEFT);
        trSquare = getSquare(square, TOP_RIGHT);
        lSquare = getSquare(square, LEFT);
        rSquare = getSquare(square, RIGHT);
        tSquare = getSquare(square, TOP);
        bSquare = getSquare(square, BOTTOM);
    
    return {
        squareElem: square,
        squareId: square.id,
        topLeftSquare: tlSquare,
        topRightSquare: trSquare,
        bottomLeftSquare: blSquare,
        bottomRightSquare: brSquare,
        topSquare: tSquare,
        rightSquare: rSquare,
        leftSquare: lSquare,
        bottomSquare: bSquare,
        initSquareId: square.id,
        squareType: sqType,
        squareColor: sqColor
    };
}
function getSquare(square, relativePosition){
    // console.log(square);
    let columnNotation = square.id[0];
    let indexNotation = Number(square.id[1]);
    let leftPos = -1;
    let rightPos = -1;
    let topPos = -1;
    let bottomPos = -1;
    //             l   r   t    b
    let allPos = [ -1, -1, -1, -1 ];
    if  ( columnArray[(columnArray.indexOf(columnNotation)-1)] !== undefined )
        leftPos = columnArray[(columnArray.indexOf(columnNotation)-1)];
    if  ( columnArray[(columnArray.indexOf(columnNotation)+1)] !== undefined )
        rightPos = columnArray[(columnArray.indexOf(columnNotation)+1)];
    if  ( (indexNotation+1) < 9  )
        topPos = indexNotation+1;
    if  ( (indexNotation-1) > 0  )
        bottomPos = indexNotation-1;
        
    allPos = [ leftPos, rightPos, topPos, bottomPos ];
    if ( relativePosition.length > 1 )
    {
        if ( allPos[relativePosition[0]] == -1 || allPos[relativePosition[1]] == -1 )
            return false; 
    
        return "" + allPos[relativePosition[0]] + allPos[relativePosition[1]];
    }
    if (  allPos[relativePosition] == -1 )
        return false;
        // console.log(relativePosition)
    if ( isLetter(allPos[relativePosition]) )
        return "" + allPos[relativePosition] + indexNotation;
    
    return "" + columnNotation + allPos[relativePosition];
}

function getDirectionFromSquare(square, direction, range=LINE_OF_SIGHT, ignoreColision=false){
    if ( Array.isArray(direction) && direction.length > 1 ){
        direction.map(myDir =>{
            getDirectionFromSquare(square, myDir, range);
        });
        return;
    }
    square.classList.add("moveclass");
    let movDir = square.getAttribute(direction);
    let i = 0;
    while ( document.getElementById(movDir) != null ){
        if ( i >= range )
            break;

        let nextSqElem = document.getElementById(movDir);
        let nextSq = document.getElementById(movDir).getAttribute('sqtype');
        let mySquarePiece = getFirstSelectedElement().getAttribute('sqtype');
        let moved = getFirstSelectedElement().getAttribute('mvd');
        let mySquareType = getPieceTypeFromSquareType(mySquarePiece, moved);
        
        // alert(nextSq);
        if ( (!ignoreColision && nextSq != SQUARE_TYPE_BLANK )){
            if ( direction == TOP_DIRECTION
                 && mySquareType != PIECE_TYPE_PAWN)
                validateAndSetCaptureSquare(movDir);
            else if ( (direction == TOP_LEFT_DIRECTION || direction == TOP_RIGHT_DIRECTION)
                        && mySquareType == PIECE_TYPE_PAWN ){
                validateAndSetCaptureSquare(movDir);
            }
            else if ( mySquareType != PIECE_TYPE_PAWN){
                validateAndSetCaptureSquare(movDir);
            }

            break;
        }
        let refresh = 0;
        if ( 
            !(
                (direction == TOP_LEFT_DIRECTION || direction == TOP_RIGHT_DIRECTION)  
                && mySquareType == PIECE_TYPE_PAWN
              ) 
            )
        {
            nextSqElem.classList.add("moveclass");
            refresh =1;
        }
        else if ( !(direction == TOP_LEFT_DIRECTION || direction == TOP_RIGHT_DIRECTION) ){
            nextSqElem.classList.add("moveclass");
            refresh = 1;
        }

        let myClass = -1 ;
        if ( LINE_DIRECTION.includes(direction) )
            myClass = getClassNameFromMovementDirection(MOVEMENT_DIRECTION_LINE);
        else if ( COLUMN_DIRECTION.includes(direction) )  
            myClass = getClassNameFromMovementDirection(MOVEMENT_DIRECTION_COLUMN);
        else if ( MAIN_DIAGONAL_DIRECTION.includes(direction) )
            myClass = getClassNameFromMovementDirection(MOVEMENT_DIRECTION_DIAGONAL);
        else if ( OPPOSITE_DIAGONAL_DIRECTION.includes(direction) )
            myClass = getClassNameFromMovementDirection(MOVEMENT_DIRECTION_DIAGONAL);
        
        if ( refresh == 1 ){
            if ( nextSqElem.getAttribute('bgc').includes('dark') ){
                myClass += 'dark';
            }
            nextSqElem.classList.forEach(thisclass => {
                if ( highlightClasses.includes(thisclass) ){
                    nextSqElem.classList.replace(thisclass, myClass);
                }
                if ( bgBoardColors.includes(thisclass) ){
                    nextSqElem.classList.replace(thisclass, myClass);
                }
            });
        }
        movDir = nextSqElem.getAttribute(direction);
        i++;
    }

    return true;
}
function getClassNameFromMovementDirection(baseMovementDirection){
    let i = 0;
    for ( ; baseMovementDirection > 0 ; i++ ){
        baseMovementDirection = baseMovementDirection >> 1;
        // alert(baseMovementDirection);
    }
    return highlightClasses[i-1];
}

function validateIsSelected(){
    return getAllSelectedElements()
}
function validateIsNotBlank(square){
    return square.getAttribute("sqtype") != SQUARE_TYPE_BLANK;
}
function validateIsBlank(square){
    return square.getAttribute("sqtype") == SQUARE_TYPE_BLANK;
}
function highlightSquares(square){
    validateIsOnRange(square);
}
function validateIsOnRange(square){
    let myPieceType = getFirstSelectedElement().getAttribute('sqtype');
    let moved = getFirstSelectedElement().getAttribute('mvd');

    let myMovType = getMovementTypeFromPieceType(getPieceTypeFromSquareType(myPieceType), moved);
    let myMovRange = getMovementRangeFromPieceType(getPieceTypeFromSquareType(myPieceType), moved);
    if ( matchMovementDirection(myMovType, MOVEMENT_DIRECTION_DIAGONAL) ){
        if ( matchMovementDirection(myMovType, SUBTYPE_DIAG_ALL) == 0 )
            myMovType = myMovType | SUBTYPE_DIAG_ALL;

        if ( matchMovementDirection(myMovType,SUBTYPE_DIAG_MAIN_BEGIN) )
            getDirectionFromSquare(getFirstSelectedElement(), TOP_LEFT_DIRECTION, myMovRange);
        if ( matchMovementDirection(myMovType,SUBTYPE_DIAG_MAIN_END) )
            getDirectionFromSquare(getFirstSelectedElement(), BOTTOM_RIGHT_DIRECTION, myMovRange);
        if ( matchMovementDirection(myMovType,SUBTYPE_DIAG_OPPOSITE_BEGIN) )
            getDirectionFromSquare(getFirstSelectedElement(), BOTTOM_LEFT_DIRECTION, myMovRange);
        if ( matchMovementDirection(myMovType,SUBTYPE_DIAG_OPPOSITE_END) )
            getDirectionFromSquare(getFirstSelectedElement(), TOP_RIGHT_DIRECTION, myMovRange);
    }
    if ( matchMovementDirection(myMovType, MOVEMENT_DIRECTION_COLUMN) ){
        if ( matchMovementDirection(myMovType, SUBTYPE_COLUMN_ALL) == 0 )
            myMovType = myMovType | SUBTYPE_COLUMN_ALL;

        if ( matchMovementDirection(myMovType, SUBTYPE_COLUMN_TOP) )
            getDirectionFromSquare(getFirstSelectedElement(), TOP_DIRECTION, myMovRange);            
        if ( matchMovementDirection(myMovType, SUBTYPE_COLUMN_BOTTOM) )
            getDirectionFromSquare(getFirstSelectedElement(), BOTTOM_DIRECTION, myMovRange);
        
    }
    if ( matchMovementDirection(myMovType, MOVEMENT_DIRECTION_LINE) ){
        if ( matchMovementDirection(myMovType, SUBTYPE_LINE_ALL) == 0 )
            myMovType = myMovType | SUBTYPE_LINE_ALL;

        if ( matchMovementDirection(myMovType, SUBTYPE_LINE_LEFT) )
            getDirectionFromSquare(getFirstSelectedElement(), LEFT_DIRECTION, myMovRange);            
        if ( matchMovementDirection(myMovType, SUBTYPE_LINE_RIGHT) )
            getDirectionFromSquare(getFirstSelectedElement(), RIGHT_DIRECTION, myMovRange);
    }
    if ( matchMovementDirection(myMovType, MOVEMENT_DIRECTION_L) ){
        getLSquaresFromSquare(getFirstSelectedElement());
    }
    
    if ( !square.classList.contains("moveclass") && !square.classList.contains("captureclass") ){
        return false;
    }
    
    // document.querySelectorAll('.moveclass').forEach(element => {
    //     element.classList.remove("moveclass");
    // });  
    return true;
    // highlightMovementDirection(myMov.getObjMovementType())
}
function validateEnemyPieceSquare(square){
    return (square.getAttribute('sqcolor') != playerColor);
}
function validateFriendlyPieceSquare(square){
    return (square.getAttribute("sqcolor") == playerColor)
}
function validateSquareSide(square){
    return validateFriendlyPieceSquare(square) ? FRIENDLY_SIDE : ENEMY_SIDE;
}
function getColorSide(color){
    return (color == playerColor) ? FRIENDLY_SIDE : ENEMY_SIDE;
}
function validateSelectedPieceSquare(square){
    if  ( !validateIsSelected() )
        return validateIsSelected();

    let myColor = getFirstSelectedElement().getAttribute('sqColor');
    if ( getColorSide(myColor) == validateSquareSide(square) )
        return validateSquareSide(square)
    else if ( validateSquareSide(square) == ENEMY_SIDE )
        return ENEMY_SIDE ;

    return false;    
}
function isLetter(letter) {
    return letter.length === 1 && letter.match(/[a-z]/i);
}
function validatePlayerColorSquare(square){
    return (square.getAttribute("sqcolor") == playerColor);
}
function selectSquare(square){
        return (!validateIsSelected() && validateIsNotBlank(square) && validatePlayerColorSquare(square));
}
function drawSquare(squareId, myInner=""){
    let divSquare = document.createElement('div');
    divSquare.id = squareId;
    divSquare.innerHTML = myInner;
    divSquare.classList.add('square');
    divSquare.classList.add('squaredimension');
    divSquare.addEventListener('click', squareHandler)

    return divSquare;
}
function moveToDestination(originsq, destsq, flag){
    let outerdest = destsq.outerHTML.split("class");
    let outerorig = originsq.outerHTML.split("class");
    let newdestouter = outerdest[0] + " class" + outerorig[1];
    let newouterorig = "";
    if ( flag == FULL_SWAP ){
        newouterorig = outerorig[0] + " class" + outerdest[1];
    }
    outerdest.outerHTML = newdestouter;
    if ( newouterorig != "" )
        outerorig.outerHTML = newouterorig;

    if ( flag == BLANK_ON_ORIGIN ){
        outerorig.setAttribute("sqcolor", "0");
        outerorig.setAttribute("sqtype", SQUARE_TYPE_BLANK);
        outerorig.innerHTML = "";
    }
}
function validateIsCaptureSquare(square){
    // alert(square.classList);
    if ( !square.classList.contains("captureclass")){
        return false;
    }
    return true;
}
function hasAnySquareDrew(){
    return (document.querySelectorAll('.square').length > 0);
}
function moveSquare(square){
    return (validateIsSelected() &&  validateIsBlank(square) && validateIsOnRange(square));
}
function changeSelectedSquare(square){
    return validateIsSelected() &&  (validateSelectedPieceSquare(square) == FRIENDLY_SIDE);
}
function captureSquare(square){
    return (
            validateIsSelected() 
            && (validateSelectedPieceSquare(square) == ENEMY_SIDE)
            && validateIsOnRange(square)
            && validateIsCaptureSquare(square)
    );
}
function setElementAsSelected(elem){
    elem.setAttribute("sltd", "1");
}
function clearElementSelection(elem){
    document.getElementById(elem.id).removeAttribute('sltd');
    
}
function clearAllElementSelection(){
    document.querySelectorAll('[sltd]').removeAttribute('sltd');
}
function isElementSelected(elem){
    return document.querySelector('[id="'+elem.id+'"][sltd]');
}
function getAllSelectedElements(){
    if (document.querySelectorAll('[sltd]').length > 0){
        return document.querySelectorAll('[sltd]');
    }
    return false;
}
function getFirstSelectedElement(){
    if ( getAllSelectedElements() ){
        return getAllSelectedElements()[0];
    }
    return false;
}
function matchMovementDirection(movType, direction){
    return (movType & direction) ? true : false;
}
function squareHandler(event){
    event.preventDefault();
    // Validar contexto de algo ja selecionado
    // Sem selecao previa + square com pecas 
    // ou com selecao previua + square aliado
    if ( selectSquare(event.target) || changeSelectedSquare(event.target) ){
        if ( validateIsSelected() ){
            let oldelem = getFirstSelectedElement();
            // oldelem.innerHTML = "";
            clearElementSelection(oldelem);
        }
        setElementAsSelected(event.target);
        highlightSquares(event.target);
    }
    // Selecao previa + square sem pecas
    // Selecao previa + square com pecas inimigas
    else if ( moveSquare(event.target) || captureSquare(event.target) ){
        let oldelem = getFirstSelectedElement();
        // alert(oldelem.innerHTML);
        event.target.innerHTML = oldelem.innerHTML;
        oldelem.innerHTML = "";
        if ( !validateIsBlank(event.target) ){
            capturedPieces +=  
            event.target.getAttribute('sqcolor').split("PIECE")[0][0] 
            + event.target.getAttribute('sqtype').split("PIECE")[0][0]
            + event.target.id[0] + " ";
        }
        
        clearElementSelection(oldelem);
        event.target.setAttribute("sqcolor", oldelem.getAttribute("sqcolor"))
        event.target.setAttribute("sqtype", oldelem.getAttribute("sqtype"))
        event.target.setAttribute("initsq", oldelem.getAttribute("initsq"))
        event.target.setAttribute("mvd", "1");
        oldelem.setAttribute("sqcolor", "0");
        oldelem.setAttribute("sqtype", SQUARE_TYPE_BLANK);
        // alert("moveSquare ou captureSquare");
    }
    drawSquareDetails();

}
function readyHandler(event){
    event.preventDefault();

    // const blanksquare  = drawSquare('a3', "");
    // const piecesquare  = drawSquare('a1', 'WR1');
    // const blanksquare  = drawSquare('a3', "asdad");
    // const piecesquare  = drawSquare('a1', '');
    const board = document.getElementById('board');
    let marginLeft = 0;
    let marginTop = 0;
    let supervisorMarginTop = 40;
    let supervisoridCtr = 0;
    
    let rowColorToggle = false;
    for ( let rowNdx = 1; rowNdx < 9; rowNdx++ ){
        columnArray.map( function (columnAlpha, clmndx){
            try{
                let candidateElem = drawSquare(columnAlpha+rowNdx, "");
                const newsquare = createSquare(candidateElem);
                marginLeft += 80;
                var squareColorSeq = DARK_BGCOLOR;
                if ( clmndx%2 != rowColorToggle ) {
                    squareColorSeq = LIGHT_BGCOLOR;
                }
                newsquare.squareElem.style.position = 'absolute';
                newsquare.squareElem.style.marginLeft = marginLeft+"px";
                newsquare.squareElem.style.marginTop = marginTop+"px";
                newsquare.squareElem.classList.add(bgBoardColors[squareColorSeq]);
                newsquare.squareElem.setAttribute("bgc", bgBoardColors[squareColorSeq]); 
                // newsquare.squareElem.style.backgroundColor = ((clmndx+rowNdx)%2) ? 'red':'yellow';
                newsquare.squareElem.style.color = 'black';
                newsquare.squareElem.setAttribute("sqtype", newsquare.squareType);
                newsquare.squareElem.setAttribute("sqcolor", newsquare.squareColor);
                newsquare.squareElem.setAttribute("tlsq", newsquare.topLeftSquare);
                newsquare.squareElem.setAttribute("trsq", newsquare.topRightSquare);
                newsquare.squareElem.setAttribute("brsq", newsquare.bottomRightSquare);
                newsquare.squareElem.setAttribute("blsq", newsquare.bottomLeftSquare);
                newsquare.squareElem.setAttribute("tsq", newsquare.topSquare);
                newsquare.squareElem.setAttribute("bsq", newsquare.bottomSquare);
                newsquare.squareElem.setAttribute("lsq", newsquare.leftSquare);
                newsquare.squareElem.setAttribute("rsq", newsquare.rightSquare);
                if (  newsquare.squareColor != BLANK_SQUARE_COLOR )
                    newsquare.squareElem.setAttribute("initsq", newsquare.initSquareId);
                newsquare.squareElem.innerHTML = newsquare.squareElem.getAttribute("sqtype").split("PIECE")[0];
                newsquare.squareElem.classList.add('rotate90');
                newsquare.squareElem.innerHTML == 'BLANK' ? 
                    newsquare.squareElem.innerHTML = "" : "";  
                let supervisor  =  document.createElement('div');
                supervisor.style.position = 'absolute'; 
                supervisor.id = "slp" + (supervisoridCtr++);
                supervisor.style.marginLeft = "780px";
                supervisor.style.marginTop = supervisorMarginTop+"px";
                supervisor.classList.add('supervisordiv');
                board.appendChild(newsquare.squareElem);
                document.getElementById('container').appendChild(supervisor);
                supervisorMarginTop += 20;
                // console.log(newsquare);

            }
            catch(err){
                alert(err.message);
            }
        });
        marginTop += 80;
        marginLeft = 0;
        
        rowColorToggle = !rowColorToggle;
    }
    $('#board').css("transform", "scaleY(-1)");
    
    marginLeft = 140;
    columnArray.map( function (columnAlpha,clmndx){        
        let subtitle  =  document.createElement('div');
        subtitle.style.marginLeft = marginLeft+"px";
        subtitle.style.marginTop = "690px";
        subtitle.innerHTML = columnAlpha;
        subtitle.style.position = 'absolute'; 
        subtitle.style.color= 'black'; 
        subtitle.style.fontWeight= 'bold';
        subtitle.style.fontSize= "20px";
        document.getElementById('container').appendChild(subtitle);
        marginLeft += 81;
    });
    drawSquareDetails();
    
}
function drawInitialBoard(boardId, buttonreadyHandler){
     const createbtn = document.getElementById(boardId);
     createbtn.addEventListener('click', buttonreadyHandler);
}

function drawSupervisorSelect(){
    let selectElem = document.getElementById('supervisorselect');
    let radioElem = [-1,-1];
    let radioLbl = [-1,-1];
    let radioType = [-1,-1];
    let radioTpLbl = [-1,-1];
    let selectColumn = -1;
    let selectType = -1;
    let typeValue = -1
    let selectRow = -1;
    let selectVal = -1; 
    let columnVal = -1;
    let rowVal = -1;
    let radioVal = -1;
    let typeSelected = -1;
    let option = -1;
    filterDetails = [-1, -1,-1, -1, -1, -1, -1];
    if ( selectElem != null ){
        selectVal = selectElem.value;
        document.getElementById("container").removeChild(selectElem);
    }
    else{    
        document.querySelectorAll('[id^=spsb]').forEach(element => {
            document.getElementById("container").removeChild(element);
        });  
    }
    selectElem = document.createElement("select");
    selectElem.id = "supervisorselect";
    selectElem.addEventListener('change', drawSquareDetails);
    selectElem.style.position = 'absolute';
    selectElem.style.marginTop = '50px';
    let filteropt  = ['Escolha', 'Row', 'Column', 'Color', 'Type', 'Selected', 'Not Selected', 'Empty'];
    for (var i = 0; i < filteropt.length; i++) {
        option = document.createElement("option");
        option.value = i;
        option.text = filteropt[i];
        if (selectVal == i)
            option.selected = 1;

        selectElem.appendChild(option);
    }
    if ( (selectVal-1) == FILTER_COLUMN ){
        selectColumn = document.getElementById('spsbselectcolumn');
        columnVal = -1;
        if ( selectColumn != null ){
            columnVal = selectColumn.value;
            document.getElementById("container").removeChild(selectColumn);
        }
        else{    
            document.querySelectorAll('[id^=spsb]').forEach(element => {
                document.getElementById("container").removeChild(element);
            });  
        }
        selectColumn = document.createElement("select");
        selectColumn.id = "spsbselectcolumn";
        selectColumn.style.position = 'absolute';
        selectColumn.style.marginTop = '75px';
        selectColumn.addEventListener('change', drawSquareDetails);
        option = document.createElement("option");
        option.value = -1;
        option.text = "selecione";
        selectColumn.appendChild(option);
        for (var i = 0; i < columnArray.length; i++) {
            option = document.createElement("option");
            option.value = i;
            option.text = columnArray[i];
            if (columnVal == i){
                option.selected = 1;
            }
                
            selectColumn.appendChild(option);
        }
        // selectColumn = selectElem;
    }
    else if ( (selectVal-1) == FILTER_ROW ){
        selectRow = document.getElementById('spsbselectrow');
        rowVal = -1;
        if ( selectRow != null ){
            rowVal = selectRow.value;
            document.getElementById("container").removeChild(selectRow);
        }
        else{    
            document.querySelectorAll('[id^=spsb]').forEach(element => {
                document.getElementById("container").removeChild(element);
            });  
        }
        selectRow = document.createElement("select");
        selectRow.id = "spsbselectrow";
        selectRow.style.position = 'absolute';
        selectRow.style.marginTop = '75px';
        selectRow.addEventListener('change', drawSquareDetails);
        option = document.createElement("option");
        option.value = -1;
        option.text = "selecione";
        selectRow.appendChild(option);
        for (var i = 0; i < 8; i++) {
            option = document.createElement("option");
            option.value = i;
            option.text = i+1;
            if (rowVal == i){
                option.selected = 1;
            }
                
            selectRow.appendChild(option);
        }
        // selectColumn = selectElem;
    }
    else if ( (selectVal-1) == FILTER_COLOR ){
        radioElem[0] = document.getElementById('spsbrdwhite');
        radioElem[1] = document.getElementById('spsbrdblack');
        radioLbl[0] = document.getElementById('spsblblrdwhite');
        radioLbl[1] = document.getElementById('spsblblrdblack');
        radioVal = -1;
        if ( radioElem[0] != null ){
            radioVal = (radioElem[0].checked) ? radioElem[0].value : -1;
            document.getElementById("container").removeChild(radioElem[0]);
        }
        if ( radioLbl[0] != null ){
            document.getElementById("container").removeChild(radioLbl[0]);
        }
        if ( radioElem[1] != null ){
            if ( radioVal == -1 ){
                radioVal = (radioElem[1].checked) ? radioElem[1].value : -1;
            }
            document.getElementById("container").removeChild(radioElem[1]);
        }
        if ( radioLbl[1] != null ){
            document.getElementById("container").removeChild(radioLbl[1]);
        }
        if ( radioVal == -1 ) {    
            document.querySelectorAll('[id^=spsb]').forEach(element => {
                document.getElementById("container").removeChild(element);
            });  
        }

        radioElem[0] = document.createElement("input");
        radioElem[0].type = 'radio';
        radioElem[0].id = "spsbrdwhite";
        radioElem[0].value = "WHITEPIECE";
        if ( radioVal == radioElem[0].value )
            radioElem[0].checked = true;
        radioElem[0].name="colors";
        radioElem[0].style.position = 'absolute';
        radioElem[0].addEventListener('change', drawSquareDetails);
        radioLbl[0] = document.createElement("label");
        radioLbl[0].for = "spsbrdwhite";
        radioLbl[0].id = "spsblblrdwhite";
        radioLbl[0].innerHTML = "White";
        radioLbl[0].style.position = 'absolute';
        radioLbl[0].style.marginTop = '75px';
        radioElem[1] = document.createElement("input");
        radioElem[1].type = 'radio';
        radioElem[1].id = "spsbrdblack";
        radioElem[1].value = "BLACKPIECE";  
        if ( radioVal == radioElem[1].value )
            radioElem[1].checked = true;
        radioElem[1].name="colors";
        radioElem[1].style.position = 'absolute';
        radioElem[1].style.marginTop = '50px';
        radioElem[1].addEventListener('change', drawSquareDetails);
        radioLbl[1] = document.createElement("label");
        radioLbl[1].for = "spsbrdblack";
        radioLbl[1].id = "spsblblrdblack";
        radioLbl[1].innerHTML = "Black";
        radioLbl[1].style.position = 'absolute';
        radioLbl[1].style.marginTop = '50px';
        radioLbl[1].style.marginLeft = '30px';
    }
    else if ( (selectVal-1) == FILTER_TYPE  ){
        selectType = document.getElementById('spsbselecttype');
        // selectType = selectElem;
        typeValue = -1;
        if ( selectType != null ){
            typeValue = selectType.value;
            document.getElementById("container").removeChild(selectType);
        }
        else{
            document.querySelectorAll('[id^=spsb]').forEach(element => {
                document.getElementById("container").removeChild(element);
            });  
        }
        selectType = document.createElement("select");
        selectType.id = "spsbselecttype";
        selectType.style.position = 'absolute';
        selectType.style.marginTop = '25px';
        selectType.addEventListener('change', drawSquareDetails);
        option = document.createElement("option");
        option.value = -1;
        option.text = "selecione";
        selectType.appendChild(option);
        for (var i = 0; i < 5; i++) {
            option = document.createElement("option");
            option.value = columnPieceType[i];
            option.text = columnPieceType[i].split("PIECE")[0];
            if (typeValue == columnPieceType[i]){
                option.selected = 1;
            }
                
            selectType.appendChild(option);
        }
        option = document.createElement("option");
        option.value = 'PAWNPIECE';
        option.text = 'PAWN';
        if (typeValue == 'PAWNPIECE'){
            option.selected = 1;
        }
        selectType.appendChild(option);
    }
    else if ( (selectVal-1) == FILTER_SELECTED ){
        typeSelected = 'sltd';
        typeSelected = '['+typeSelected+']';
    }
    else if ( (selectVal-1) == FILTER_NOT_SELECTED ){
        typeSelected = 'sltd';                
        typeSelected = ':not(['+typeSelected+'])';
    }
    else if ( (selectVal-1) == FILTER_EMPTY ){
        radioVal = BLANK_SQUARE_COLOR;
    }
    else{
        document.querySelectorAll('[id^=spsb]').forEach(element => {
            document.getElementById("container").removeChild(element);
        });   
    }
    filterDetails[FILTER_COLUMN] = columnVal;
    filterDetails[FILTER_ROW] = rowVal;
    filterDetails[FILTER_COLOR] = radioVal;
    filterDetails[FILTER_TYPE] = typeValue;
    filterDetails[FILTER_SELECTED] = typeSelected;
    if ( selectElem != -1 && selectElem != null ){
        document.getElementById("container").appendChild(selectElem);
        if ( selectColumn != -1 && selectColumn != null )
            document.getElementById("container").appendChild(selectColumn);
        if ( selectRow != -1 && selectRow != null )
            document.getElementById("container").appendChild(selectRow);
        if ( radioElem[0] != -1 && radioElem[0] != null ){
            document.getElementById("container").appendChild(radioElem[0]);
            document.getElementById("container").appendChild(radioLbl[0]);
        } 
        if ( radioElem[1] != -1 && radioElem[1] != null ){
            document.getElementById("container").appendChild(radioElem[1]);
            document.getElementById("container").appendChild(radioLbl[1]);
        }
        if ( radioType[0] != -1 && radioType[0] != null ){
            document.getElementById("container").appendChild(radioType[0]);
            document.getElementById("container").appendChild(radioTpLbl[0]);
        } 
        if ( radioType[1] != -1 && radioType[1] != null ){
            document.getElementById("container").appendChild(radioType[1]);
            document.getElementById("container").appendChild(radioTpLbl[1]);
        }
        if ( selectType != -1 && selectType != null ){
            document.getElementById("container").appendChild(selectType);
            document.getElementById("container").appendChild(selectType);
        }
    }

}
function setDiagonalFromSelect(e){  
    if ( e.target.value == -1){
        document.querySelectorAll(".square").forEach(element => {
            element.innerHTML = "";
        });
        return ;
    }
    let mySquare = document.getElementById(e.target.value);
    getDirectionFromSquare(mySquare, MAIN_DIAGONAL_DIRECTION);
    getDirectionFromSquare(mySquare, OPPOSITE_DIAGONAL_DIRECTION);
}
function drawFullDiagonalSelect(){
    document.querySelectorAll('[id^="diagonalselect"]').forEach(element => {
        document.getElementById("container").removeChild(element);
    });
    let selectElem = document.createElement("select");
    selectElem.id = "spsbdiagonalselect";
    selectElem.style.position = "absolute";
    selectElem.style.marginTop = "120px";
    selectElem.style.marginLeft = "75px";
    selectElem.addEventListener('change', setDiagonalFromSelect);
    let option = document.createElement("option");
    option.value = -1;
    option.text = "Sq:";
    selectElem.appendChild(option);
    
    for ( let rowNdx = 1; rowNdx < 9; rowNdx++ ){
       columnArray.map( function (columnAlpha, clmndx){
            option = document.createElement("option");
            option.value = ""+columnAlpha+rowNdx;
            option.text = option.value;
            selectElem.appendChild(option);
       }); 
    };
    
    let labelElem = document.createElement("label");
    
    labelElem.for = "diagonalselect";
    labelElem.id = "spsblbldiagonalselect";
    labelElem.innerHTML = "Diagonal:";
    labelElem.style.position = "absolute";
    labelElem.style.marginTop = "120px";
    document.getElementById("container").appendChild(labelElem);
    document.getElementById("container").appendChild(selectElem);
}
function drawIntervalTimeSet(){
    document.querySelectorAll('[id^="textelem"]').forEach(element => {
        document.getElementById("container").removeChild(element);
    });
    let ptextElem = document.createElement("p");
    ptextElem.id = 'spsbptextelem';
    ptextElem.innerHTML = 'Refresh(seg):';
    ptextElem.style.position = "absolute";
    ptextElem.style.marginTop = "160px";
    document.getElementById("container").appendChild(ptextElem);
    let textElem = document.createElement("input");
    textElem.id = 'spsbtextelem';
    textElem.setAttribute("type", "text");
    textElem.setAttribute("maxlenght", "10");
    textElem.setAttribute("lenght", "10");
    textElem.style.position = "absolute";
    textElem.style.marginTop = "180px";
    textElem.style.width = "30px";
    document.getElementById("container").appendChild(textElem);
    let buttonText = document.createElement("input");
    buttonText.id = 'spsbbttextelem';
    buttonText.setAttribute("type", "button");
    buttonText.style.position = "absolute";
    buttonText.style.marginTop = "180px";
    buttonText.style.marginLeft = "30px";
    buttonText.setAttribute("value", "Enviar");
    buttonText.addEventListener('click', setIntervalSeconds);
    document.getElementById("container").appendChild(buttonText);
}
function setIntervalSeconds(){
    let seconds = document.getElementById('spsbtextelem').value;
    // alert(seconds);
    if (  (Number(seconds) > 1) && (Number(seconds) < 20) ){
        intervalSeconds = seconds;
        intervalTime = intervalSeconds * 1000;
        window.clearInterval(myInterval);
        myInterval = window.setInterval(setSupervisorPatrol, intervalTime); 
    }
}
function drawSquareDetails(){

    drawSupervisorSelect();
    drawFullDiagonalSelect();
    drawIntervalTimeSet();
    let selector = ".square" ;
    if ( filterDetails[FILTER_COLUMN] != -1 ){
        selector = "[class*='square'][id*='"+columnArray[filterDetails[FILTER_COLUMN]]+"']";
    }
    if ( filterDetails[FILTER_ROW] != -1 ){
        selector = "[class*='square'][id*='"+(Number(filterDetails[FILTER_ROW])+1)+"']";
    }
    if ( filterDetails[FILTER_COLOR] != -1 ){
        selector = "[class*='square'][sqcolor='"+filterDetails[FILTER_COLOR]+"']";
    }
    if ( filterDetails[FILTER_TYPE] != -1 ){
        selector = "[class*='square'][sqtype='"+filterDetails[FILTER_TYPE]+"']";
    }
    if ( filterDetails[FILTER_SELECTED] != -1 ){
        selector = "[class*='square']"+filterDetails[FILTER_SELECTED]+"";
    }
    document.querySelectorAll("[id*='slp']").forEach(element => {
        element.innerHTML = "";
        element.style.fontWeight= '';
    });
    let supervisoridCtr=0;
    document.querySelectorAll(selector).forEach(element => {
        let supervisordiv = document.getElementById("slp" + (supervisoridCtr++));
        // alert(supervisordiv);
        if ( supervisordiv == null )
            return;
        supervisordiv.innerHTML = "";
        supervisordiv.innerHTML += "<b>"+element.id +"</b>"; 
        // supervisordiv.innerHTML +=" |- inner:"+ element.innerHTML; 
        supervisordiv.innerHTML +=" sqc: "+ element.getAttribute("sqcolor").split("PIECE")[0]; 
        supervisordiv.innerHTML +=" | intsq: "+ element.getAttribute("initsq");
        if ( element.getAttribute("tlsq") ) 
            supervisordiv.innerHTML +=" | tlsq: "+ element.getAttribute("tlsq"); 
        if ( element.getAttribute("trsq") ) 
        supervisordiv.innerHTML +=" | trsq: "+ element.getAttribute("trsq"); 
        if ( element.getAttribute("brsq") ) 
        supervisordiv.innerHTML +=" | brsq: "+ element.getAttribute("brsq"); 
        if ( element.getAttribute("blsq") ) 
        supervisordiv.innerHTML +=" | blsq: "+ element.getAttribute("blsq"); 
        if ( element.getAttribute("lsq") ) 
        supervisordiv.innerHTML +=" | lsq: "+ element.getAttribute("lsq");  
        if ( element.getAttribute("rsq") ) 
        supervisordiv.innerHTML +=" | rsq: "+ element.getAttribute("rsq"); 
        if ( element.getAttribute("tsq") ) 
        supervisordiv.innerHTML +=" | tsq: "+ element.getAttribute("tsq"); 
        if ( element.getAttribute("bsq") ) 
        supervisordiv.innerHTML +=" | bsq: "+ element.getAttribute("bsq"); 
        supervisordiv.innerHTML +=" | sqtype: " + element.getAttribute("sqtype").split("PIECE")[0]; 
        supervisordiv.innerHTML +=" | sltd: " + element.getAttribute("sltd");
        if ( element.getAttribute("sltd") != null )
            supervisordiv.style.fontWeight= 'bold'; 

    });
    document.getElementById("captured").innerHTML = capturedPieces;
}
function setSupervisorPatrol(){
    if ( !hasAnySquareDrew() )
        return;
        
    
    drawSquareDetails();   
    // fixSquareTypeProprierties();

}
function rotate(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}
function fixSquareTypeProprierties(){
    selector = "[class*='square'][sqtype='BLANK']";
    document.querySelectorAll(selector).forEach(element => {
        if ( element != null ){
            // alert(element.id)
            document.getElementById(element.id).setAttribute("sqcolor", "0");
            document.getElementById(element.id).removeAttribute('sltd');
            element.innerHTML = "";
        }
    });
    selector = "[class*='square']:not([sqcolor='0'])";
    document.querySelectorAll(selector).forEach(element => {
        element.setAttribute("sqtype", columnPieceType[columnArray.indexOf(element.getAttribute('initsq')[0])]);
        obj = {
            id : element.initsq,
            objname : ""
        };
        if ( validateSquareColor(obj, SQUARE_TYPE_BLACK_PIECE) )
            element.setAttribute("sqcolor", SQUARE_TYPE_BLACK_PIECE);
        else if ( validateSquareColor(obj, SQUARE_TYPE_WHITE_PIECE) )
            element.setAttribute("sqcolor", SQUARE_TYPE_WHITE_PIECE);
    });
}
let intervalSeconds = 5;
let intervalTime = intervalSeconds * 1000;
let myInterval;
$(document).ready(function (){
    playerColor = avaliableColors[0];
    
    myInterval = window.setInterval(setSupervisorPatrol, intervalTime);
});

drawInitialBoard("boardcreate", readyHandler);