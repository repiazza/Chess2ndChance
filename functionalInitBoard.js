/////////////////////////////////////////////////////////////
//
//    Board block
//
//
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

const GAME_CONTEXT_INITIAL = 0;
const GAME_CONTEXT_PLAYING = 1;

const VISIBILITY_VISIBLE = "visible";
const VISIBILITY_HIDDEN  = "hidden";

const SQUARE_TYPE_PAWN_PIECE      = 'PAWNPIECE';
const SQUARE_TYPE_HIGHVALUE_PIECE = 'NOTPAWNPIECE';
const SQUARE_TYPE_KNIGHT_PIECE    = 'KNIGHTPIECE';
const SQUARE_TYPE_BISHOP_PIECE    = 'BISHOPPIECE';
const SQUARE_TYPE_QUEEN_PIECE     = 'QUEENPIECE';
const SQUARE_TYPE_KING_PIECE      = 'KINGPIECE';
const SQUARE_TYPE_ROOK_PIECE      = 'ROOKPIECE';
const SQUARE_TYPE_BLANK           = 'BLANK';

///////////////////////////////////////////////////////////
//
//    Movement Block
//
//
const CONSIDER_COLISION = 0;
const IGNORE_COLISION = 1;
    //                0  1  2  3
    //                l  r  t  b
const TOP_LEFT     = [0 , 2];
const TOP_RIGHT    = [1 , 2];
const BOTTOM_LEFT  = [0 , 3];
const BOTTOM_RIGHT = [1 , 3];
const LEFT         = 0 ;
const RIGHT        = 1 ;
const TOP          = 2 ;
const BOTTOM       = 3 ;
const DIRECTION_ROTATE = [
                            [[TOP_LEFT, TOP]       , [TOP_RIGHT, TOP]], 
                            [[TOP_RIGHT, RIGHT]    , [BOTTOM_RIGHT, RIGHT]],
                            [[BOTTOM_RIGHT, BOTTOM], [BOTTOM_LEFT, BOTTOM]],
                            [[BOTTOM_LEFT, LEFT]   ,  [TOP_LEFT, LEFT]]
                         ];

const SQUARE_RANGE        = 1;
const DOUBLE_SQUARE_RANGE = 2;
const L_RANGE             = 4;
const LINE_OF_SIGHT       = 8;
const RANGE_TYPE_NONE     = 0;

const MOVEMENT_TYPE_NONE = 0;
//
// Main movement notation
//
const MOVEMENT_DIRECTION_COLUMN   = 0x01;
const MOVEMENT_DIRECTION_LINE     = 0x02; 
const MOVEMENT_DIRECTION_DIAGONAL = 0x04; 
const MOVEMENT_DIRECTION_L        = 0x08;
//
// Segemented movement notation
//
const SUBTYPE_DIAG_MAIN_BEGIN     = 0x10;
const SUBTYPE_DIAG_MAIN_END       = 0x20;
const SUBTYPE_DIAG_OPPOSITE_BEGIN = 0x40;
const SUBTYPE_DIAG_OPPOSITE_END   = 0x80;
                                       
const SUBTYPE_DIAG_ALL = SUBTYPE_DIAG_MAIN_BEGIN 
                         | SUBTYPE_DIAG_MAIN_END 
                         | SUBTYPE_DIAG_OPPOSITE_BEGIN 
                         | SUBTYPE_DIAG_OPPOSITE_END;

const SUBTYPE_COLUMN_TOP          = 1024; 
const SUBTYPE_COLUMN_BOTTOM       = 2048;
const SUBTYPE_LINE_LEFT           = 4096;
const SUBTYPE_LINE_RIGHT          = 8192;
//
// Special movement notation
//
const SPECIAL_MOVEMENT_CASTLE     = 16384; 
const SPECIAL_MOVEMENT_EN_PASSANT = 32768; 
const SPECIAL_MOVEMENT_ALL        = SPECIAL_MOVEMENT_CASTLE | SPECIAL_MOVEMENT_EN_PASSANT; 
//
// Compount movement notation
//
const MAIN_DIAGONAL        = SUBTYPE_DIAG_MAIN_BEGIN | SUBTYPE_DIAG_MAIN_END;
const OPPOSITE_DIAGONAL    = SUBTYPE_DIAG_OPPOSITE_BEGIN | SUBTYPE_DIAG_OPPOSITE_END;
//
// Full movement notation
//
const MOVEMENT_DIAGONAL_X    = MAIN_DIAGONAL | OPPOSITE_DIAGONAL;
const MOVEMENT_DIRECTION_ALL = MOVEMENT_DIRECTION_COLUMN 
                                | MOVEMENT_DIRECTION_LINE 
                                | MOVEMENT_DIRECTION_DIAGONAL
                                | MOVEMENT_DIRECTION_L;

const MOVEMENT_COLUMN_ALL = SUBTYPE_COLUMN_TOP | SUBTYPE_COLUMN_BOTTOM;  
const MOVEMENT_LINE_ALL   = SUBTYPE_LINE_LEFT  | SUBTYPE_LINE_RIGHT;            
const MOVEMENT_MAIN_ALL   = MOVEMENT_COLUMN_ALL | MOVEMENT_LINE_ALL | SUBTYPE_DIAG_ALL;

const MOVEMENT_DIRECTION_SUBTYPE_ALL  = MOVEMENT_DIRECTION_ALL | MOVEMENT_MAIN_ALL;
const MOVEMENT_TYPE_ALL               = MOVEMENT_DIRECTION_ALL | MOVEMENT_MAIN_ALL | SPECIAL_MOVEMENT_ALL;

//
// Piece movement
//

// ROOK
const ROOK_INITIAL_MOVEMENT = MOVEMENT_DIRECTION_COLUMN
                                | MOVEMENT_DIRECTION_LINE
                                | SPECIAL_MOVEMENT_CASTLE;
const ROOK_CASTLED_MOVEMENT = (ROOK_INITIAL_MOVEMENT ^ SPECIAL_MOVEMENT_CASTLE)
const ROOK_MOVEMENT_RANGE   = LINE_OF_SIGHT;

// KNIGHT  
const KNIGHT_INITIAL_MOVEMENT = MOVEMENT_DIRECTION_L;
const KNIGHT_MOVEMENT_RANGE   = L_RANGE; // 2 movements 4way expressed

// BISHOP
const BISHOP_INITIAL_MOVEMENT = MOVEMENT_DIRECTION_DIAGONAL
const BISHOP_MOVEMENT_RANGE   = LINE_OF_SIGHT;

// QUEEN
const QUEEN_INITIAL_MOVEMENT =  MOVEMENT_DIRECTION_COLUMN
                            | MOVEMENT_DIRECTION_LINE
                            | MOVEMENT_DIRECTION_DIAGONAL;
const QUEEN_MOVEMENT_RANGE  = LINE_OF_SIGHT;

