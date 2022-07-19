// Board Composition
//  - Dimensions (sqxsq)
//  - Rows       (indexed by number (1-8))
//  - Columns    (indexed by letters(a-h))
//  - Squares    (composed by Column + Row Index)

// Square attributes:
// pn = PieceName
// pc = PieceColor
// 
function getSquareStatus(){
    // isPieceSquare();
    // isEmptySquare();
    // isOnBoardSquare();
}
function isPieceSquare(squareId){
    return (document.getElementById(squareId).getAttribute('pn') != null);
}
function isEmptySquare(squareId){
    return (document.getElementById(squareId).getAttribute('pn') == null);
}