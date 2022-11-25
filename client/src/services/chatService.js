import { onPause, onPlay, sendSong } from "./spotifyServices";

export const onChatMessage = (chatSocket, setMessages, roomCode, guest_id)=> {
  chatSocket.onmessage = (e) => {
    console.log(e.data)
    const data = JSON.parse(e.data);
    const guest = JSON.parse(localStorage.getItem("guest"))
    if (data.message) {
      setMessages((prevState) => [...prevState, data.message]);
    }
    if (data.connection) {
      setMessages((prevState) => [...prevState, data.connection]);
    }
    if (data.spotify && !guest.host) {
      const websocket_controlled = true;

      if (data.spotify._type === "play/pause" && data.spotify.paused) {
        onPause(roomCode, guest_id, websocket_controlled);
      } else if (
        data.spotify._type === "play/pause" &&
        !data.spotify.paused
      ) {
        onPlay(roomCode, guest_id, websocket_controlled);
      } else if (data.spotify.uri && data.spotify.uri !== currentUri) {
        const songInfo = {
          uri: data.spotify.uri,
          position: data.spotify.position,
        };
        sendSong(guest_id, songInfo, websocket_controlled);
      }
    }
  };
}

export const sendSocketPlayPause = (chatSocket, paused, uri, position) => {
  chatSocket.send(
    JSON.stringify({
      player: {
        _type: "play/pause",
        paused,
        uri,
        position,
      },
    })
  );
}

export const sendSocketTrackChange = (chatSocket, paused, uri) => {
  chatSocket.send(
    JSON.stringify({
      player: {
        _type: "track_change",
        paused,
        uri,
        position: 0,
      },
    })
  );
}

export const sendSocketMessage = (chatSocket, guest_id, message) => {
  chatSocket.send(
    JSON.stringify({
      guest_id,
      message,
    })
  );
}