// KING
const KING_INITIAL_MOVEMENT = SPECIAL_MOVEMENT_CASTLE
                            | MOVEMENT_DIRECTION_COLUMN
                            | MOVEMENT_DIRECTION_LINE
                            | MOVEMENT_DIRECTION_DIAGONAL;
const KING_CASTLED_MOVEMENT = (KING_INITIAL_MOVEMENT ^ SPECIAL_MOVEMENT_CASTLE)
const KING_MOVEMENT_RANGE   =  SQUARE_RANGE;

// PAWN
const PAWN_INITIAL_MOVEMENT = MOVEMENT_DIRECTION_COLUMN
                                | SUBTYPE_COLUMN_TOP
                            | MOVEMENT_DIRECTION_DIAGONAL
                                | SUBTYPE_DIAG_MAIN_BEGIN
                                | SUBTYPE_DIAG_OPPOSITE_END;
const PAWN_INITIAL_RANGE = DOUBLE_SQUARE_RANGE;
const PAWN_MOVED_RANGE   = SQUARE_RANGE;

const PIECE_TYPE_ROOK    = 'R';
const PIECE_TYPE_KNIGHT  = 'N';
const PIECE_TYPE_BISHOP  = 'B';
const PIECE_TYPE_QUEEN   = 'Q';
const PIECE_TYPE_KING    = 'K';
const PIECE_TYPE_PAWN    = 'P';
const PIECE_TYPE_NONE    =  0;

const pieceColumnLookup = [
    PIECE_TYPE_ROOK,
    PIECE_TYPE_KNIGHT,
    PIECE_TYPE_BISHOP,
    PIECE_TYPE_QUEEN, 
    PIECE_TYPE_KING, 
    PIECE_TYPE_PAWN,  
    PIECE_TYPE_NONE 
]

const pieceTypeByColumn = [
    SQUARE_TYPE_ROOK_PIECE,     // a
    SQUARE_TYPE_KNIGHT_PIECE,   // b
    SQUARE_TYPE_BISHOP_PIECE,   // c  
    SQUARE_TYPE_QUEEN_PIECE,    // d 
    SQUARE_TYPE_KING_PIECE,     // e 
    SQUARE_TYPE_BISHOP_PIECE,   // f  
    SQUARE_TYPE_KNIGHT_PIECE,   // g   
    SQUARE_TYPE_ROOK_PIECE      // h     
];

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
const MAIN_DIAGONAL_DIRECTION     = [ TOP_LEFT_DIRECTION, BOTTOM_RIGHT_DIRECTION];
const OPPOSITE_DIAGONAL_DIRECTION = [ TOP_RIGHT_DIRECTION, BOTTOM_LEFT_DIRECTION];
const DIAGONAL_DIRECTION          = [ MAIN_DIAGONAL_DIRECTION, OPPOSITE_DIAGONAL_DIRECTION]

const CROSS_DIRECTION             = LINE_DIRECTION.concat(COLUMN_DIRECTION);
const STAR_DIRECTION              = CROSS_DIRECTION.concat(MAIN_DIAGONAL_DIRECTION).concat(OPPOSITE_DIAGONAL_DIRECTION);

const BLANK_ON_ORIGIN = 'BLKORIGIN';
const FULL_SWAP       = 'FULLSWAP';

const FRIENDLY_SIDE   = 'FRIENDLY';
const ENEMY_SIDE      = 'ENEMY';

const SQUARE_TYPE_BLACK_PIECE = 'BLACKPIECE';
const SQUARE_TYPE_WHITE_PIECE = 'WHITEPIECE';

const PAWN_INIT_ROWS      = ["2", "7"];
const HIGHVALUE_INIT_ROWS = ["1", "8"];

const WHITEPIECE_ROWS  = ["1", "2"];
const BLACKPIECE_ROWS  = ["7", "8"];
const BLANKSQUARE_ROWS = ["3", "4", "5", "6"];

const avaliableColors = ['WHITEPIECE','BLACKPIECE'];
const BLANK_SQUARE_COLOR = 0;

const columnArray = ['a','b','c','d','e','f','g','h'];

const FILTER_ROW = 0;
const FILTER_COLUMN = 1;
const FILTER_COLOR = 2
const FILTER_TYPE = 3
const FILTER_SELECTED = 4
const FILTER_NOT_SELECTED = 5
const FILTER_EMPTY = 6
                  //  'row', 'column', 'color', 'type', 'selected', 'notselected', 'empty'
let filterDetails = [  -1,     -1,       -1,     -1,       -1,         -1,           -1];

let capturedPieces = "";

let LSquares = [];

let intervalSeconds = 5;
let intervalTime = intervalSeconds * 1000;
let myInterval;

let playerColor = 'BLACKPIECE';
let supervisorMode = false;


function toggleSupervisor(){
    supervisorMode = !supervisorMode;
    drawSquareDetails();
}
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
                document.getElementById(mySquareLeft).setAttribute("mvsl","1");
            }
        }
        mySquareRight = getSquare(square,pair[1][0])
        if ( mySquareRight ){
            mySquareRight = getSquare(document.getElementById(mySquareRight),pair[1][1]);
            
            if ( mySquareRight ){
                LSquares.push(mySquareRight);
                document.getElementById(mySquareRight).setAttribute("mvsl","1");
            }
        }
    });
}                

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
        sqType = pieceTypeByColumn[columnArray.indexOf(square.id[0])];
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
        lSquare  = getSquare(square, LEFT);
        rSquare  = getSquare(square, RIGHT);
        tSquare  = getSquare(square, TOP);
        bSquare  = getSquare(square, BOTTOM);
    
    return {
        squareElem:          square,
        squareId:            square.id,
        topLeftSquare:       tlSquare,
        topRightSquare:      trSquare,
        bottomLeftSquare:    blSquare,
        bottomRightSquare:   brSquare,
        topSquare:           tSquare,
        rightSquare:         rSquare,
        leftSquare:          lSquare,
        bottomSquare:        bSquare,
        initSquareId:        square.id,
        squareType:          sqType,
        squareColor:         sqColor
    };
}
function getSquare(square, relativePosition){
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
    if ( relativePosition.length > 1 ) {
        if ( allPos[relativePosition[0]] == -1 || allPos[relativePosition[1]] == -1 )
            return false; 
        
    
        return "" + allPos[relativePosition[0]] + allPos[relativePosition[1]];
    }
    if (  allPos[relativePosition] == -1 )
        return false;

    if ( isLetter(allPos[relativePosition]) )
        return "" + allPos[relativePosition] + indexNotation;
    
    return "" + columnNotation + allPos[relativePosition];
}

