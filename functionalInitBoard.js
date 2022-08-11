/////////////////////////////////////////////////////////////
//
//    Board block
//
//
const TOTAL_PIECE_COUNT = 16;
const PLAYER_PIECE_COUNT = TOTAL_PIECE_COUNT / 2;

const ROW_SQUARE_COUNT = 8;
const COLUMN_SQUARE_ROW = 8;

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
    "goldenrod",
    "goldenroddark",
    "silverbuenao",
    "silverbuenaodark"
];

const captureClasses =
[
    "capturehl",
    "capturehldark"             
];

const pieceSpecialClasses =
[
    "goldenrod",
    "goldenroddark",
    "silverbuenao",
    "silverbuenaodark"             
];

const bgBoardColors = [
    "darksquarecolor",
    "lightsquarecolor"
];

const columnArray = ['a','b','c','d','e','f','g','h'];
const revColumn   = ['h','g','f','e','d','c','b','a']

const SQUARE_TYPE_BLACK_PIECE = 'BLACKPIECE';
const SQUARE_TYPE_WHITE_PIECE = 'WHITEPIECE';
const BLANK_SQUARE_COLOR = 0;

const PAWN_INIT_ROWS      = ["2", "7"];
const HIGHVALUE_INIT_ROWS = ["1", "8"];

const WHITEPIECE_INIT_ROWS  = ["1", "2"];
const BLACKPIECE_INIT_ROWS  = ["7", "8"];
const BLANKSQUARE_INIT_ROWS = ["3", "4", "5", "6"];

const GAME_CONTEXT_INITIAL     = 0;
const GAME_CONTEXT_PLAYING     = 1;
const GAME_CONTEXT_SKIP_PIECES = 2;
const GAME_CONTEXT_SKIP_SIDE   = 3;

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

const SQUARE_ALPHABETICAL_NDX = 0;
const SQUARE_NUMERIC_NDX      = 1;

let blankFrameStr = 'sqtype="BLANK" sqcolor="0"></div>';

const LONG_CASTLE_INIT_SQUARES  = [ 'a1', 'a8' ];
const SHORT_CASTLE_INIT_SQUARES = [ 'h1', 'h8' ];

const LONG_CASTLE_ROOK_SQUARES  = [ 'd1', 'd8' ];
const SHORT_CASTLE_ROOK_SQUARES = [ 'f1', 'f8' ];

const LONG_CASTLE_KING_SQUARES = [ 'c1', 'c8' ];
const SHORT_CASTLE_KING_SQUARES = [ 'g1', 'g8' ];

const LONG_CASTLE_NDX  = 0; 
const SHORT_CASTLE_NDX = 1;

const CASTLE_INIT_SQUARES = [ LONG_CASTLE_INIT_SQUARES, SHORT_CASTLE_INIT_SQUARES ];

//
//
//////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
//
//    Movement Block
//
//
const MOVEMENT_CHAIN_ORIGIN      = 0;
const MOVEMENT_CHAIN_DESTINATION = 1;

const DEFAULT_MOVEMENT_SELECTION    = 1;
const CASTLE_MOVEMENT_SELECTION     = 2;
const EN_PASSANT_MOVEMENT_SELECTION = 3;
const PROMOTION_MOVEMENT_SELECTION  = 4;

const SHORT_CASTLE_TYPE = 0x01;
const LONG_CASTLE_TYPE  = 0x02;  
const BOTH_CASTLE_TYPE  = SHORT_CASTLE_TYPE | LONG_CASTLE_TYPE ;

const GET_BOOLEAN_POSSIBILITY = false;
const GET_POSSIBLE_TYPES = true;

const CONSIDER_COLISION = false;
const IGNORE_COLISION = true;


let LEFT         = 0 ;
let RIGHT        = 1 ;
let TOP          = 2 ;
let BOTTOM       = 3 ;

//                0  1  2  3
//                l  r  t  b
let TOP_LEFT     = [LEFT , TOP];
let TOP_RIGHT    = [RIGHT , TOP];
let BOTTOM_LEFT  = [LEFT , BOTTOM];
let BOTTOM_RIGHT = [RIGHT , BOTTOM];

const LONG_CASTLE  = [ [RIGHT], [RIGHT, RIGHT], [RIGHT, RIGHT, RIGHT] ];
const SHORT_CASTLE = [ [LEFT], [LEFT, LEFT] ] ;
const ALL_CASTLE   = [ LONG_CASTLE , SHORT_CASTLE ];

const DIRECTION_VERTICAL   = [TOP, BOTTOM];
const DIRECTION_HORIZONTAL = [LEFT, RIGHT];
const DIRECTION_DIAGONAL   = [TOP_RIGHT, TOP_LEFT, BOTTOM_LEFT, BOTTOM_RIGHT];

const FIRST_L_QUADRANT  = [[TOP_LEFT, TOP]       , [TOP_RIGHT, TOP]];
const SECOND_L_QUADRANT = [[TOP_RIGHT, RIGHT]    , [BOTTOM_RIGHT, RIGHT]];
const THIRD_L_QUADRANT  = [[BOTTOM_RIGHT, BOTTOM], [BOTTOM_LEFT, BOTTOM]];
const FOURTH_L_QUADRANT = [[BOTTOM_LEFT, LEFT]   , [TOP_LEFT, LEFT]];

