var sockConn;
const SOCKET_CONNECTING = 0;
const SOCKET_OPEN = 1;
const SOCKET_CLOSING = 2;
const SOCKET_CLOSED = 3;

var wsIP = "ws://127.0.0.1";
var wsPort = "8080";
var wsURL = makeWSURL(wsIP, wsPort);

const SOCKET_MESSAGE_TYPE_COMMAND = 1;
const SOCKET_MESSAGE_TYPE_OTHER = 2;

var connOK = true;
// fetch(wsURL)
//   .then(function (response) {
//     if (response.ok) {
//       connOK = true;
//       console.log("WS OK.");
//     } else {
//       console.log("WS NOK.");
//     }
//   })
//   .catch(function (error) {
//     console.log("WS NOK.: " + error.message);
//   });

if (connOK) {
  try {
    sockConn = new WebSocket(wsURL);
  } catch (error) {
    console.log(" erro ao fazer conexao", error);
  }

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
}
function makeWSURL(ip, port = false) {
  console.log("makeWSURL ip[", ip, "] port[", port, "]");
  if (port) return ip + ":" + port;

  return ip;
}

function sendWSMessage(msg, msgType = SOCKET_MESSAGE_TYPE_COMMAND) {
  if (!sockConn) return false;
  let msgToSend = "CMD|";
  if (msgType != SOCKET_MESSAGE_TYPE_COMMAND) {
    msgToSend = msgType;
  }

  msgToSend = msgType + msg;

  console.log(msgToSend);
  traceSocketMsg(msgToSend);
  sockConn.send(msgToSend);
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

export {
  sendWSMessage,
  sockConn,
  SOCKET_OPEN,
  SOCKET_MESSAGE_TYPE_COMMAND,
  SOCKET_MESSAGE_TYPE_OTHER,
};
