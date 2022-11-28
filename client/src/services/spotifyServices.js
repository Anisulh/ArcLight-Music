import axios from 'axios';

export const onPause = (roomCode, guest_id, websocket_controlled = false) => {
  const requestOptions = {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      room_code: roomCode,
      guest_id: guest_id,
      websocket_controlled: websocket_controlled
    }),
  };
  fetch("http://127.0.0.1:8000/spotify/pause", requestOptions);
};
export const onPlay = (roomCode, guest_id, websocket_controlled = false) => {
  const requestOptions = {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      room_code: roomCode,
      guest_id: guest_id,
      websocket_controlled: websocket_controlled
    }),
  };
  fetch("http://127.0.0.1:8000/spotify/play", requestOptions);
};

export const onNextSong = (roomCode, guest_id) => {
  const requestOptions = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      room_code: roomCode,
      guest_id: guest_id,
    }),
  };
  fetch("http://127.0.0.1:8000/spotify/next", requestOptions);
};

export const onPreviousSong = (roomCode, guest_id) => {
  try {
    const requestOptions = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        room_code: roomCode,
        guest_id: guest_id,
      }),
    };
    fetch("http://127.0.0.1:8000/spotify/prev", requestOptions);
  } catch (error) {
    console.log(error)
  }

};

export const fetchCurrentPlaying = async (room_code) => {
  const requestOptions = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      room_code: room_code,
    }),
  };
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/spotify/currently-playing",
      requestOptions
    );

    if (!response.ok) {
      return {};
    } else {
      return response.json();
    }
  } catch (error) {
    console.log(error);
  }
};

export const authenticateSpotify = async (setRoomInfo, guest_id, setToken) => {
  const requestOptions = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      guest_id: guest_id,
    }),
  };
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/spotify/authenticate",
      requestOptions
    );
    const data = await response.json();

    if (data.url) {
      window.location.replace(data.url);
    } else if (response.ok) {
      setRoomInfo((prevState) => ({
        ...prevState,
        spotifyAuthenticated: true,
      }));
      setToken(data.token)
    } else if (data.response) {
      console.log(response);
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchRedirect = async () => {
  const guest = JSON.parse(localStorage.getItem("guest"));
  const requestOptions = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      guest_id: guest.guest_id,
    }),
  };
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/spotify/redirect",
      requestOptions
    );
    return response.json();
  } catch (error) {
    console.log(error);
  }
};


export const fetchSearch = async (query, type) => {
  const room = JSON.parse(localStorage.getItem("recent_room"));
  const requestOptions = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      host_id: room.host_id,
      query: query,
      type: type
    }),
  };
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/spotify/search",
      requestOptions
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};


export const sendSong = async (guest_id, songInfo, websocket_controlled = false) => {
  const { uri, position } = songInfo
  const requestOptions = {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      guest_id: guest_id,
      uri: uri,
      position: position,
      websocket_controlled: websocket_controlled
    }),
  };
  try {
    await fetch("http://127.0.0.1:8000/spotify/set-track",
      requestOptions)
  } catch (error) {
    console.log(error)
  }
}

export const transferPlayback = async (token, device_id) => {

  try {
    await axios.put("https://api.spotify.com/v1/me/player", { device_ids: [device_id], play: true },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  } catch (error) {
    console.log(error)
  }

}
