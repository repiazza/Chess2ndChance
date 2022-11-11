var sockConn;

sockConn = new WebSocket("ws://localhost:8000");
sockConn.onopen = function (event) {
  console.log(event);
  console.log("WS connected");
};
sockConn.onmessage = function (event) {
  console.log("RCV:");
  console.log(event.data);
  return event.data;
};

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

export { sendWSMessage, sockConn };
