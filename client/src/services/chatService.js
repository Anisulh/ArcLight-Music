
let location = ''
export function connect(roomCode) {
  const chatSocket = new WebSocket(
    `ws://127.0.0.1:8000/ws/chat/${roomCode}/`
  );
  chatSocket.onmessage = (e) => {
    const data = JSON.parse(e.data);
    console.log("Data:", data);
    chatSocket.onopen = (e) => {
      console.log("Successfully connected to the WebSocket.");
    };

    // chatSocket.onclose = function (e) {
    //   console.log(
    //     "WebSocket connection closed unexpectedly. Trying to reconnect in 2s..."
    //   );
    //   setTimeout(function () {
    //     console.log("Reconnecting...");
    //     connect();
    //   }, 2000);
    // };

    // chatSocket.onmessage = function (e) {
    //   const data = JSON.parse(e.data);
    //   console.log(data);

    //   switch (data.type) {
    //     case "chat_message":
    //       chatLog.value += data.message + "\n";
    //       break;
    //     default:
    //       console.error("Unknown message type!");
    //       break;
    //   }

    //   // scroll 'chatLog' to the bottom
    //   chatLog.scrollTop = chatLog.scrollHeight;
    // };

    // chatSocket.onerror = function (err) {
    //   console.log("WebSocket encountered an error: " + err.message);
    //   console.log("Closing the socket.");
    //   chatSocket.close();
    // };
  }
}