const L_ROTATE = [
                    FIRST_L_QUADRANT, 
                    SECOND_L_QUADRANT,
                    THIRD_L_QUADRANT,
                    FOURTH_L_QUADRANT
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
const SPECIAL_MOVEMENT_PROMOTE    = 65536; 
const SPECIAL_MOVEMENT_ALL        = SPECIAL_MOVEMENT_CASTLE | SPECIAL_MOVEMENT_EN_PASSANT | SPECIAL_MOVEMENT_PROMOTE; 

const MOVEMENT_CASTLE_SHORT = 1;
const MOVEMENT_CASTLE_LONG = 2;
const MOVEMENT_CASTLE_BOTH = 3;
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
// Movement Actions
//

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

let LSquares = [];

//
//
//////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////
//
// Piece block
//

// ROOK
const ROOK_INITIAL_MOVEMENT   = MOVEMENT_DIRECTION_COLUMN
                                | MOVEMENT_DIRECTION_LINE
                                | SPECIAL_MOVEMENT_CASTLE;
const ROOK_CASTLED_MOVEMENT   = (ROOK_INITIAL_MOVEMENT ^ SPECIAL_MOVEMENT_CASTLE)
const ROOK_MOVEMENT_RANGE     = LINE_OF_SIGHT;

// KNIGHT  
const KNIGHT_INITIAL_MOVEMENT = MOVEMENT_DIRECTION_L;
const KNIGHT_MOVEMENT_RANGE   = L_RANGE; // 2 movements 4way expressed

// BISHOP
const BISHOP_INITIAL_MOVEMENT = MOVEMENT_DIRECTION_DIAGONAL
const BISHOP_MOVEMENT_RANGE   = LINE_OF_SIGHT;

// QUEEN
const QUEEN_INITIAL_MOVEMENT  = MOVEMENT_DIRECTION_COLUMN
                                | MOVEMENT_DIRECTION_LINE
                                | MOVEMENT_DIRECTION_DIAGONAL;
const QUEEN_MOVEMENT_RANGE    = LINE_OF_SIGHT;

// KING
const KING_INITIAL_MOVEMENT   = SPECIAL_MOVEMENT_CASTLE
                                | MOVEMENT_DIRECTION_COLUMN
                                | MOVEMENT_DIRECTION_LINE
                                | MOVEMENT_DIRECTION_DIAGONAL;
const KING_CASTLED_MOVEMENT   = (KING_INITIAL_MOVEMENT ^ SPECIAL_MOVEMENT_CASTLE)
const KING_MOVEMENT_RANGE     =  SQUARE_RANGE;

// PAWN
const PAWN_INITIAL_MOVEMENT   = MOVEMENT_DIRECTION_COLUMN
                                  | SUBTYPE_COLUMN_TOP
                                | MOVEMENT_DIRECTION_DIAGONAL
                                  | SUBTYPE_DIAG_MAIN_BEGIN
                                  | SUBTYPE_DIAG_OPPOSITE_END
                                | SPECIAL_MOVEMENT_PROMOTE
                                | SPECIAL_MOVEMENT_EN_PASSANT;
const PAWN_PASSE_MOVEMENT     = (PAWN_INITIAL_MOVEMENT ^ SPECIAL_MOVEMENT_EN_PASSANT)
const PAWN_INITIAL_RANGE      = DOUBLE_SQUARE_RANGE;
const PAWN_MOVED_RANGE        = SQUARE_RANGE;

const THE_PIECE = 99;

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

const FRIENDLY_SIDE   = 'FRIENDLY';
const ENEMY_SIDE      = 'ENEMY';
const BLANK_SIDE      = 'NEUTRAL';

const PLAYER_SIDES = [FRIENDLY_SIDE, ENEMY_SIDE];
const ALL_SIDES = [FRIENDLY_SIDE, ENEMY_SIDE, BLANK_SIDE];

const EMBEDDED_CASTLE_PIECES    = [ SQUARE_TYPE_KING_PIECE , SQUARE_TYPE_ROOK_PIECE ];

const WHITE_COLOR = 0;
const BLACK_COLOR = 1;

const avaliableColors = ['WHITEPIECE','BLACKPIECE'];

let capturedPieces = "";

const PROMOTION_PIECES = pieceTypeByColumn.slice(0,4);


// let playerColor = 'WHITEPIECE';

//
//
//
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
//
// Game block
//

const TIMER_SETUPS = [60, 180, 300, 600]

const TIMER_MINUTE = 0;
const TIMER_THREE_MINUTES = 1;
const TIMER_FIVE_MINUTES = 2;
const TIMER_TEN_MINUTES = 3;

const TIMER_MILLISEC_MULTIPLIER = 1000;

let GAME_INITIAL_TIME =  TIMER_SETUPS[TIMER_FIVE_MINUTES] ;


//////////////////////////////////////////////////////////
//
// Supervisor block
//

const FILTER_ROW = 0;
const FILTER_COLUMN = 1;
const FILTER_COLOR = 2
const FILTER_TYPE = 3
const FILTER_SELECTED = 4
const FILTER_NOT_SELECTED = 5
const FILTER_EMPTY = 6
                  //  'row', 'column', 'color', 'type', 'selected', 'notselected', 'empty'
let filterDetails = [  -1,     -1,       -1,     -1,       -1,         -1,           -1];

let intervalSeconds = 10;
let intervalTime = intervalSeconds * 1000;
let myInterval;

let supervisorMode = false;

//
//
//////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
//
//  Functions and procedures
//
function getFrameByTypeAndColor(sqType, sqColor){
    return 'sqtype="'+sqType+'" sqcolor="'+sqColor+'">'+sqType.split('PIECE')[0]+'</div>';
}
function assingDirectionsByPlayerColor(){
    LEFT         = 0 ;
    RIGHT        = 1 ;
    TOP          = 2 ;
    BOTTOM       = 3 ;
    if ( playerColor == avaliableColors[BLACK_COLOR] ){
        RIGHT        = 0 ;
        LEFT         = 1 ;
        BOTTOM       = 2 ;
        TOP          = 3 ;
    }
    TOP_LEFT     = [LEFT , TOP];
    TOP_RIGHT    = [RIGHT , TOP];
    BOTTOM_LEFT  = [LEFT , BOTTOM];
    BOTTOM_RIGHT = [RIGHT , BOTTOM];
}
function getElementFromSquareOrSquareId(elementOrId, getActualStatus=null){
    if ( elementOrId == null )
        return null;

    if ( typeof (elementOrId) === 'object' 
         && elementOrId.id !== undefined 
         && elementOrId.id != null
         && elementOrId.id != "" )
        return (getActualStatus == null) ? elementOrId : document.getElementById(elementOrId.id);

    return document.getElementById(elementOrId);
}
//
//   Begin validation block
//
function validateIsSelected(){
    return (getAllSelectedElements() != false);
}
function validateIsBlank(square){
    let mySquare = getElementFromSquareOrSquareId(square);
    return (getSquareType(mySquare) == SQUARE_TYPE_BLANK);
}
function validateIsNotBlank(square){
    return !validateIsBlank(square);
}
function validateIsCaptureSquare(square){
    if ( !square.hasAttribute('cpt') ){
        return false;
    }
    return true;
}
function validateIsMoveSquare(square){
    if ( !square.hasAttribute('mvsl') ){
        return false;
    }
    return true;
}
function validateIsCastleSquare(square){
    if ( !validateIsMoveSquare(square) ){
        return false;
    }
    if ( validateIsSelected() ){
        if ( Number(square.getAttribute('mvsl')) != CASTLE_MOVEMENT_SELECTION )
            return false;
    }

    return true;
}
function matchCastleType(castleType, squareCastleType){
    return ( castleType & squareCastleType )
}
// O rei e a torre envolvida não podem ter se movimentado nenhuma vez desde o início do jogo;
// As casas entre o rei e a torre devem estar desocupadas;
// O rei não pode estar em xeque, e também não pode ficar em xeque depois do roque;
// Nenhuma das casas onde o rei passar ou ficar deverá estar no raio de ação de uma peça adversária.
// Isto não se aplica à torre envolvida.
function validateCastleFromSquare(elemSquare, possibleCastles=false){
    let square = getElementFromSquareOrSquareId(elemSquare);
    let kpos = square.getAttribute('kpos');
    let sqType = getSquareType(square)
    let rookOne = document.getElementById(columnArray[0] + square.id[SQUARE_NUMERIC_NDX]);
    let rookTwo = document.getElementById(columnArray[(columnArray.length-1)] + square.id[SQUARE_NUMERIC_NDX]);

    if ( hasMoved(square.id) || square.getAttribute('initsq') != square.id )
        return false;
        

    if ( sqType != SQUARE_TYPE_KING_PIECE && sqType != SQUARE_TYPE_ROOK_PIECE )
        return false;

    if ( kpos == null ){
        if ( hasMoved(rookOne) && hasMoved(rookTwo) )
            return false;

        let i = 0;
        rookOne.getAttribute('lcstl').split(',').forEach(sq => {
            if ( getSquareType(sq) == SQUARE_TYPE_BLANK ) i++;
        });
        let j = 0;
        rookTwo.getAttribute('scstl').split(',').forEach(sq => {
            if ( getSquareType(sq) == SQUARE_TYPE_BLANK ) j++;
        });
        if ( i < 3 && j < 2 ) 
            return false;
        
        if ( possibleCastles ){
            let retCastleTypes = 0;
            if ( i >= 3 )
                retCastleTypes |= LONG_CASTLE_TYPE
            if ( j >= 2 )
                retCastleTypes |= SHORT_CASTLE_TYPE
            
            return retCastleTypes;
        }
        return true;
    }
    else if ( hasMoved(document.getElementById(kpos)) )
        return false;

    let cstlType = (square.id[SQUARE_ALPHABETICAL_NDX] == 'a') ? 'lcstl' : 'scstl';
    let isCleanPath = true;

    square.getAttribute(cstlType).split(',').forEach(sq => {
        if ( getSquareType(sq) !== SQUARE_TYPE_BLANK )
            isCleanPath = false;
    });

    if ( possibleCastles ){
        if ( isCleanPath )
            return (cstlType == 'lcstl') ? LONG_CASTLE_TYPE : SHORT_CASTLE_TYPE;
    }
    return isCleanPath;
}
function validatePassableEnemies(square, possibleDirection=false){
    let mySquare = getElementFromSquareOrSquareId(square, true);

    let lSquare = document.getElementById(mySquare.getAttribute(LEFT_DIRECTION));
    let rSquare = document.getElementById(mySquare.getAttribute(RIGHT_DIRECTION));

    if ( validateEnemyPieceSquare(lSquare) && lSquare.hasAttribute('ep') )
        return possibleDirection ? TOP_LEFT : true;
    else if ( validateEnemyPieceSquare(rSquare) && rSquare.hasAttribute('ep') )
        return possibleDirection ? TOP_RIGHT :true;

    return false;
}
function setEnPassantDestination(square){
    let mySquare = getElementFromSquareOrSquareId(square);
    mySquare.setAttribute("epdst","1");
}
function validateIsOnRange(square){
    let selectedElem = getFirstSelectedElement();
    let myPieceType = getSquareType(selectedElem);
    let moved = hasMoved(selectedElem.id);

    let myMovType = getMovementTypeFromPieceType(getPieceTypeFromSquareType(myPieceType), moved);
    let myMovRange = getMovementRangeFromPieceType(getPieceTypeFromSquareType(myPieceType), moved);
    
    // Possui movimento especial? 
    if ( matchMovementDirection(myMovType, SPECIAL_MOVEMENT_ALL) ){
        if ( matchMovementDirection(myMovType, SPECIAL_MOVEMENT_CASTLE)
             && validateCastleFromSquare(square, GET_BOOLEAN_POSSIBILITY) ){
            let castleTypes = validateCastleFromSquare(square, GET_POSSIBLE_TYPES);
            if ( matchCastleType(SHORT_CASTLE_TYPE, castleTypes) ){
                let sCastleSquares;
                if ( getSquareType(square) == SQUARE_TYPE_KING_PIECE ){
                   sCastleSquares = document.getElementById((columnArray[(columnArray.length-1)] + square.id[SQUARE_NUMERIC_NDX])).getAttribute('scstl');
                   // Minha Torre
                   setMoveSelection(document.getElementById((columnArray[(columnArray.length-1)] + square.id[SQUARE_NUMERIC_NDX])), LEFT_DIRECTION, CASTLE_MOVEMENT_SELECTION);
                }
                else{
                   sCastleSquares = square.getAttribute('scstl');
                   // Meu Rei
                   setMoveSelection(document.getElementById(square.getAttribute('kpos')), LEFT_DIRECTION, CASTLE_MOVEMENT_SELECTION);
                }
                sCastleSquares.split(',').forEach(sq => {
                    // Intervalo Rei Torre
                    setMoveSelection(sq, LEFT_DIRECTION, CASTLE_MOVEMENT_SELECTION);
                });
                // Eu mesmo
                setMoveSelection(square, LEFT_DIRECTION, CASTLE_MOVEMENT_SELECTION);
            }
            if ( matchCastleType(LONG_CASTLE_TYPE, castleTypes) ){
                let lCastleSquares;
                if ( getSquareType(square) == SQUARE_TYPE_KING_PIECE ){
                   lCastleSquares = document.getElementById((columnArray[0] + square.id[SQUARE_NUMERIC_NDX])).getAttribute('lcstl');
                   // Minha Torre
                   setMoveSelection(document.getElementById((columnArray[0] + square.id[SQUARE_NUMERIC_NDX])), RIGHT_DIRECTION, CASTLE_MOVEMENT_SELECTION);
                }
                else{
                   lCastleSquares = square.getAttribute('lcstl');
                   // Meu Rei
                   setMoveSelection(document.getElementById(square.getAttribute('kpos')), RIGHT_DIRECTION, CASTLE_MOVEMENT_SELECTION);
                }
                lCastleSquares.split(',').forEach(sq => {
                    // Intervalo Rei Torre
                    setMoveSelection(sq, RIGHT_DIRECTION, CASTLE_MOVEMENT_SELECTION);
                });
                // Eu mesmo
                setMoveSelection(square, RIGHT_DIRECTION, CASTLE_MOVEMENT_SELECTION);
            }
            // highlightSelection();
        }
        if ( matchMovementDirection(myMovType, SPECIAL_MOVEMENT_EN_PASSANT)
             && validatePassableEnemies(selectedElem, GET_BOOLEAN_POSSIBILITY) ){
            if ( validateEnPassantDestSquare(square) )
                return true;
            let enPassantDirection = validatePassableEnemies(selectedElem, GET_POSSIBLE_TYPES);
            let captSq = getSquare(selectedElem, enPassantDirection);
            setCaptureSquare(captSq);
            setEnPassantDestination(captSq);
            highlightCapture(captSq);
            
        }
    }
    if ( matchMovementDirection(myMovType, MOVEMENT_DIRECTION_DIAGONAL) ){
        // Possui movimento absoluto? Se sim, nao possui subtipos
        if ( matchMovementDirection(myMovType, SUBTYPE_DIAG_ALL) == 0 )
            myMovType = myMovType | SUBTYPE_DIAG_ALL;

        if ( matchMovementDirection(myMovType,SUBTYPE_DIAG_MAIN_BEGIN) )
            getDirectionFromSquare(selectedElem, TOP_LEFT_DIRECTION, myMovRange, CONSIDER_COLISION);
        if ( matchMovementDirection(myMovType,SUBTYPE_DIAG_MAIN_END) )
            getDirectionFromSquare(selectedElem, BOTTOM_RIGHT_DIRECTION, myMovRange, CONSIDER_COLISION);
        if ( matchMovementDirection(myMovType,SUBTYPE_DIAG_OPPOSITE_BEGIN) )
            getDirectionFromSquare(selectedElem, BOTTOM_LEFT_DIRECTION, myMovRange, CONSIDER_COLISION);
        if ( matchMovementDirection(myMovType,SUBTYPE_DIAG_OPPOSITE_END) )
            getDirectionFromSquare(selectedElem, TOP_RIGHT_DIRECTION, myMovRange, CONSIDER_COLISION);
    }
    if ( matchMovementDirection(myMovType, MOVEMENT_DIRECTION_COLUMN) ){
        if ( matchMovementDirection(myMovType, MOVEMENT_COLUMN_ALL) == 0 )
            myMovType = myMovType | MOVEMENT_COLUMN_ALL;

        if ( matchMovementDirection(myMovType, SUBTYPE_COLUMN_TOP) )
            getDirectionFromSquare(selectedElem, TOP_DIRECTION, myMovRange, CONSIDER_COLISION);            
        if ( matchMovementDirection(myMovType, SUBTYPE_COLUMN_BOTTOM) )
            getDirectionFromSquare(selectedElem, BOTTOM_DIRECTION, myMovRange, CONSIDER_COLISION);
        
    }
    if ( matchMovementDirection(myMovType, MOVEMENT_DIRECTION_LINE) ){
        if ( matchMovementDirection(myMovType, MOVEMENT_LINE_ALL) == 0 )
            myMovType = myMovType | MOVEMENT_LINE_ALL;

        if ( matchMovementDirection(myMovType, SUBTYPE_LINE_LEFT) )
            getDirectionFromSquare(selectedElem, LEFT_DIRECTION, myMovRange, CONSIDER_COLISION);            
        if ( matchMovementDirection(myMovType, SUBTYPE_LINE_RIGHT) )
            getDirectionFromSquare(selectedElem, RIGHT_DIRECTION, myMovRange, CONSIDER_COLISION);
    }
    if ( matchMovementDirection(myMovType, MOVEMENT_DIRECTION_L) ){
        getLSquaresFromSquare(selectedElem);
    }   
    if ( !validateIsMoveSquare(square) && !validateIsCaptureSquare(square) ){
        return false;
    }
    
    return true;
}
function validateEnemyPieceSquare(square){
    return (validateSquareSide(square) == ENEMY_SIDE);
}
function validateFriendlyPieceSquare(square){
    return (validateSquareSide(square) == FRIENDLY_SIDE);
}
function validateSquareSide(square){
    let mySquare = getElementFromSquareOrSquareId(square);
    if ( !isValidSquare(mySquare) ) 
        return false;
        
    if ( validateIsBlank(mySquare) ) 
        return BLANK_SIDE;

    return (mySquare.getAttribute("sqcolor") == playerColor) ? FRIENDLY_SIDE : ENEMY_SIDE;
}
function validateIsSameSquare(square){
    return getFirstSelectedElement().id == square.id;
}
function isValidSquareIndex(squareIndex){
    if ( squareIndex < 1 || squareIndex > ROW_SQUARE_COUNT || isNaN(squareIndex) )
        return false;
    
    return true;
}
function isValidSquareAlpha(sqAlpha){
    if ( columnArray.indexOf(sqAlpha) === -1 )
        return false;
    
    return true;
}
function isValidSquare(elemSquare){
    if ( elemSquare == null )
        return false;

    if ( typeof(elemSquare) === 'object' )
        elemSquare = elemSquare.id;
    
    if ( isValidSquareAlpha(elemSquare[SQUARE_ALPHABETICAL_NDX])
         && isValidSquareIndex(elemSquare[SQUARE_NUMERIC_NDX]) )
        return true;

    return false;
}
function validateAndSetCaptureSquare(elemSquare){
    let mySquare = getElementFromSquareOrSquareId(elemSquare);

    if ( validateEnemyPieceSquare(mySquare) ){
        setCaptureSquare(mySquare);
        highlightCapture(mySquare);
    }
}
function validateSquareType(square, flag){
    if ( square === undefined )
        return false;
    if ( flag === SQUARE_TYPE_PAWN_PIECE )
        return PAWN_INIT_ROWS.includes(square.id[1]);
    if ( flag === SQUARE_TYPE_HIGHVALUE_PIECE )
        return HIGHVALUE_INIT_ROWS.includes(square.id[1]);
    if ( flag === SQUARE_TYPE_BLANK ){
        return (!validateSquareType(square, SQUARE_TYPE_PAWN_PIECE)
                && !validateSquareType(square, SQUARE_TYPE_HIGHVALUE_PIECE));
    }

    return false;
}
function validateSquareColor(elemSquare, flag){
    let square = getElementFromSquareOrSquareId(elemSquare);
    if ( square == null )
        return false;

    if ( flag === SQUARE_TYPE_WHITE_PIECE )
        return WHITEPIECE_INIT_ROWS.includes(square.id[1]);
    if ( flag === SQUARE_TYPE_BLACK_PIECE )
        return BLACKPIECE_INIT_ROWS.includes(square.id[1]);
    if ( flag === SQUARE_TYPE_BLANK )
        return BLANKSQUARE_INIT_ROWS.includes(square.id[1]);
}
//
// End Validation block
//

function setCaptureSquare(elemSquare){
    let mySquare = getElementFromSquareOrSquareId(elemSquare);
    mySquare.setAttribute("cpt", "1");
}
function clearCaptureSelection(elemSquare){
    let mySquare = getElementFromSquareOrSquareId(elemSquare);
    mySquare.removeAttribute("cpt");
}
function setSelection(elemSquare){
    let mySquare = getElementFromSquareOrSquareId(elemSquare);
    mySquare.setAttribute("sltd", "1");
    mySquare.innerHTML = "<b>"+mySquare.innerHTML+"</b>";
}
function clearSelection(elemSquare){
    let mySquare = getElementFromSquareOrSquareId(elemSquare);
    mySquare.removeAttribute("sltd");

    if ( mySquare.innerHTML.indexOf('<b>') === -1 )
        return;

    let myInner = mySquare.innerHTML.split('<b>')[1];
    myInner = myInner.split('</b>')[0];
    mySquare.innerHTML = myInner;
}
function setMoveSelection(elemSquare, direction, specialMoveNmbr=DEFAULT_MOVEMENT_SELECTION){
    let mySquare = getElementFromSquareOrSquareId(elemSquare);
    if ( !isValidSquare(mySquare) )
        return;
    if ( mySquare.hasAttribute('mvsl') 
         && Number(mySquare.getAttribute('mvsl')) > DEFAULT_MOVEMENT_SELECTION ){
        specialMoveNmbr = mySquare.getAttribute('mvsl');
    }
    mySquare.setAttribute("mvsl", specialMoveNmbr);
    setDirectionSelection(mySquare, direction)
}
function clearDirectionSelection(elemSquare){
    let mySquare = getElementFromSquareOrSquareId(elemSquare);
    mySquare.removeAttribute('lmv');
    mySquare.removeAttribute('cmv');
    mySquare.removeAttribute('dmv');
    mySquare.removeAttribute('kmv');
    mySquare.removeAttribute('pmv');
}
function setMovedElem(elemSquare){
    let mySquare = getElementFromSquareOrSquareId(elemSquare);
    mySquare.setAttribute("mvd", "1");
}
function hasMoved(squareId){
    let mySquare = getElementFromSquareOrSquareId(squareId);

    return document.getElementById(mySquare.id).hasAttribute('mvd');
}
function clearMoveSelection(elemSquare){
    let mySquare = getElementFromSquareOrSquareId(elemSquare);
    mySquare.removeAttribute("mvsl");
    clearDirectionSelection(elemSquare);
}
function getSquareAfterMultipleMovements(originSq, movementArray){
    if ( Array.isArray(movementArray) == false ){
        return getSquare(originSq, movementArray);
    }
    let retSq = [];
    let destSq = getElementFromSquareOrSquareId(originSq);
    let wrkSq = destSq;
    movementArray.map(direction =>{
        wrkSq = getElementFromSquareOrSquareId(originSq);

        if ( Array.isArray(direction) ){
            wrkSq= getElementFromSquareOrSquareId(originSq);
            direction.map(subdir =>{
                destSq = getSquare(wrkSq, subdir);
                wrkSq = destSq;
            });
            retSq.push(wrkSq);
        }
        else {
            destSq = getSquare(wrkSq, direction);
            wrkSq = destSq;
            retSq.push(wrkSq);
        }
    });
    return retSq;
}
function getCastleSquaresFromSquare(square, ignoreColision=false){
    return validateCastleFromSquare(square, GET_POSSIBLE_TYPES);
}
function getLSquaresFromSquare(square, ignoreColision=false){
    LSquares = [];
    L_ROTATE.map(quadrant => {
        let retSq = getSquareAfterMultipleMovements(square, quadrant);
        if ( Array.isArray(retSq) ){
            retSq.map(sq => {
                if ( !ignoreColision && isValidSquare(sq) && !validateFriendlyPieceSquare(sq) ){
                    validateAndSetCaptureSquare(sq);
                    LSquares.push(sq);
                    setMoveSelection(sq, MOVEMENT_DIRECTION_L);
                }
            });
        }
    });

    highlightSelection();
}                

function setSpecialMovementAttributes(){
    let cstlSquare = [];
    let i =0;
    
    CASTLE_INIT_SQUARES.map((square, ndx) => {
        if ( ndx == LONG_CASTLE_NDX ){
            cstlSquare[i++] = getSquareAfterMultipleMovements(square[0], LONG_CASTLE);
            document.getElementById(square[0]).setAttribute('lcstl', cstlSquare[i-1]);
            document.getElementById(square[0]).setAttribute('cstldst', LONG_CASTLE_ROOK_SQUARES[0]);
            document.getElementById(square[0]).setAttribute('kpos', 'e1');
            cstlSquare[i++] = getSquareAfterMultipleMovements(square[1], LONG_CASTLE);
            document.getElementById(square[1]).setAttribute('lcstl', cstlSquare[i-1]);
            document.getElementById(square[1]).setAttribute('cstldst', LONG_CASTLE_ROOK_SQUARES[1]);
            document.getElementById(square[1]).setAttribute('kpos', 'e8');
        }
        if ( ndx == SHORT_CASTLE_NDX ){
            cstlSquare[i++] = getSquareAfterMultipleMovements(square[0], SHORT_CASTLE);
            document.getElementById(square[0]).setAttribute('scstl', cstlSquare[i-1]);
            document.getElementById(square[0]).setAttribute('cstldst', SHORT_CASTLE_ROOK_SQUARES[0]);
            document.getElementById(square[0]).setAttribute('kpos', 'e1');
            cstlSquare[i++] = getSquareAfterMultipleMovements(square[1], SHORT_CASTLE);
            document.getElementById(square[1]).setAttribute('scstl', cstlSquare[i-1]);
            document.getElementById(square[1]).setAttribute('cstldst', SHORT_CASTLE_ROOK_SQUARES[1]);
            document.getElementById(square[1]).setAttribute('kpos', 'e8');
        }
    });

}
function movementMatchesAnyDirection(movementType){
    return (movementType & MOVEMENT_DIRECTION_ALL) ? true : false;
}
function getSquareType(elemSquare){
    let square = getElementFromSquareOrSquareId(elemSquare);

    if ( square == null )
        return false;

    if ( square.hasAttribute('sqtype'))
        return square.getAttribute('sqtype');

    return false;
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
function getMovementRangeFromPieceType(value, moved=false){
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

function getMovementTypeFromPieceType(value, moved=false){
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
    let promotionRow = 0;

    if ( validateSquareType(square, SQUARE_TYPE_BLANK) )
        sqType = SQUARE_TYPE_BLANK;
    else if ( validateSquareType(square, SQUARE_TYPE_PAWN_PIECE) ){
        sqType = SQUARE_TYPE_PAWN_PIECE;
    }
    else if ( validateSquareType(square, SQUARE_TYPE_HIGHVALUE_PIECE) )
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

    if ( validateSquareType(square, SQUARE_TYPE_PAWN_PIECE) ){
        promotionRow = validateSquareColor(square, SQUARE_TYPE_WHITE_PIECE)
                       ? ROW_SQUARE_COUNT
                       : 1;
    }

    blSquare = getSquare(square, BOTTOM_LEFT);
    brSquare = getSquare(square, BOTTOM_RIGHT);
    tlSquare = getSquare(square, TOP_LEFT);
    trSquare = getSquare(square, TOP_RIGHT);
    lSquare  = getSquare(square, LEFT);
    rSquare  = getSquare(square, RIGHT);
    tSquare  = getSquare(square, TOP);
    bSquare  = getSquare(square, BOTTOM);
    
    let kingDestinationCastleSquare = setKingDestinationSquare(square);

    let pieceObject = {
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
        squareColor:         sqColor,
        kingDstCstSq:        kingDestinationCastleSquare,
        prRow:               promotionRow
    };

    return pieceObject;
}
function getSquare(elemSquare, relativePosition){
    let square = getElementFromSquareOrSquareId(elemSquare);
    if ( square == null )
        return false;
        
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
    // Square obtido por um par de deslocamento?
    //
    if ( relativePosition.length !== undefined && relativePosition.length  > 1 ) {
        let squareGot = "" + allPos[relativePosition[0]] + allPos[relativePosition[1]];
       
        if ( isValidSquare(squareGot) == false )
            return false; 

        return squareGot;
    }

    // Nao...

    //
    // Square obtido por um deslocamento vertical ? 
    //
    if ( DIRECTION_VERTICAL.includes(relativePosition) ) {
        let squareGot = "" +  columnNotation +  allPos[relativePosition] ;
        if ( isValidSquare(squareGot) ){   
            return squareGot;
        }
    }
    //
    // Square obtido por um deslocamento Horizontal ? 
    //    
    if ( DIRECTION_HORIZONTAL.includes(relativePosition) ) {
        let squareGot = "" + allPos[relativePosition] + indexNotation;
        if ( isValidSquare(squareGot) ){
            return squareGot;
        }
    }
    return false;
}
function lowlightSelection(){
    document.querySelectorAll('[mvsl]').forEach(element =>{
        highlightClasses.forEach(myClass => {
            element.classList.remove(myClass);
       });
        let bgcAttr = element.getAttribute('bgc');
        element.classList.add(bgcAttr);
    });
}
function lowlightCapture(){
    document.querySelectorAll('[cpt]').forEach(element =>{
        highlightClasses.forEach(myClass => {
            element.classList.remove(myClass);
       });
        let bgcAttr = element.getAttribute('bgc');
        element.classList.add(bgcAttr);
    });
}
function lowlightElement(element){
    highlightClasses.forEach(myClass => {
        element.classList.remove(myClass);
    });
    let bgcAttr = element.getAttribute('bgc');
    element.classList.add(bgcAttr);
}
function highlightCapture(elm){
    mySquare = getElementFromSquareOrSquareId(elm);
    let bgcAttr = mySquare.getAttribute('bgc');  
    highlightClasses.forEach(myClass => {
        mySquare.classList.remove(myClass);
   });
    mySquare.classList.remove(bgcAttr);
    if ( bgcAttr.includes('dark') ){
        mySquare.classList.add(captureClasses[1]);
    }
    else{
        mySquare.classList.add(captureClasses[0]);
    }
}
function setKingDestinationSquare(square){
    if ( LONG_CASTLE_KING_SQUARES.includes(square.id) )
        return "klcdst";
    else if ( SHORT_CASTLE_KING_SQUARES.includes(square.id) ){
        return "kscdst";
    }
    return false;
}
function setDirectionSelection(square, direction){
    let mySquare = getElementFromSquareOrSquareId(square);
    if ( LINE_DIRECTION.includes(direction) )
        mySquare.setAttribute('lmv', direction);
    else if ( COLUMN_DIRECTION.includes(direction) )  
        mySquare.setAttribute('cmv', direction);
    else if ( MAIN_DIAGONAL_DIRECTION.includes(direction) || OPPOSITE_DIAGONAL_DIRECTION.includes(direction) )
        mySquare.setAttribute('dmv', direction);
    else if ( direction == MOVEMENT_DIRECTION_L )
        mySquare.setAttribute('kmv', direction);
    else if ( direction == THE_PIECE )
        mySquare.setAttribute('pmv', direction);
}

function highlightSelection(){
    document.querySelectorAll('[mvsl]').forEach(elm =>{
        let myClass = getClassNameFromAttribute(elm);
        let bgcAttr = elm.getAttribute('bgc');
        if ( myClass != bgcAttr ){    
            if ( bgcAttr.includes('dark') ){
                myClass += 'dark'; 
            }
            else if ( myClass.includes('dark') ) {
                let tmpClass = myClass.split('dark')[0];
                myClass = tmpClass;
            }
            elm.classList.remove(bgcAttr);
            elm.classList.add(myClass);
        }
    });

}

function getDirectionFromSquare(square, direction, range=LINE_OF_SIGHT, ignoreColision=false){
    if ( Array.isArray(direction) && direction.length > 1 ){
        direction.map(myDir =>{
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
    
    while ( document.getElementById(destSquareId) != null ){
        if ( i >= range )
            break;

        let nextSqElem = document.getElementById(destSquareId);
        let nextSqType = getSquareType(document.getElementById(destSquareId))
        let mySquarePiece = getSquareType(getFirstSelectedElement())
        let moved = hasMoved(getFirstSelectedElement().id);
        let mySquareType = getPieceTypeFromSquareType(mySquarePiece, moved);
        
        if ( (!ignoreColision && nextSqType != SQUARE_TYPE_BLANK )){
            if ( direction == TOP_DIRECTION
                 && mySquareType != PIECE_TYPE_PAWN)
                validateAndSetCaptureSquare(destSquareId);
            else if ( (direction == TOP_LEFT_DIRECTION || direction == TOP_RIGHT_DIRECTION)
                        && mySquareType == PIECE_TYPE_PAWN ){
                validateAndSetCaptureSquare(destSquareId);
            }
            else if ( mySquareType != PIECE_TYPE_PAWN){
                validateAndSetCaptureSquare(destSquareId);
            }
            break;
        }
        if ( 
            !(
                (direction == TOP_LEFT_DIRECTION || direction == TOP_RIGHT_DIRECTION)  
                && mySquareType == PIECE_TYPE_PAWN && !ignoreColision
             ) 
            )
        {
            setMoveSelection(nextSqElem.id, direction);
        }
        else if ( !(direction == TOP_LEFT_DIRECTION || direction == TOP_RIGHT_DIRECTION) ){
            
            setMoveSelection(nextSqElem.id, direction);
        }
        else{
            clearMoveSelection(nextSqElem.id, direction)
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
function getClassNameFromMovementDirection(baseMovementDirection){
    let i = 0;
    for ( ; baseMovementDirection > 0 ; i++ ){
        baseMovementDirection = baseMovementDirection >> 1;
    }
    return highlightClasses[i-1];
}
function getClassNameFromAttribute(square){
    let mySquare = getElementFromSquareOrSquareId(square);
    if ( mySquare.hasAttribute('lmv') )
        return getClassNameFromMovementDirection(MOVEMENT_DIRECTION_LINE);
    if ( mySquare.hasAttribute('cmv') )
        return getClassNameFromMovementDirection(MOVEMENT_DIRECTION_COLUMN);
    if ( mySquare.hasAttribute('dmv') )
        return getClassNameFromMovementDirection(MOVEMENT_DIRECTION_DIAGONAL);
    if ( mySquare.hasAttribute('kmv') )
        return getClassNameFromMovementDirection(MOVEMENT_DIRECTION_L);
    if ( mySquare.hasAttribute('cpt') )
        return captureClasses[0];
    if ( mySquare.hasAttribute('pmv') )
        return pieceSpecialClasses[0];

    return false;
}

function highlightSquares(square){
    validateIsOnRange(square);
}

function selectSameSquare(square){
    return (validateIsSelected() && validateIsSameSquare(square));
}
function selectSquare(square){
        return (!validateIsSelected()
               && validateIsNotBlank(square)
               && validateFriendlyPieceSquare(square));
}

function isLetter(letter) {
    return letter.length === 1 && letter.match(/[a-z]/i);
}
function drawSquare(squareId, myInner=""){
    let divSquare = document.createElement('div');
    divSquare.id = squareId;
    divSquare.innerHTML = myInner;
    divSquare.setAttribute("square", "1");
    divSquare.setAttribute("clm", squareId[SQUARE_ALPHABETICAL_NDX]);
    divSquare.setAttribute("lndx", squareId[SQUARE_NUMERIC_NDX]);
    divSquare.addEventListener('click', squareHandler);

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

function removeNonRelevantAttributesFromSquare(){

}
function saveSquareCoreAttrOnLocalStorage(square){
    let divToReplace = square.outerHTML.split("pc")[0];
    if ( divToReplace.includes("</div>") == false )
        divToReplace += "></div>";

}
function saveCoreAttrOnLocalStorage(square){
    let wrkDiv;
    let piecePrefix = "";
    // pcp="1" initsq="c2" sqtype="PAWNPIECE" sqcolor="WHITEPIECE">PAWN</div>
    if (square.outerHTML.indexOf('BLANK') === -1){
        wrkDiv = "pc"+square.outerHTML.split("pc")[1];
        piecePrefix = 'p';
    }
    else{
        wrkDiv = "sqtype"+square.outerHTML.split("sqtype")[1];
    }
    objCoreAttr = new Object({
        divStringToReplace: wrkDiv
    });
    let sqName = piecePrefix+square.id;
    window.localStorage.removeItem(sqName);
    window.localStorage.setItem(sqName, JSON.stringify({ ...objCoreAttr}));
}
function removeNonRelevantAttributesFromSquare(square){
    clearMoveSelection(square.id);  
}
function validateProtionDestinationSquare(prow, destId){
    if ( destId[SQUARE_NUMERIC_NDX] == prow )
        return true;
    // }

    return false;
}
//
// Movimento simples ou Composto?
//
function setupMovement(orgsq, destsq){
    let movementChain = [];
    if ( validateCastleDestinationSquare(destsq) ){
        // Roque
        // Irao ser gerados dois movimentos
        let rookDestElem;
        let rookKingElem;
        let kingDir = LEFT;
        let rookElem;
        let relativeDirection = "drrsq";
        if ( orgsq.hasAttribute('cstldst') ){
            // Partindo de uma torre
            rookElem = orgsq;
            relativeDirection = "drlsq";
        }
        else if ( destsq.hasAttribute('cstldst') ) {
            // Partindo de um rei para uma torre
            rookElem = destsq;
        }
        else if ( destsq.hasAttribute('klcdst') ) {
            // Partindo de um rei para uma destino roque grande
            rookElem = document.getElementById((columnArray[0] + orgsq.id[SQUARE_NUMERIC_NDX]));
        }
        else if ( destsq.hasAttribute('kscdst') ) {
            // Partindo de um rei para uma destino roque grande
            rookElem = document.getElementById((columnArray[(columnArray.length-1)] + orgsq.id[SQUARE_NUMERIC_NDX]));
        }
        rookDestElem = document.getElementById(rookElem.getAttribute('cstldst'));
        rookKingElem = document.getElementById(rookElem.getAttribute('kpos'));
        
        if ( rookDestElem.getAttribute('lmv') == relativeDirection )
            kingDir = RIGHT;
        
        kingDestinationElem = document.getElementById(getSquare(rookDestElem, kingDir));
        movementChain.push([rookElem, rookDestElem]);
        movementChain.push([rookKingElem, kingDestinationElem]);
    }
     else if ( orgsq.hasAttribute('prow') && validateProtionDestinationSquare(orgsq.getAttribute('prow'), destsq.id) ){
        // Promover peao, sera utilizada a escolha previa
        // ou apresentado um menu de selecao
        let rtchoice = "";
        let promChoice = "";
        do {
            let promOpt = "Selecione:\r\n"
            let i = 1;
            
            PROMOTION_PIECES.map(piece =>{
                promOpt += i + ". " + piece + "\r\n";
                i++;
            })
            promChoice = (prompt(promOpt, "") - 1);
            rtchoice = PROMOTION_PIECES[promChoice];
            if ( rtchoice === undefined ){
                if ( !confirm("Opcao invalida, continuar?") ){
                    promChoice = 1;
                    break;
                }
            }
        } while(rtchoice === undefined);

        lowlightSelection();
        lowlightCapture();
        let divToReplace = "";
        if ( destsq.outerHTML.indexOf('BLANK') === -1 ){
            divToReplace = destsq.outerHTML.split("pc")[0];
        }
        else{
            divToReplace = destsq.outerHTML.split("sqtype")[0];
        }
        divToReplace += " pc"+pieceColumnLookup[promChoice]+"=\"1\" " + "initsq=\""+orgsq.getAttribute('initsq')+"\" ";
        divToReplace += getFrameByTypeAndColor(pieceTypeByColumn[promChoice], orgsq.getAttribute('sqcolor'));

        objCoreAttr = new Object({
            divStringToReplace: divToReplace
        });
        window.localStorage.removeItem('promPiece');
        window.localStorage.setItem('promPiece', JSON.stringify({ ...objCoreAttr}));
        movementChain.push([orgsq, destsq])
    }
    else{
        movementChain.push([orgsq, destsq])
    }
    return movementChain;
}
function doMoveToDestination(orgsq, destsq){
    var objSquare = JSON.parse(window.localStorage.getItem(destsq.id));
    var objPiece  = JSON.parse(window.localStorage.getItem("p"+orgsq.id));
    let pieceStr = "";
    let squareStr = "";
    let setAsBlank = false;
    let newDestSquare = document.getElementById(destsq.id);
    let newOrigSquare = document.getElementById(orgsq.id);
    lowlightElement(newDestSquare);
    lowlightElement(newOrigSquare);
    if  ( newDestSquare.outerHTML.indexOf('BLANK') === -1 ){
        squareStr = newDestSquare.outerHTML.split("pc")[0];
        setAsBlank = true;
    }
    else{
        // Movimento
        squareStr = newDestSquare.outerHTML.split("sqtype")[0];
    }
    if (newOrigSquare.outerHTML.indexOf('BLANK') === -1){
        pieceStr = newOrigSquare.outerHTML.split("pc")[0];
    }
    else  {
        pieceStr = newOrigSquare.outerHTML.split("sqtype")[0];
    }
    newOrigSquare.removeEventListener('click', squareHandler);
    newDestSquare.removeEventListener('click', squareHandler);
    newOrigSquare.outerHTML = pieceStr +  (setAsBlank ? blankFrameStr : objSquare.divStringToReplace);
    newDestSquare.outerHTML = squareStr + objPiece.divStringToReplace;
    newOrigSquare = document.getElementById(orgsq.id);
    newOrigSquare.addEventListener('click', squareHandler);
    newDestSquare = document.getElementById(destsq.id);
    newDestSquare.addEventListener('click', squareHandler);
    setMovedElem(newDestSquare);
    saveCoreAttrOnLocalStorage(newDestSquare);
    saveCoreAttrOnLocalStorage(newOrigSquare);
}
function validateCastleDestinationSquare(mySquare){
    // alert((validateCastleFriendDestinationSquare(mySquare) 
    // || validateCastleBlankDestinationSquare(mySquare) ))
    return ( validateCastleFriendDestinationSquare(mySquare) 
             || validateCastleBlankDestinationSquare(mySquare) )
}
function validateCastleFriendDestinationSquare(square){
    let originSelection = getFirstSelectedElement();
    // Torre clicando no Rei
    if ( originSelection.hasAttribute('kpos') 
         && originSelection.getAttribute('kpos') == square.id )
        return true;
    // Rei Clicando na torre
    if ( square.hasAttribute('kpos')
         && square.getAttribute('kpos') == originSelection.id )
         return true;
    
    return false;
}
function validateEnPassantDestSquare(square){
    let elemSquare = getElementFromSquareOrSquareId(square, true);
    
    if ( elemSquare == null )
        return false;

    return elemSquare.hasAttribute("epdst");
}
function validateCastleBlankDestinationSquare(square){
    let originSelection = getFirstSelectedElement();

    // Torre -> blankSq
    if ( originSelection.hasAttribute('cstldst') 
         && originSelection.getAttribute('cstldst') == square.id )
        return true;

    // Rei -> blankSq
    if ( 
         getSquareType(originSelection) == SQUARE_TYPE_KING_PIECE
         && ( 
              square.hasAttribute('kscdst')
              || square.hasAttribute('klcdst')
            ) 
       )
         return true;

    return false;
}
function hasAnySquareDrew(){
    return (document.querySelectorAll('[square="1"]').length > 0);
}

function moveSquare(square){
    let mySquare = getElementFromSquareOrSquareId(square);
    return (
             isValidSquare(mySquare)
             && validateIsSelected() 
             && (validateIsBlank(mySquare) || validateCastleDestinationSquare(mySquare))
             && !validateEnPassantDestSquare(mySquare)
             && validateIsOnRange(mySquare)
           );
}
function changeSelectedSquare(square){
    return (
              validateIsSelected() 
              && validateFriendlyPieceSquare(square) 
              && !validateIsSameSquare(square)
              && !validateCastleDestinationSquare(square)
           );
}
function captureSquare(square){
    return (
              validateIsSelected() 
              && (validateEnemyPieceSquare(square) || validateEnPassantDestSquare(square))
              && validateIsOnRange(square)
              && validateIsCaptureSquare(square)
           );
}
function clearElementSelection(elem){
    clearSelection(elem.id);
    clearMoveSelection(elem.id);
    clearCaptureSelection(elem.id);
}
function clearAllElementSelection(){
    lowlightSelection();
    lowlightCapture();
    document.querySelectorAll('[sltd]').forEach(element => {
        clearSelection(element.id);
    });
    document.querySelectorAll('[mvsl]').forEach(element => {
        clearMoveSelection(element.id);
    });
    document.querySelectorAll('[cpt]').forEach(element => {
        clearCaptureSelection(element.id);
    });
}
function getAllSelectedElements(){
    if (document.querySelectorAll('[sltd]').length > 0){
        return document.querySelectorAll('[sltd]');
    }
    return false;
}
function getFirstSelectedElement(){
    if ( getAllSelectedElements() != false ){
        return getAllSelectedElements()[0];
    }
    return false;
}
function matchMovementDirection(movType, direction){
    return (movType & direction) ? true : false;
}
function clearSpecialMovementsStatus(){
    document.querySelectorAll('[sqColor="'+playerColor+'"][ep="1"]').forEach(element => {
        element.removeAttribute('ep');
    });   
    document.querySelectorAll('[epdst="1"]').forEach(element => {
        element.removeAttribute('epdst');
    });   
}
function setSpecialMovementStatus(chain){
    clearSpecialMovementsStatus();
      
    let origElem = getElementFromSquareOrSquareId(chain[MOVEMENT_CHAIN_ORIGIN], true);
    let destElem = getElementFromSquareOrSquareId(chain[MOVEMENT_CHAIN_DESTINATION], true);

    if ( getSquareType(destElem) == SQUARE_TYPE_PAWN_PIECE ){ 
        // En Passant?
        if ( (destElem.id[SQUARE_NUMERIC_NDX] - origElem.id[SQUARE_NUMERIC_NDX]) > SQUARE_RANGE ){
            // Marcar como 'passivel de'
            destElem.setAttribute("ep", "1");
        }
        let captureSq = destElem.getAttribute(BOTTOM_DIRECTION);
        let enPasseSq = getElementFromSquareOrSquareId(captureSq, true);
        if ( enPasseSq.hasAttribute('ep') ){
            // Limpar square 'En passado'
            enPasseSq.outerHTML = enPasseSq.outerHTML.split("sqtype")[0] + " " + blankFrameStr;
        }
        if ( destElem.hasAttribute('prow') && validateProtionDestinationSquare(destElem.getAttribute('prow'), destElem.id) ){
            var objSquare = JSON.parse(window.localStorage.getItem('promPiece'));
            destElem.removeEventListener('click', squareHandler);
            destElem.outerHTML = objSquare.divStringToReplace;  
            destElem = getElementFromSquareOrSquareId(destElem.id, true);
            destElem.addEventListener('click', squareHandler);
            saveCoreAttrOnLocalStorage(destElem);
        }
    }

}
function setupCapture(event){
    let strElem = getElementFromSquareOrSquareId(event.target);
    if ( validateEnPassantDestSquare(strElem) ){
        let captureSq = strElem.getAttribute(BOTTOM_DIRECTION);
        strElem = document.getElementById(captureSq);
    }
    retStr = strElem.getAttribute('sqcolor').split("PIECE")[0][0] 
    + strElem.getAttribute('sqtype').split("PIECE")[0][0]
    + strElem.id[0] + " ";

    return retStr;
}
function squareHandler(event){
    event.preventDefault();
    let captureSq = false;

    // Square aliado e
    // SEM selecao previa ou COM selecao previa 
    if ( selectSquare(event.target) || changeSelectedSquare(event.target) ){
        if ( validateIsSelected() ){
            clearAllElementSelection();
        }
        setSelection(event.target);
        highlightSquares(event.target);
    }

    // Selecao previa + square sem pecas ou
    // Selecao previa + square com pecas inimigas
    else if ( moveSquare(event.target) || (captureSq = captureSquare(event.target)) != false ){
        let oldelem = getFirstSelectedElement();
        if ( captureSq ){
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
        let movementChain = setupMovement(oldelem, event.target);
        //
        // Deslocamento
        //
        movementChain.map(chain => {
            doMoveToDestination(chain[MOVEMENT_CHAIN_ORIGIN], chain[MOVEMENT_CHAIN_DESTINATION]); 
        })
        //
        // Desdobramento
        //
        setSpecialMovementStatus(movementChain[0]);
        clearAllElementSelection();
        //
        // Passar Turno
        //
    }
    else if ( selectSameSquare(event.target) ){
        clearAllElementSelection();
    }
    //drawSquareDetails();

}

function readyHandler(event){
    
    event.preventDefault();

    if ( document.getElementById('a1') != null )
        return;

    // drawBoardSquares(GAME_CONTEXT_INITIAL, null);
    // drawBoardSquares( 
    //                   GAME_CONTEXT_SKIP_PIECES,
    //                   [ 
    //                       SQUARE_TYPE_BISHOP_PIECE,
    //                       SQUARE_TYPE_KNIGHT_PIECE, 
    //                       SQUARE_TYPE_QUEEN_PIECE
    //                   ]
    //                 );
    drawBoardSquares(
                      GAME_CONTEXT_SKIP_SIDE,
                      ENEMY_SIDE
                    );

    $('#board').css("transform", "scaleY(-1)");

    drawHorizontalSubtitles();
    
}
//
//  Supervisor
//
function drawHorizontalSubtitles(){
    marginLeft = 140;
    let columnAlpha = ""

    columnArray.map(function (clmAlpha,clmndx){        
        let subtitle  =  document.createElement('div');
        columnAlpha = clmAlpha;
        if ( playerColor == avaliableColors[BLACK_COLOR] ){
            columnAlpha = revColumn[clmndx];
        }

        subtitle.innerHTML = columnAlpha;
        subtitle.style.marginLeft = marginLeft+"px";
        subtitle.style.marginTop = "690px";
        subtitle.style.position = 'absolute'; 
        subtitle.style.color= 'black'; 
        subtitle.style.fontWeight= 'bold';
        subtitle.style.fontSize= "20px";
        subtitle.id = "subtitles";
        document.getElementById('container').appendChild(subtitle);
        marginLeft += 81;
    });
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

function setSupervisorDiv(divId, mgTop){
    let supervisor = document.createElement('div');
    supervisor.style.position = 'absolute'; 
    supervisor.id = "slp" + (divId);
    supervisor.style.marginLeft = "780px";
    supervisor.style.marginTop = mgTop+"px";
    supervisor.classList.add('supervisordiv');
    document.getElementById('container').appendChild(supervisor);
}
function applyContext(context, extraArg, sqElem){
    // let myElem = document.getElementById(sqElem.id);
    if ( context == GAME_CONTEXT_SKIP_PIECES ) {
        extraArg.map(pT  => {
            if ( pT == sqElem.squareType ){
                sqElem.squareElem.removeAttribute(("pc"+getPieceTypeFromSquareType(sqElem.squareType)));
                sqElem.squareElem.removeAttribute("initsq");
                sqElem.squareElem.setAttribute("sqtype", SQUARE_TYPE_BLANK);
                sqElem.squareElem.setAttribute("sqcolor", "0");
                sqElem.squareElem.innerHTML = ""
            }
        });
    }
    if ( context == GAME_CONTEXT_SKIP_SIDE ) {
        if ( validateSquareSide(sqElem.squareElem) == extraArg ){
            sqElem.squareElem.removeAttribute(("pc"+getPieceTypeFromSquareType(sqElem.squareType)));
            sqElem.squareElem.removeAttribute("initsq");
            sqElem.squareElem.setAttribute("sqcolor", "0");
            sqElem.squareElem.setAttribute("sqtype", SQUARE_TYPE_BLANK);
            sqElem.squareElem.innerHTML = ""
        }
    }
}
function drawBoardSquares(context, extraArg=null){
    const board = document.getElementById('board');
    let storageSquares = [];
    let marginLeft = 0;
    let marginTop = 0;
    let supervisorMarginTop = 40;
    let supervisoridCtr = 0;
    let rowColorToggle = false;
    let i = 0;
    let columnAlpha;

    destroySquares();

    for ( let rowNdx = 1; rowNdx < 9; rowNdx++ ){
        columnArray.map(function (clmAlpha, clmNdx){
            try{
                var squareColorSeq = DARK_BGCOLOR;
                columnAlpha = clmAlpha;
                if ( playerColor == avaliableColors[BLACK_COLOR] ){
                    rowNdx = (9 - rowNdx);
                    columnAlpha = revColumn[clmNdx];
                }

                if ( clmNdx % 2 != rowColorToggle ) {
                    squareColorSeq = squareColorSeq ? 0 : 1;
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
                newsquare.squareElem.setAttribute("tlsq", newsquare.topLeftSquare);
                newsquare.squareElem.setAttribute("trsq", newsquare.topRightSquare);
                newsquare.squareElem.setAttribute("brsq", newsquare.bottomRightSquare);
                newsquare.squareElem.setAttribute("blsq", newsquare.bottomLeftSquare);
                newsquare.squareElem.setAttribute("tsq", newsquare.topSquare);
                newsquare.squareElem.setAttribute("bsq", newsquare.bottomSquare);
                newsquare.squareElem.setAttribute("lsq", newsquare.leftSquare);
                newsquare.squareElem.setAttribute("rsq", newsquare.rightSquare);
                newsquare.squareElem.innerHTML = newsquare.squareType.split("PIECE")[0];
                
                if ( newsquare.kingDstCstSq != false )
                    newsquare.squareElem.setAttribute(newsquare.kingDstCstSq, "1");
                    
                if ( newsquare.squareColor != BLANK_SQUARE_COLOR ){
                    let attrPieceType = "pc"+getPieceTypeFromSquareType(newsquare.squareType);
                    newsquare.squareElem.setAttribute(attrPieceType,"1");
                    newsquare.squareElem.setAttribute("initsq", newsquare.initSquareId);
                }
                else{
                    newsquare.squareElem.innerHTML = ""
                } 
                if ( newsquare.longCastleSquare )
                    newsquare.squareElem.setAttribute("lcstl", newsquare.longCastleSquare);
                if ( newsquare.shortCastleSquare )
                    newsquare.squareElem.setAttribute("scstl", newsquare.shortCastleSquare);

                newsquare.squareElem.setAttribute("sqtype", newsquare.squareType);
                newsquare.squareElem.setAttribute("sqcolor", newsquare.squareColor);
                if ( newsquare.prRow > 0 )
                    newsquare.squareElem.setAttribute("prow", newsquare.prRow);

                applyContext(context, extraArg, newsquare);
                board.appendChild(newsquare.squareElem); 
                setSupervisorDiv(supervisoridCtr, supervisorMarginTop);
                supervisoridCtr++;
                supervisorMarginTop += 20;
                
                saveCoreAttrOnLocalStorage(newsquare.squareElem);

                storageSquares[i++] = newsquare.squareElem;
            }
            catch(err){
                alert(err.message);
            }
            
            if ( playerColor == avaliableColors[BLACK_COLOR] ){
                rowNdx = (9 - rowNdx);
            }
        });
        marginTop += 80;
        marginLeft = 0;
        
        rowColorToggle = !rowColorToggle;

    }
    setSpecialMovementAttributes();
    window.localStorage.removeItem("gameBoard");
    window.localStorage.setItem("gameBoard", JSON.stringify( { ...storageSquares} ));
}
function setClockListener(clockId, cHdl){
    const createclock = document.getElementById(clockId);
    createclock.addEventListener('click', cHdl);
}
function drawInitialBoard(boardId, buttonreadyHandler){
    const createbtn = document.getElementById(boardId);
    createbtn.addEventListener('click', buttonreadyHandler);
}
function setToggleColor(toggleId, buttonreadyHandler){
    const createbtn = document.getElementById(toggleId);
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
     document.querySelectorAll('[id="subtitles"]').forEach(element => {
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
    for (var i = 0; i < ROW_SQUARE_COUNT; i++) {
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
    radioLbl[0].style.marginTop = '12px';
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
    radioElem[0].style.marginTop = '15px';
    radioElem[0].style.marginLeft = '985px';
    radioElem[0].addEventListener('change', drawSquareDetails);

    // Black Label
    radioLbl[1] = document.createElement("label");
    radioLbl[1].for = "spsbrdblack";
    radioLbl[1].id = "spsblblrdblack";
    radioLbl[1].innerHTML = "Black:";
    radioLbl[1].style.position = 'absolute';
    radioLbl[1].style.marginTop = '12px';
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
    radioElem[1].style.marginTop = '15px';
    radioElem[1].style.marginLeft = '1050px';
    radioElem[1].addEventListener('change', drawSquareDetails);

    // Label Ambos
    radioLbl[2] = document.createElement("label");
    radioLbl[2].for = "spsbrdboth";
    radioLbl[2].id = "spsblblrdboth";
    radioLbl[2].innerHTML = "Tudo:";
    radioLbl[2].style.position = 'absolute';
    radioLbl[2].style.marginTop = '-5px';
    radioLbl[2].style.marginLeft = '945px';
    // Radio button Ambos
    radioElem[2] = document.createElement("input");
    radioElem[2].type = 'radio';
    radioElem[2].id = "spsbrdboth";
    radioElem[2].value = "both";  
    if ( radioVal == radioElem[2].value )
        radioElem[2].checked = true;

    radioElem[2].name="colors";
    radioElem[2].style.position = 'absolute';
    radioElem[2].style.marginTop = '-2px';
    radioElem[2].style.marginLeft = '985px';
    radioElem[2].addEventListener('change', drawSquareDetails);

    // Tipo de peça
    let pieceTypeChkbox = [];
    let labelType = [];
    let pieceTypeFilter = "";
    let marginLeftOffset = 55;
    let initialOffset = 1075;
    let marginTop = -2;
    let virgAdd = '';
    for (var i = 0; i < 5; i++) {
        typeValue = 0;
        pieceTypeChkbox[i] = document.getElementById('spsbchkboxtype' + i);
        if ( pieceTypeChkbox[i] != null && pieceTypeChkbox[i].checked ){
            typeValue = 1;
            pieceTypeFilter += virgAdd + "[pc" + pieceColumnLookup[i] + "]";
            virgAdd = ',';
        }
        else
            virgAdd = '';

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
          pieceTypeChkbox[i].checked = 1;
        }
        initialOffset = (initialOffset + 20);
        marginLeftOffset = (marginLeftOffset + 10);
        if ( i == 2 ){
            marginTop = 15;
            initialOffset = 1075;
            marginLeftOffset = 55;
        } 
    }
    typeValue  = 0;
    labelType[i] = document.createElement("label");
    labelType[i].for = "spsbchkboxtype"+i;
    labelType[i].id = "spsblbltype"+i;
    labelType[i].innerHTML = SQUARE_TYPE_PAWN_PIECE.split("PIECE")[0]+":" ;
    labelType[i].style.position = 'absolute';
    labelType[i].style.marginTop = '15px';
    labelType[i].style.marginLeft = initialOffset+"px";
    initialOffset += 70;
    pieceTypeChkbox[i] = document.getElementById('spsbchkboxtype'+i);
    if ( pieceTypeChkbox[i] != null && pieceTypeChkbox[i].checked ){
        typeValue = 1;
        if ( pieceTypeFilter != "" )
            virgAdd = ',';
        pieceTypeFilter += virgAdd + "[pc" + pieceColumnLookup[i]+ "]";
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
        pieceTypeChkbox[i].checked = 1;
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
    if ( checkSelected != null && checkSelected.checked ){
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
    document.getElementById("container").appendChild(radioElem[2]);
    document.getElementById("container").appendChild(radioLbl[2]);
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
    clearAllElementSelection();

    if ( e.target.value == -1 && e.target.checked == false){
        return ;
    }

    let mySquare = document.getElementById('spsbdirectionhlselect');
    let drawDiag = document.getElementById('spsbdiagonaldir').checked;
    let drawColumn = document.getElementById('spsbcolumndir').checked;
    let drawLine = document.getElementById('spsblinedir').checked;

    setSelection(document.getElementById(mySquare.value));
    if ( drawDiag == true ){
        getDirectionFromSquare(mySquare, MAIN_DIAGONAL_DIRECTION, LINE_OF_SIGHT, IGNORE_COLISION);
        getDirectionFromSquare(mySquare, OPPOSITE_DIAGONAL_DIRECTION, LINE_OF_SIGHT, IGNORE_COLISION);
    }
    if ( drawColumn == true ){
        getDirectionFromSquare(mySquare, COLUMN_DIRECTION, LINE_OF_SIGHT, IGNORE_COLISION);
    }
    if ( drawLine == true ){
        getDirectionFromSquare(mySquare, LINE_DIRECTION, LINE_OF_SIGHT, IGNORE_COLISION);
    }
    highlightSelection();
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
    
    directionSelected = false;
    let checkDirectionDiagonal = document.getElementById('spsbdiagonaldir');
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
    checkDirectionDiagonal.addEventListener('change', setDirectionFromSelect);
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

    
    directionSelected = false;
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
    checkDirectionColumn.addEventListener('change', setDirectionFromSelect);
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

    directionSelected = false;
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
    checkDirectionLine.addEventListener('change', setDirectionFromSelect);
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
    textElem.value = "" + intervalSeconds;
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
    if (  (Number(seconds) > 1) && (Number(seconds) < 20) && seconds != intervalSeconds ){
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
    if ( filterDetails[FILTER_COLUMN] != -1 && filterDetails[FILTER_ROW] != -1  ){
        selector = "[square][id='"+columnArray[filterDetails[FILTER_COLUMN]]+(Number(filterDetails[FILTER_ROW])+1)+"']";
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
}
function matchColumnIntervalExcludingInterval(initialColumn, endColumn=null, initialInterval=null, endInterval=null){
    let myColumn = initialColumn 
    if ( endColumn != null ) 
        myColumn  += "-" + endColumn;

    let pattern = "(["+myColumn+"])"
    let interval = -1``
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
            clearSelection(element.id);
            element.innerHTML = "";
        }
    });
    selector = "[class*='square']:not([sqcolor='0'])";
    document.querySelectorAll(selector).forEach(element => {
        let ndxOfInitSquare = columnArray.indexOf(element.getAttribute('initsq')[SQUARE_ALPHABETICAL_NDX]);
        element.setAttribute("sqtype", pieceTypeByColumn[ndxOfInitSquare]);
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
function toggleSupervisor(){
    supervisorMode = !supervisorMode;
    drawSquareDetails();
}

function togglePlayerColorAndRedrawBoard(event){
    if ( !confirm('ATENÇÃO! Inverter as cores? (todo progresso será perdido)') )
        return;

    playerColor = avaliableColors.indexOf(playerColor) 
                  ? avaliableColors[WHITE_COLOR] 
                  : avaliableColors[BLACK_COLOR];
    
    assingDirectionsByPlayerColor();

    destroySquares();
    readyHandler(event);
}
var btimer = GAME_INITIAL_TIME;
function blackPlayerTimer() {
    let seconds;
    let minutes;
    minutes = parseInt(btimer / 60, 10)
    seconds = parseInt(btimer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    document.getElementById("bspntmr").textContent = minutes + ":" + seconds;

    if (--btimer < 0) {
        btimer = GAME_INITIAL_TIME;
    }
}
var wtimer = GAME_INITIAL_TIME;
function whitePlayerTimer() {
    let seconds;
    let minutes;
    minutes = parseInt(wtimer / 60, 10)
    seconds = parseInt(wtimer % 60, 10);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    document.getElementById("wspntmr").textContent = minutes + ":" + seconds;

    if (--wtimer < 0) {
        wtimer = GAME_INITIAL_TIME;
    }
}
function bTimerHandler(event){
    let chksts = document.getElementById('btinput').checked;
    // alert(chksts)
    if ( chksts == true ){
        // document.getElementById('btinput').checked = true;
        return true;
    }

    // alert(document.getElementById('btinput').checked)
    // alert(document.getElementById('wtinput').checked)
    window.clearInterval(bPTInterval);
    document.getElementById('btinput').checked = false;
    document.getElementById('wtinput').checked = !document.getElementById('wtinput').checked;
    wPTInterval = window.setInterval(whitePlayerTimer, 1000);
    return false;
}
function wTimerHandler(event){
    let chksts = document.getElementById('wtinput').checked;
    if ( chksts == true ){
        // document.getElementById('wtinput').checked = true;
        return true;
    }

    window.clearInterval(wPTInterval);
    document.getElementById('btinput').checked = !document.getElementById('btinput').checked;
    document.getElementById('wtinput').checked = false;
    bPTInterval = window.setInterval(blackPlayerTimer, 1000);
    return true;
}
$(document).ready(function (){
    playerColor = avaliableColors[BLACK_COLOR];
    if ( (Math.floor(Math.random() * 9) % 2) == 0 )
        playerColor = avaliableColors[WHITE_COLOR];

    assingDirectionsByPlayerColor();

    myInterval = window.setInterval(setSupervisorPatrol, intervalTime);
    wPTInterval = window.setInterval(whitePlayerTimer, 1000);
    bPTInterval = window.setInterval(blackPlayerTimer, 1000);
    // $('#whitetimer').click()
    window.clearInterval(bPTInterval);
    document.getElementById('wtinput').checked = false;
    document.getElementById('btinput').checked = true;
});

setClockListener("whitetimer", wTimerHandler);
setClockListener("blacktimer", bTimerHandler);
drawInitialBoard("boardcreate", readyHandler);
setToggleColor("togglecolor", togglePlayerColorAndRedrawBoard);