function highlightSelection(direction, elem){
    let myClass = -1 ;
    if ( LINE_DIRECTION.includes(direction) )
        myClass = getClassNameFromMovementDirection(MOVEMENT_DIRECTION_LINE);
    else if ( COLUMN_DIRECTION.includes(direction) )  
        myClass = getClassNameFromMovementDirection(MOVEMENT_DIRECTION_COLUMN);
    else if ( MAIN_DIAGONAL_DIRECTION.includes(direction) )
        myClass = getClassNameFromMovementDirection(MOVEMENT_DIRECTION_DIAGONAL);
    else if ( OPPOSITE_DIAGONAL_DIRECTION.includes(direction) )
        myClass = getClassNameFromMovementDirection(MOVEMENT_DIRECTION_DIAGONAL);
    
    let bgcAttr = elem.getAttribute('bgc');
    if ( bgcAttr.includes('dark') && myClass != bgcAttr ){
        myClass += 'dark';
    }
    $(document.querySelectorAll('[mvsl]')).removeClass(bgcAttr);
    $(document.querySelectorAll('[mvsl]')).addClass(myClass);
}

function getDirectionFromSquare(square, direction, range=LINE_OF_SIGHT, ignoreColision=false){
    if ( Array.isArray(direction) && direction.length > 1 ){
        direction.map(myDir =>{
            getDirectionFromSquare(square, myDir, range, ignoreColision);
        });
        return;
    }
    square.setAttribute("mvsl","1");
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
        if ( 
            !(
                (direction == TOP_LEFT_DIRECTION || direction == TOP_RIGHT_DIRECTION)  
                && mySquareType == PIECE_TYPE_PAWN
            ) 
            )
        {
            nextSqElem.setAttribute("mvsl", "1");
        }
        else if ( !(direction == TOP_LEFT_DIRECTION || direction == TOP_RIGHT_DIRECTION) ){
            
            nextSqElem.setAttribute("mvsl", "1");
        }
        else{
            nextSqElem.removeAttribute("mvsl");
        }

        highlightSelection(direction, nextSqElem);
        movDir = nextSqElem.getAttribute(direction);
        i++;
    }

    return true;
}

// O array de highlight as 4 primeiras posicoes sao as classes
// os nossos movimentos sao 4 bits de um byte, na mesma sequencia da respectiva classe
// entao fazemos um shift right bem maroto.
function getClassNameFromMovementDirection(baseMovementDirection){
    let i = 0;
    for ( ; baseMovementDirection > 0 ; i++ ){
        baseMovementDirection = baseMovementDirection >> 1;
    }
    return highlightClasses[i-1];
}

