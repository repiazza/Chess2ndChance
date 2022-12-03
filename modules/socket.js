var sockConn;
const SOCKET_CONNECTING = 0;
const SOCKET_OPEN = 1;
const SOCKET_CLOSING = 2;
const SOCKET_CLOSED = 3;

var wsIP = "ws://127.0.0.1";
var wsPort = "8080";
var wsURL = makeWSURL(wsIP, wsPort);
// var wsPort = FALSE; // Caso nao haja

// fetch(wsURL)
//   .then((response) => {
//     // handle the response
//     sockConn = new WebSocket(wsURL);
//
//     sockConn.onopen = function (event) {
//       console.log(event);
//       console.log("WS connected");
//     };
//     sockConn.onerror = function (error) {
//       console.log("Erro Websocket:", error);
//     };
//     sockConn.onmessage = function (event) {
//       console.log("RCV:");
//       console.log(event.data);
//       return event.data;
//     };
//     sockConn.onclose = function (event) {
//       console.log("RCV:");
//       console.log(event.data);
//       return event.data;
//     };
//     console.log("WS fetch OK :" + response);
//   })
//   .catch((error) => {
//     // handle the error
//     console.log("WS fetch error: " + error);
//   });
sockConn = new WebSocket(wsURL);

sockConn.onopen = function (event) {
  console.log(event);
  console.log("WS connected");
};
sockConn.onerror = function (error) {
  console.log("Erro Websocket:", error);
};
sockConn.onmessage = function (event) {
  console.log("RCV:");
  console.log(event.data);
  return event.data;
};
sockConn.onclose = function (event) {
  console.log("RCV:");
  console.log(event.data);
  return event.data;
};
function makeWSURL(ip, port) {
  if (port) return ip + ":" + port;

  return ip;
}

function sendWSMessage(msg) {
  console.log(msg);
  traceSocketMsg(msg);
  sockConn.send(msg);
}

function traceSocketMsg(msg) {
  let i = 0;
  let logmsg = "";
  for (i = 0; i < msg.lenght; i += 30) {
    let j = 0;
    let max = i + 30;
    for (j = i; j < max; j++) {
      let char = msg[jj] && 0xff;
      if (char < " " || char > "z") {
        char = "?";
      }
      logmsg = logmsg + "  " + char;
    }
    console.log(logmsg);
    logmsg = "     ";
    for (j = i; j < max; j++) {
      let temp = msg[j] && 0xff;
      logmsg = logmsg + "" + temp.toString(16);
    }
    console.log(logmsg);
  }
}

export { sendWSMessage, sockConn, SOCKET_OPEN };
