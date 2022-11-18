/*!
 * FEN Generator copyright R.Urban
 * and other contributors.
 *
 * Released under the GNU General Public License v3.
 *
 *
 * https://github.com/antiproton/Chess-FEN-Generator
 */
const ChessBoard = window["ChessBoard"];
function fen2arr(str) {
  //配列に変換
  arr = str.split(/ /); /////////

  console.log(arr);
  var barr = arr[0];

  barr = barr.replace(/1/g, " ,");
  barr = barr.replace(/2/g, " , ,");
  barr = barr.replace(/3/g, " , , ,");
  barr = barr.replace(/4/g, " , , , ,");
  barr = barr.replace(/5/g, " , , , , ,");
  barr = barr.replace(/6/g, " , , , , , ,");
  barr = barr.replace(/7/g, " , , , , , , ,");
  barr = barr.replace(/8/g, " , , , , , , , ,");

  barr = barr.replace(/r/g, "12356,");
  barr = barr.replace(/n/g, "2346,");
  barr = barr.replace(/b/g, "1236,");
  barr = barr.replace(/q/g, "123456,");
  barr = barr.replace(/k/g, "136,");
  barr = barr.replace(/p/g, "12346,");
  barr = barr.replace(/R/g, "1235,");
  barr = barr.replace(/N/g, "234,");
  barr = barr.replace(/B/g, "123,");
  barr = barr.replace(/Q/g, "12345,");
  barr = barr.replace(/K/g, "13,");
  barr = barr.replace(/P/g, "1234,");
  barr = barr.split(/\//); /////////

  for (var i = 0; i < barr.length; i++) {
    barr[i] = barr[i].split(","); //split one
  }

  console.log(barr);
  return barr;
}

var stockfish = new Worker("stockfish.js");
let wer = "";
let FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
var init = function () {
  var onChange = function (oldPos, newPos) {
    board.position();

    console.log("Position changed:");
    console.log("Old position: " + ChessBoard.objToFen(oldPos));
    console.log("New position: " + ChessBoard.objToFen(newPos));
    console.log("--------------------");

    FEN = ChessBoard.objToFen(newPos);

    document.getElementById("board").innerHTML = FEN;
  };

  var onDrop = function (source, target, piece, newPos, oldPos, orientation) {
    console.log("Source: " + source);
    console.log("Target: " + target);
    console.log("Piece: " + piece);
    console.log("New position: " + ChessBoard.objToFen(newPos));
    console.log("Old position: " + ChessBoard.objToFen(oldPos));
    console.log("Orientation: " + orientation);
    console.log("--------------------");

    FEN = ChessBoard.objToFen(newPos);
    document.getElementById("myFen").value = FEN;

    figur = piece.split("");
    farbe = figur[0];
    if (farbe == "w") {
      wer = "w";
    } else {
      wer = "b";
    }

    //   document.getElementById('content').innerHTML =  wer;
  };

  var cfg = {
    draggable: true,
    position: "start",
    onDrop: onDrop,
    onChange: onChange,
    sparePieces: true,
  };
  var board = ChessBoard("board", cfg);
  //--- end example JS ---

  document.querySelector("[id=startPositionBtn]").on("click", function () {
    board.position("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
    document.getElementById("myFen").value =
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
  });
  document.querySelector("[id=clearBoardBtn]").on("click", function () {
    board.position("8/8/8/8/8/8/8/8");
    document.getElementById("myFen").value = "8/8/8/8/8/8/8/8";
  });

  document.querySelector("[id=flipOrientationBtn]").on("click", board.flip);

  document.querySelector("[id=move1Btn]").on("click", function () {
    if (wer == "w") {
      wer = "b";
    } else {
      wer = "w";
    }

    stockfish.postMessage("position fen" + " " + FEN + " " + wer);
    stockfish.postMessage("go depth 15");
    stockfish.onmessage = function (event) {
      console.log(event.data);

      document.getElementById("ausgabe").value = event.data;
      // document.getElementById("ausgabe2").innerHTML = event.data;
      var str = event.data;
      var res = str.split(" ");

      if (res[0] == "bestmove") {
        var zug = res[1].split("");

        var bot = zug[0] + zug[1] + "-" + zug[2] + zug[3];
        //  document.getElementById("ausgabe3").innerHTML = bot;

        board.move(bot);

        FENzerlegung = FEN.split("/");

        var FEN0 = FENzerlegung[0].replace("P", "Q");
        var FEN7 = FENzerlegung[7].replace("p", "q");

        FEN =
          FEN0 +
          "/" +
          FENzerlegung[1] +
          "/" +
          FENzerlegung[2] +
          "/" +
          FENzerlegung[3] +
          "/" +
          FENzerlegung[4] +
          "/" +
          FENzerlegung[5] +
          "/" +
          FENzerlegung[6] +
          "/" +
          FEN7;

        board.position(FEN);
      }
    };
  });
}; // end init()
window.document.onloadeddata = init;