function validateIsSelected(){
    return getAllSelectedElements();
}
function validateIsBlank(square){
    return square.getAttribute("sqtype") == SQUARE_TYPE_BLANK;
}
function validateIsNotBlank(square){
    return !validateIsBlank(square);
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
        if ( matchMovementDirection(myMovType, MOVEMENT_COLUMN_ALL) == 0 )
            myMovType = myMovType | MOVEMENT_COLUMN_ALL;

        if ( matchMovementDirection(myMovType, SUBTYPE_COLUMN_TOP) )
            getDirectionFromSquare(getFirstSelectedElement(), TOP_DIRECTION, myMovRange);            
        if ( matchMovementDirection(myMovType, SUBTYPE_COLUMN_BOTTOM) )
            getDirectionFromSquare(getFirstSelectedElement(), BOTTOM_DIRECTION, myMovRange);
        
    }
    if ( matchMovementDirection(myMovType, MOVEMENT_DIRECTION_LINE) ){
        if ( matchMovementDirection(myMovType, MOVEMENT_LINE_ALL) == 0 )
            myMovType = myMovType | MOVEMENT_LINE_ALL;

        if ( matchMovementDirection(myMovType, SUBTYPE_LINE_LEFT) )
            getDirectionFromSquare(getFirstSelectedElement(), LEFT_DIRECTION, myMovRange);            
        if ( matchMovementDirection(myMovType, SUBTYPE_LINE_RIGHT) )
            getDirectionFromSquare(getFirstSelectedElement(), RIGHT_DIRECTION, myMovRange);
    }
    if ( matchMovementDirection(myMovType, MOVEMENT_DIRECTION_L) ){
        getLSquaresFromSquare(getFirstSelectedElement());
    }
    
    if ( !square.getAttribute('mvsl') && !square.classList.contains("captureclass") ){
        return false;
    }
    
    return true;
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
        return (!validateIsSelected()
               && validateIsNotBlank(square)
               && validatePlayerColorSquare(square));
}
function drawSquare(squareId, myInner=""){
    let divSquare = document.createElement('div');
    divSquare.id = squareId;
    divSquare.innerHTML = myInner;
    divSquare.setAttribute("square", "1");
    divSquare.setAttribute("clm", squareId[0]);
    divSquare.setAttribute("ldnx", squareId[1]);
    divSquare.addEventListener('click', squareHandler)

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
      for (let element of document.querySelectorAll('*')) {
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
    if ( !square.classList.contains("captureclass")){
        return false;
    }
    return true;
}
function hasAnySquareDrew(){
    return (document.querySelectorAll('[square="1"]').length > 0);
}
function moveSquare(square){
    return (validateIsSelected() 
           && validateIsBlank(square)
           && validateIsOnRange(square));
}
function changeSelectedSquare(square){
    return validateIsSelected() &&
     (validateSelectedPieceSquare(square) == FRIENDLY_SIDE);
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
function setClassByBGAttr(className, bgcAttr, squareId){
    if ( className != bgcAttr && bgcAttr.includes('dark') ){
        className += 'dark';
    }
    document.getElementById(squareId).classList.add(className);
}
function clearElementSelection(elem){
    document.getElementById(elem.id).removeAttribute('sltd');
    document.getElementById(elem.id).removeAttribute('mvsl');
}
function setBGColorAsDOMAttributeAndRemove(elemId){
    let myClassName = bgBoardColors[DARK_BGCOLOR];
    let myElem = document.getElementById(elemId);
    if ( !myElem.classList.contains(myClassName) )
        myClassName = bgBoardColors[LIGHT_BGCOLOR];

    if ( myElem.classList.contains(myClassName) ) {
        myElem.setAttribute("bgc", myClassName);
        myElem.classList.remove(myClassName);
    }
    return myClassName;
}
function clearAllElementSelection(){
    document.querySelectorAll('[sltd]').forEach(element => {
        element.removeAttribute('sltd');
    });
    document.querySelectorAll('[mvsl]').forEach(element => {
        element.removeAttribute('mvsl');
    });
    document.querySelectorAll('[bgc]').forEach(element => {
        //let bgcAttr = setBGColorAsDOMAttributeAndRemove(element.id);
        let bgcAttr = document.getElementById(elementId).getAttribute("bgc");
        setClassByBGAttr(bgcAttr, bgcAttr, element.id);
    });  
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

    // Square aliado e
    // SEM selecao previa ou COM selecao previa 
    if ( selectSquare(event.target) /*|| changeSelectedSquare(event.target)*/ ){
        if ( validateIsSelected() ){
            let oldelem = getFirstSelectedElement();
            clearElementSelection(oldelem);
        }
        setElementAsSelected(event.target);
        highlightSquares(event.target);
    }
    // Selecao previa + square sem pecas ou
    // Selecao previa + square com pecas inimigas
    else if ( moveSquare(event.target) || captureSquare(event.target) ){
        let oldelem = getFirstSelectedElement();
        event.target.innerHTML = oldelem.innerHTML;
        oldelem.innerHTML = "";
        if ( !validateIsBlank(event.target) ){
            capturedPieces +=  
            event.target.getAttribute('sqcolor').split("PIECE")[0][0] 
            + event.target.getAttribute('sqtype').split("PIECE")[0][0]
            + event.target.id[0] + " ";
        }
        
        clearAllElementSelection();
        event.target.setAttribute("sqcolor", oldelem.getAttribute("sqcolor"))
        event.target.setAttribute("sqtype", oldelem.getAttribute("sqtype"))
        event.target.setAttribute("initsq", oldelem.getAttribute("initsq"))
        event.target.setAttribute("mvd", "1");
        oldelem.setAttribute("sqcolor", "0");
        oldelem.setAttribute("sqtype", SQUARE_TYPE_BLANK);
    }
    //drawSquareDetails();

}
function drawHorizontalSubtitles(){
    marginLeft = 140;
    columnArray.map(function (columnAlpha,clmndx){        
        let subtitle  =  document.createElement('div');
        subtitle.innerHTML = columnAlpha;
        subtitle.style.marginLeft = marginLeft+"px";
        subtitle.style.marginTop = "690px";
        subtitle.style.position = 'absolute'; 
        subtitle.style.color= 'black'; 
        subtitle.style.fontWeight= 'bold';
        subtitle.style.fontSize= "20px";
        document.getElementById('container').appendChild(subtitle);
        marginLeft += 81;
    });
}
function readyHandler(event){
    event.preventDefault();

    if ( document.getElementById('a1') != null )
        return;

    drawBoardSquares(GAME_CONTEXT_INITIAL, null);

    $('#board').css("transform", "scaleY(-1)");

    drawHorizontalSubtitles();
}
// function saveBoardOnLocalStorage(){
//     for ( let rowNdx = 1; rowNdx < 9; rowNdx++ ){
//         columnArray.map( function (columnAlpha, clmndx){
//             try{
//                 var squareColorSeq = DARK_BGCOLOR;
//                 if ( clmndx % 2 != rowColorToggle ) {
//                     squareColorSeq = LIGHT_BGCOLOR;
//                 }
//                 let candidateElem = drawSquare(columnAlpha+rowNdx, "");
//                 const newsquare = createSquare(candidateElem);
                
//                 marginLeft += 80;
//                 newsquare.squareElem.style.position = 'absolute';
//                 newsquare.squareElem.style.marginLeft = marginLeft+"px";
//                 newsquare.squareElem.style.marginTop = marginTop+"px";
//                 newsquare.squareElem.style.color = 'black';
//                 newsquare.squareElem.classList.add(bgBoardColors[squareColorSeq]);
//                 newsquare.squareElem.setAttribute("bgc", bgBoardColors[squareColorSeq]); 
//                 newsquare.squareElem.setAttribute("sqtype", newsquare.squareType);
//                 newsquare.squareElem.setAttribute("sqcolor", newsquare.squareColor);
//                 newsquare.squareElem.setAttribute("tlsq", newsquare.topLeftSquare);
//                 newsquare.squareElem.setAttribute("trsq", newsquare.topRightSquare);
//                 newsquare.squareElem.setAttribute("brsq", newsquare.bottomRightSquare);
//                 newsquare.squareElem.setAttribute("blsq", newsquare.bottomLeftSquare);
//                 newsquare.squareElem.setAttribute("tsq", newsquare.topSquare);
//                 newsquare.squareElem.setAttribute("bsq", newsquare.bottomSquare);
//                 newsquare.squareElem.setAttribute("lsq", newsquare.leftSquare);
//                 newsquare.squareElem.setAttribute("rsq", newsquare.rightSquare);
//                 newsquare.squareElem.innerHTML = newsquare.squareType.split("PIECE")[0];
//                 if (  newsquare.squareColor != BLANK_SQUARE_COLOR ){
//                     newsquare.squareElem.setAttribute("ptype", getPieceTypeFromSquareType(newsquare.squareType));
//                     newsquare.squareElem.setAttribute("initsq", newsquare.initSquareId);
//                 }
//                 else{
//                     newsquare.squareElem.innerHTML = "";
//                 } 
//             }
//         }
//     }
// }

function setSuperVisorDiv(divId, mgTop){
    let supervisor = document.createElement('div');
    supervisor.style.position = 'absolute'; 
    supervisor.id = "slp" + (divId);
    supervisor.style.marginLeft = "780px";
    supervisor.style.marginTop = mgTop+"px";
    supervisor.classList.add('supervisordiv');
    document.getElementById('container').appendChild(supervisor);
}
function drawBoardSquares(context, objSquareArr=null){
    const board = document.getElementById('board');
    let storageSquares = [];
    let marginLeft = 0;
    let marginTop = 0;
    let supervisorMarginTop = 40;
    let supervisoridCtr = 0;
    let rowColorToggle = false;
    let i = 0;
    destroySquares();
    for ( let rowNdx = 1; rowNdx < 9; rowNdx++ ){
        columnArray.map(function (columnAlpha, clmndx){
            try{
                var squareColorSeq = DARK_BGCOLOR;
                if ( clmndx % 2 != rowColorToggle ) {
                    squareColorSeq = LIGHT_BGCOLOR;
                }
                
                let candidateElem = drawSquare(columnAlpha+rowNdx, "");
                const newsquare = createSquare(candidateElem);
                
                marginLeft += 80;
                newsquare.squareElem.style.position = 'absolute';
                newsquare.squareElem.style.marginLeft = marginLeft+"px";
                newsquare.squareElem.style.marginTop = marginTop+"px";
                newsquare.squareElem.style.color = 'black';
                newsquare.squareElem.classList.add(bgBoardColors[squareColorSeq]);
                newsquare.squareElem.setAttribute("bgc", bgBoardColors[squareColorSeq]); 
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
                newsquare.squareElem.innerHTML = newsquare.squareType.split("PIECE")[0];
                if ( newsquare.squareColor != BLANK_SQUARE_COLOR ){
                    let attrPieceType = "pc"+getPieceTypeFromSquareType(newsquare.squareType).toUpperCase();
                    newsquare.squareElem.setAttribute(attrPieceType,"1");
                    newsquare.squareElem.setAttribute("initsq", newsquare.initSquareId);
                }
                else{
                    newsquare.squareElem.innerHTML = ""
                } 
                board.appendChild(newsquare.squareElem);

                setSuperVisorDiv(supervisoridCtr, supervisorMarginTop);
                supervisoridCtr++;
                supervisorMarginTop += 20;
                
                storageSquares[i++] = newsquare;
            }
            catch(err){
                alert(err.message);
            }
        });
        marginTop += 80;
        marginLeft = 0;
        
        rowColorToggle = !rowColorToggle;
    }
    window.localStorage.setItem("gameBoard", JSON.stringify( { ...storageSquares} ));
}

function drawInitialBoard(boardId, buttonreadyHandler){
     const createbtn = document.getElementById(boardId);
     createbtn.addEventListener('click', buttonreadyHandler);
}
function destroySupervisorFrame(){
    document.querySelectorAll('[id^=spsb]').forEach(element => {
        document.getElementById("container").removeChild(element);
    });   
    setSupervisorListVisibility(VISIBILITY_HIDDEN);
}
function destroySquares(){
    document.querySelectorAll('[square]').forEach(element => {
        $(element).remove();
    });
}
function drawSupervisorSelect(){
    let radioElem = [-1,-1];
    let radioLbl = [-1,-1];
    let selectColumn = -1;
    let selectType = -1;
    let typeValue = -1
    let selectRow = -1;
    let columnVal = -1;
    let rowVal = -1;
    let radioVal = -1;
    let typePieceSelected = false;
    let option = -1;
    filterDetails = [-1, -1,-1, -1, -1, -1, -1];
  
    // Coluna
    selectColumn = document.getElementById('spsbselectcolumn');
    columnVal = -1;
    if ( selectColumn != null ){
        columnVal = selectColumn.value;
    }
    document.querySelectorAll('[id="spsbselectcolumn"]').forEach(element => {
        document.getElementById("container").removeChild(element);
    });  
    selectColumn = document.createElement("select");
    selectColumn.id = "spsbselectcolumn";
    selectColumn.style.position = 'absolute';
    selectColumn.style.marginTop = '10px';
    selectColumn.style.marginLeft = '780px';
    selectColumn.addEventListener('change', drawSquareDetails);
    option = document.createElement("option");
    option.value = -1;
    option.text = "Coluna:";
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

    // Linha
    selectRow = document.getElementById('spsbselectrow');
    rowVal = -1;
    if ( selectRow != null ){
        rowVal = selectRow.value;
    }
    document.querySelectorAll('[id="spsbselectrow"]').forEach(element => {
        document.getElementById("container").removeChild(element);
    });  
    selectRow = document.createElement("select");
    selectRow.id = "spsbselectrow";
    selectRow.style.position = 'absolute';
    selectRow.style.marginTop = '10px';
    selectRow.style.marginLeft = '870px';
    selectRow.addEventListener('change', drawSquareDetails);
    option = document.createElement("option");
    option.value = -1;
    option.text = "Linha:";
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

    // Cores
    radioElem[0] = document.getElementById('spsbrdwhite');
    radioElem[1] = document.getElementById('spsbrdblack');
    radioElem[2] = document.getElementById('spsbrdboth');
    radioLbl[0]  = document.getElementById('spsblblrdwhite');
    radioLbl[1]  = document.getElementById('spsblblrdblack');
    radioLbl[2]  = document.getElementById('spsblblrdboth');
    radioVal = -1;
    if ( radioElem[0] != null ){
        radioVal = (radioElem[0].checked) ? radioElem[0].value : -1;
    }
    if ( radioElem[1] != null ){
        if ( radioVal == -1 ){
            radioVal = (radioElem[1].checked) ? radioElem[1].value : -1;
        }
    }
    if ( radioElem[2] != null ){
        if ( radioVal == -1 ){
            radioVal = (radioElem[2].checked) ? radioElem[2].value : -1;
        }
    }
    document.querySelectorAll('[id="spsbrdwhite"]').forEach(element => {
        document.getElementById("container").removeChild(element);
    });  
    document.querySelectorAll('[id="spsbrdblack"]').forEach(element => {
        document.getElementById("container").removeChild(element);
    });  
    document.querySelectorAll('[id="spsblblrdwhite"]').forEach(element => {
        document.getElementById("container").removeChild(element);
    });  
    document.querySelectorAll('[id="spsblblrdblack"]').forEach(element => {
        document.getElementById("container").removeChild(element);
    }); 
    document.querySelectorAll('[id="spsbrdboth"]').forEach(element => {
        document.getElementById("container").removeChild(element);
    });  
    document.querySelectorAll('[id="spsblblrdboth"]').forEach(element => {
        document.getElementById("container").removeChild(element);
    });  

    // White Label
    radioLbl[0] = document.createElement("label");
    radioLbl[0].for = "spsbrdwhite";
    radioLbl[0].id = "spsblblrdwhite";
    radioLbl[0].innerHTML = "White:";
    radioLbl[0].style.position = 'absolute';
    radioLbl[0].style.marginTop = '10px';
    radioLbl[0].style.marginLeft = '940px';
    // White Radio
    radioElem[0] = document.createElement("input");
    radioElem[0].type = 'radio';
    radioElem[0].id = "spsbrdwhite";
    radioElem[0].value = "WHITEPIECE";
    if ( radioVal == radioElem[0].value )
        radioElem[0].checked = true;

    radioElem[0].name="colors";
    radioElem[0].style.position = 'absolute';
    radioElem[0].style.marginTop = '13px';
    radioElem[0].style.marginLeft = '985px';
    radioElem[0].addEventListener('change', drawSquareDetails);

    // Black Label
    radioLbl[1] = document.createElement("label");
    radioLbl[1].for = "spsbrdblack";
    radioLbl[1].id = "spsblblrdblack";
    radioLbl[1].innerHTML = "Black:";
    radioLbl[1].style.position = 'absolute';
    radioLbl[1].style.marginTop = '10px';
    radioLbl[1].style.marginLeft = '1005px';
    // Black Radio
    radioElem[1] = document.createElement("input");
    radioElem[1].type = 'radio';
    radioElem[1].id = "spsbrdblack";
    radioElem[1].value = "BLACKPIECE";  
    if ( radioVal == radioElem[1].value )
        radioElem[1].checked = true;

    radioElem[1].name="colors";
    radioElem[1].style.position = 'absolute';
    radioElem[1].style.marginTop = '13px';
    radioElem[1].style.marginLeft = '1050px';
    radioElem[1].style.border = '10px blue solid';
    radioElem[1].addEventListener('change', drawSquareDetails);

    // // Label Ambos
    // radioLbl[2] = document.createElement("label");
    // radioLbl[2].for = "spsbrdboth";
    // radioLbl[2].id = "spsblblrdboth";
    // radioLbl[2].innerHTML = "Tudo:";
    // radioLbl[2].style.position = 'absolute';
    // radioLbl[2].style.marginTop = '10px';
    // radioLbl[2].style.marginLeft = '1340px';
    // // Radio button Ambos
    // radioElem[2] = document.createElement("input");
    // radioElem[2].type = 'radio';
    // radioElem[2].id = "spsbrdboth";
    // radioElem[2].value = "both";  
    // if ( radioVal == radioElem[2].value )
    //     radioElem[2].checked = true;

    // radioElem[2].name="colors";
    // radioElem[2].style.position = 'absolute';
    // radioElem[2].style.marginTop = '13px';
    // radioElem[2].style.marginLeft = '1395px';
    // radioElem[2].addEventListener('change', drawSquareDetails);

    // Tipo de peça
    let pieceTypeChkbox = [];
    let labelType = [];
    let pieceTypeFilter = "";
    let marginLeftOffset = 55;
    let initialOffset = 1075;
    let marginTop = -2;
    for (var i = 0; i < 5; i++) {
        pieceTypeChkbox[i] = document.getElementById('spsbchkboxtype'+i);
        if ( pieceTypeChkbox[i] != null ){
            typeValue.selected = 1;
            pieceTypeFilter = "[pc" + pieceColumnLookup[i]+ "='1']"
        }
        document.querySelectorAll('[id=spsbchkboxtype'+i+']').forEach(element => {
            document.getElementById("container").removeChild(element);
        });
        document.querySelectorAll('[id=spsblbltype'+i+']').forEach(element => {
            document.getElementById("container").removeChild(element);
        });

        labelType[i] = document.createElement("label");
        labelType[i].for = "spsbchkboxtype"+i;
        labelType[i].id = "spsblbltype"+i;
        labelType[i].innerHTML = pieceTypeByColumn[i].split("PIECE")[0]+":";
        labelType[i].style.position = 'absolute';
        labelType[i].style.marginTop = marginTop+'px';
        labelType[i].style.marginLeft = initialOffset+"px";

        initialOffset += marginLeftOffset
        pieceTypeChkbox[i] = document.createElement("input");
        pieceTypeChkbox[i].type = "checkbox";
        pieceTypeChkbox[i].id = "spsbchkboxtype"+i;
        pieceTypeChkbox[i].style.position = 'absolute';
        pieceTypeChkbox[i].style.marginTop = (marginTop+3)+'px';
        pieceTypeChkbox[i].style.marginLeft = initialOffset+"px";
        
        if ( typeValue ){
          pieceTypeChkbox[i].selected = 1;
          pieceTypeFilter += "[pc" + pieceColumnLookup[i] + "='1']"
        }
        initialOffset = (initialOffset + 20);
        marginLeftOffset = (marginLeftOffset + 10);
        if ( i == 2 ){
            marginTop = 15;
            initialOffset = 1075;
            marginLeftOffset = 55;
        } 
    }

    labelType[i] = document.createElement("label");
    labelType[i].for = "spsbchkboxtype"+i;
    labelType[i].id = "spsblbltype"+i;
    labelType[i].innerHTML = SQUARE_TYPE_PAWN_PIECE + ":";
    labelType[i].style.position = 'absolute';
    labelType[i].style.marginTop = '15px';
    labelType[i].style.marginLeft = initialOffset+"px";
    initialOffset += 95;
    pieceTypeChkbox[i] = document.getElementById('spsbchkboxtype'+i);
    if ( pieceTypeChkbox[i] != null ){
        typeValue = pieceTypeChkbox[i].checked;
        pieceTypeFilter += "[" + pieceColumnLookup[i]+ "='1']"
    }
    document.querySelectorAll('[id=spsbchkboxtype'+i+']').forEach(element => {
        document.getElementById("container").removeChild(element);
    });
    document.querySelectorAll('[id=spsblbltype'+i+']').forEach(element => {
        document.getElementById("container").removeChild(element);
    });
    
    pieceTypeChkbox[i] = document.createElement("input");
    pieceTypeChkbox[i].type = "checkbox";
    pieceTypeChkbox[i].id = "spsbchkboxtype"+i;
    pieceTypeChkbox[i].style.position = 'absolute';
    pieceTypeChkbox[i].style.marginTop = '18px';
    pieceTypeChkbox[i].style.marginLeft = initialOffset+"px";
    if ( typeValue ){
        pieceTypeChkbox[i].selected = 1;
    }
    
    // Label seleção
    labelSelected = document.createElement("label");
    labelSelected.for = "spsbcheckslt";
    labelSelected.id = "spsblblcheck";
    labelSelected.innerHTML = "Seleção:";
    labelSelected.style.position = 'absolute';
    labelSelected.style.marginTop = '10px';
    labelSelected.style.marginLeft = '1350px';
    // Checkbox Seleção
    checkSelected = document.getElementById('spsbcheckslt');
    typePieceSelected = false;
    if ( checkSelected != null ){
        typePieceSelected = checkSelected.checked;
    }
    document.querySelectorAll('[id=spsbcheckslt]').forEach(element => {
        document.getElementById("container").removeChild(element);
    });
    document.querySelectorAll('[id=spsblblcheck]').forEach(element => {
        document.getElementById("container").removeChild(element);
    });

    checkSelected = document.createElement("input");
    checkSelected.type = "checkbox";
    checkSelected.id = "spsbcheckslt";
    checkSelected.style.position = 'absolute';
    checkSelected.style.marginTop = '13px';
    checkSelected.style.marginLeft = '1415px';
    if ( typePieceSelected )
        checkSelected.checked = 1;
    
    checkSelected.addEventListener('change', drawSquareDetails);
    let sltd = '[sltd]';
    if ( !typePieceSelected ){
        typePieceSelected = ':not([sltd])';
    }
    else{
        typePieceSelected = sltd;
    }

    // else if ( (selectVal-1) == FILTER_EMPTY ){
    //     radioVal = BLANK_SQUARE_COLOR;
    // }

    filterDetails[FILTER_COLUMN]   = columnVal;
    filterDetails[FILTER_ROW]      = rowVal;
    filterDetails[FILTER_COLOR]    = radioVal;
    filterDetails[FILTER_TYPE]     = pieceTypeFilter;
    filterDetails[FILTER_SELECTED] = typePieceSelected;
    

    document.getElementById("container").appendChild(selectColumn);
    document.getElementById("container").appendChild(selectRow);
    document.getElementById("container").appendChild(radioElem[0]);
    document.getElementById("container").appendChild(radioLbl[0]);
    document.getElementById("container").appendChild(radioElem[1]);
    document.getElementById("container").appendChild(radioLbl[1]);
    pieceTypeChkbox.map((val, ndx) => {
        document.getElementById("container").appendChild(labelType[ndx]);
        document.getElementById("container").appendChild(val);
    });
    if ( selectType != -1 && selectType != null ){
        document.getElementById("container").appendChild(selectType);
    }
    if ( checkSelected != -1 && checkSelected != null ){
        document.getElementById("container").appendChild(labelSelected);
        document.getElementById("container").appendChild(checkSelected);
    }
}
function setDirectionFromSelect(e){  
    if ( e.target.value == -1){
        document.querySelectorAll("[square='1']").forEach(element => {
            element.innerHTML = "";
        });
        return ;
    }
    let mySquare = document.getElementById(e.target.value);
    let drawDiag = document.getElementById('spsbdiagonaldir').checked;
    let drawColumn = document.getElementById('spsbcolumndir').checked;
    let drawLine = document.getElementById('spsblinedir').checked;

    clearAllElementSelection();
    mySquare.setAttribute('sltd', '1');
    if ( drawDiag == true ){
        getDirectionFromSquare(mySquare, MAIN_DIAGONAL_DIRECTION, LINE_OF_SIGHT, IGNORE_COLISION);
        getDirectionFromSquare(mySquare, OPPOSITE_DIAGONAL_DIRECTION, LINE_OF_SIGHT, IGNORE_COLISION);
    }
    if ( drawColumn == true ){
        getDirectionFromSquare(mySquare, COLUMN_DIRECTION, LINE_OF_SIGHT, IGNORE_COLISION);
    }
    if ( drawLine == true ){
        getDirectionFromSquare(mySquare, LINE_DIRECTION, LINE_OF_SIGHT, IGNORE_COLISION);;
    }
    mySquare.removeAttribute('sltd');
}
function drawDirectionSelect(){
    // Select do square a partir do qual serao highlitadas as direcoes
    
    let directionSelected = false;
    let selectElem = document.getElementById('spsbdirectionhlselect');
    if ( selectElem != null ){
        directionSelected = selectElem.value;
        document.getElementById("container").removeChild(selectElem);
    }
    else{
        document.querySelectorAll('[id=spsbdirectionhlselect]').forEach(element => {
            document.getElementById("container").removeChild(element);
        });
    }
    selectElem = document.createElement("select");
    selectElem.id = "spsbdirectionhlselect";
    selectElem.style.position = "absolute";
    selectElem.style.marginTop = "30px";
    selectElem.style.marginLeft = "10px";
    selectElem.addEventListener('change', setDirectionFromSelect);
    let option = document.createElement("option");
    option.value = -1;
    option.text = "Square:";
    selectElem.appendChild(option);
    for ( let rowNdx = 1; rowNdx < 9; rowNdx++ ){
       columnArray.map( function (columnAlpha, clmndx){
            option = document.createElement("option");
            option.value = ""+columnAlpha+rowNdx;
            // alert(option.value);
            if ( directionSelected == option.value )
                option.selected = 1;
            
            option.text = option.value;
            selectElem.appendChild(option);
       }); 
    };
    
    document.querySelectorAll('[id=spsblbldiagonalselect]').forEach(element => {
        document.getElementById("container").removeChild(element);
    });
    let labelElem = document.createElement("label");
    labelElem.id = "spsblbldiagonalselect";
    labelElem.innerHTML = "Diagonal";
    labelElem.style.position = "absolute";
    labelElem.style.marginTop = "10px";
    labelElem.style.marginLeft = "10px";
    
    let checkDirectionDiagonal = document.getElementById('spsbdiagonaldir');
    directionSelected = false;
    if ( checkDirectionDiagonal != null ){
        directionSelected = checkDirectionDiagonal.checked;
        document.getElementById("container").removeChild(checkDirectionDiagonal);
    }
    else{
        document.querySelectorAll('[id=spsbdiagonaldir]').forEach(element => {
            document.getElementById("container").removeChild(element);
        });
    }
    checkDirectionDiagonal = document.createElement("input");
    checkDirectionDiagonal.type = "checkbox";
    checkDirectionDiagonal.id = "spsbdiagonaldir";
    checkDirectionDiagonal.style.position = 'absolute';
    checkDirectionDiagonal.style.marginTop = '13px';
    checkDirectionDiagonal.style.marginLeft = '75px';
    if ( directionSelected )
        checkDirectionDiagonal.checked = 1;

    document.querySelectorAll('[id=spsblblcolumndir]').forEach(element => {
        document.getElementById("container").removeChild(element);
    });
    lblDirColumn = document.createElement("label");
    lblDirColumn.for = "spsbcolumndir";
    lblDirColumn.id = "spsblblcolumndir";
    lblDirColumn.innerHTML = "Coluna";
    lblDirColumn.style.position = 'absolute';
    lblDirColumn.style.marginTop = '10px';
    lblDirColumn.style.marginLeft = '97px';

    let checkDirectionColumn = document.getElementById('spsbcolumndir');
    if ( checkDirectionColumn != null ){
        directionSelected = checkDirectionColumn.checked;
        document.getElementById("container").removeChild(checkDirectionColumn);
    }
    else{
        document.querySelectorAll('[id=spsbcolumndir]').forEach(element => {
            document.getElementById("container").removeChild(element);
        });
        document.querySelectorAll('[id=spsblblcolumndir]').forEach(element => {
            document.getElementById("container").removeChild(element);
        });
    }
    checkDirectionColumn = document.createElement("input");
    checkDirectionColumn.type = "checkbox";
    checkDirectionColumn.id = "spsbcolumndir";
    checkDirectionColumn.style.position = 'absolute';
    checkDirectionColumn.style.marginTop = '13px';
    checkDirectionColumn.style.marginLeft = '147px';
    if ( directionSelected )
        checkDirectionColumn.checked = 1;
    
    document.querySelectorAll('[id=spsblbllinedir]').forEach(element => {
        document.getElementById("container").removeChild(element);
    });
    lblDirLine = document.createElement("label");
    lblDirLine.for = "spsblinedir";
    lblDirLine.id = "spsblbllinedir";
    lblDirLine.innerHTML = "Linha";
    lblDirLine.style.position = 'absolute';
    lblDirLine.style.marginTop = '10px';
    lblDirLine.style.marginLeft = '173px';

    let checkDirectionLine = document.getElementById('spsblinedir');
    if ( checkDirectionLine != null ){
        directionSelected = checkDirectionLine.checked;
        document.getElementById("container").removeChild(checkDirectionLine);
    }
    else{
        document.querySelectorAll('[id=spsblinedir]').forEach(element => {
            document.getElementById("container").removeChild(element);
        });
        document.querySelectorAll('[id=spsblbllinedir]').forEach(element => {
            document.getElementById("container").removeChild(element);
        });
    }
    checkDirectionLine = document.createElement("input");
    checkDirectionLine.type = "checkbox";
    checkDirectionLine.id = "spsblinedir";
    checkDirectionLine.style.position = 'absolute';
    checkDirectionLine.style.marginTop = '13px';
    checkDirectionLine.style.marginLeft = '215px';
    if ( directionSelected )
        checkDirectionLine.checked = 1;
    
    document.getElementById("container").appendChild(labelElem);
    document.getElementById("container").appendChild(selectElem);
    document.getElementById("container").appendChild(checkDirectionDiagonal);
    document.getElementById("container").appendChild(checkDirectionColumn);
    document.getElementById("container").appendChild(lblDirColumn);
    document.getElementById("container").appendChild(checkDirectionLine);
    document.getElementById("container").appendChild(lblDirLine);
    
    
}
function drawIntervalTimeSet(){
    document.querySelectorAll('[id*="textelem"]').forEach(element => {
        document.getElementById("container").removeChild(element);
    });
    let ptextElem = document.createElement("p");
    ptextElem.id = 'spsbptextelem';
    ptextElem.innerHTML = 'Frequencia de <br/>atualizacao do<br/> supervisor(seg):';
    ptextElem.style.position = "absolute";
    ptextElem.style.marginTop = "60px";
    ptextElem.style.marginLeft = "10px";
    document.getElementById("container").appendChild(ptextElem);
    let textElem = document.createElement("input");
    textElem.id = 'spsbtextelem';
    textElem.setAttribute("type", "text");
    textElem.setAttribute("maxlenght", "10");
    textElem.setAttribute("lenght", "10");
    textElem.style.position = "absolute";
    textElem.style.marginTop = "120px";
    textElem.style.marginLeft = "10px";
    textElem.style.width = "30px";
    document.getElementById("container").appendChild(textElem);
    let buttonText = document.createElement("input");
    buttonText.id = 'spsbbttextelem';
    buttonText.setAttribute("type", "button");
    buttonText.style.position = "absolute";
    buttonText.style.marginTop = "120px";
    buttonText.style.marginLeft = "50px";
    buttonText.setAttribute("value", "Enviar");
    buttonText.addEventListener('click', setIntervalSeconds);
    document.getElementById("container").appendChild(buttonText);
}
function setIntervalSeconds(){
    let seconds = document.getElementById('spsbtextelem').value;
    if (  (Number(seconds) > 1) && (Number(seconds) < 20) ){
        intervalSeconds = seconds;
        intervalTime = intervalSeconds * 1000;
        window.clearInterval(myInterval);
        myInterval = window.setInterval(setSupervisorPatrol, intervalTime); 
    }
}
function setSupervisorListVisibility(visibilityStatus){
    document.querySelectorAll('[id^=slp]').forEach(element => {
        element.style.visibility = visibilityStatus;
    });   
}
function drawSquareDetails(){

    if ( supervisorMode == false ){
        destroySupervisorFrame();
        return;
    }
    
    setSupervisorListVisibility(VISIBILITY_VISIBLE);
    drawSupervisorSelect();
    drawDirectionSelect();
    drawIntervalTimeSet();

    let selector = "[square]" ;
    if ( filterDetails[FILTER_COLUMN] != -1 ){
        selector += "[id*='"+columnArray[filterDetails[FILTER_COLUMN]]+"']";
    }
    if ( filterDetails[FILTER_ROW] != -1 ){
        selector += "[id*='"+(Number(filterDetails[FILTER_ROW])+1)+"']";
    }
    if ( filterDetails[FILTER_COLOR] != -1 ){
        if ( filterDetails[FILTER_COLOR] == "both")
            selector += "[sqcolor]";
        else{
            selector += "[sqcolor*='"+filterDetails[FILTER_COLOR]+"']";
        }
    }
    if ( filterDetails[FILTER_TYPE] != -1 ){
        selector += filterDetails[FILTER_TYPE];
    }
    if ( filterDetails[FILTER_SELECTED] != -1 ){
        selector += filterDetails[FILTER_SELECTED];
    }
    document.querySelectorAll("[id*='slp']").forEach(element => {
        element.innerHTML = "";
        element.style.fontWeight= '';
    });

    let supervisoridCtr=0;
    document.querySelectorAll(selector).forEach(element => {
        let supervisordiv = document.getElementById("slp" + (supervisoridCtr++));
        if ( supervisordiv == null )
            return;

        supervisordiv.innerHTML = "";
        supervisordiv.innerHTML += "<b>"+element.id +"</b>"; 
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
        if ( element.getAttribute("sltd") != null ){
            supervisordiv.innerHTML +=" | sltd: " + element.getAttribute("sltd");
            supervisordiv.style.fontWeight= 'bold'; 
        }
    });
    document.getElementById("captured").innerHTML = capturedPieces;
}
function matchColumnIntervalExcludingInterval(initialColumn, endColumn=null, initialInterval=null, endInterval=null){
    let myColumn = initialColumn 
    if ( endColumn != null )
        myColumn  += "-" + endColumn;

    let pattern = "(["+myColumn+"])"
    let interval = -1
    if ( initialInterval )
        interval = initialInterval;
    if ( endInterval )
        interval  += "-" + endInterval;
    if ( interval != -1){
        pattern += "?[^"+interval+"]";
    }
    pattern += "([1-8])$";
    let re = new RegExp(pattern, "g");
    return $(querySelectorAllRegex(re, "id"));
}
function matchLineIntervalExcludingInterval(initialLine, endLine=null, initialInterval=null, endInterval=null){
    let myLine = initialLine 
    if ( endLine != null )
        myLine  += "-" + endColumn;

    let pattern = "([a-h])"
    let interval = -1;
    if ( initialInterval )
        interval = initialInterval;
    if ( endInterval )
        interval  += "-" + endInterval;
    if ( interval != -1){
        pattern += "?[^"+interval+"]";
    }
    pattern += "(["+myLine+"])$";
    let re = new RegExp(pattern, "g");
    return $(querySelectorAllRegex(re, "id"));
}
function setSupervisorPatrol(){
    if ( !hasAnySquareDrew() )
        return;

    drawSquareDetails();   
    // fixSquareTypeProprierties();
}

function fixSquareTypeProprierties(){
    selector = "[class*='square'][sqtype='BLANK']";
    document.querySelectorAll(selector).forEach(element => {
        if ( element != null ){
            document.getElementById(element.id).setAttribute("sqcolor", "0");
            document.getElementById(element.id).removeAttribute('sltd');
            element.innerHTML = "";
        }
    });
    selector = "[class*='square']:not([sqcolor='0'])";
    document.querySelectorAll(selector).forEach(element => {
        element.setAttribute("sqtype", pieceTypeByColumn[columnArray.indexOf(element.getAttribute('initsq')[0])]);
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
function hasMoved(squareId){
    return (document.getElementById(squareId).getAttribute('mvd') == 1);
}
$(document).ready(function (){

    playerColor = avaliableColors[0];
    myInterval = window.setInterval(setSupervisorPatrol, intervalTime);
    
});

drawInitialBoard("boardcreate", readyHandler);