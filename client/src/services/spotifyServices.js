import axios from 'axios';
const BASE_URL = 'https://arclight-music-backend-production.up.railway.app/';

export const onPause = (roomCode, guest_id, websocket_controlled = false, setError) => {
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
  try {

    fetch(BASE_URL + "spotify/pause", requestOptions);
  } catch (error) {
    setError("Unable to pause")
    setTimeout(() => setError(null), 5000)
  }

};
export const onPlay = (roomCode, guest_id, websocket_controlled = false, setError) => {
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
  try {
    fetch(BASE_URL + "spotify/play", requestOptions);
  } catch (error) {
    setError("Unable to play")
    setTimeout(() => setError(null), 5000)
  }

};

export const onNextSong = (roomCode, guest_id, setError) => {
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
  try {
    fetch(BASE_URL + "spotify/next", requestOptions);
  } catch (error) {
    setError("Unable to play next song")
    setTimeout(() => setError(null), 5000)
  }

};

export const onPreviousSong = (roomCode, guest_id, setError) => {
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
  try {
    fetch(BASE_URL + "spotify/prev", requestOptions);
  } catch (error) {
    setError("Unable to play previous song")
    setTimeout(() => setError(null), 5000)
  }

};

export const authenticateSpotify = async (setRoomInfo, guest_id, setToken, setError) => {
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
      BASE_URL + "spotify/authenticate",
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
    }
  } catch (error) {
    setError("Unable to authenticate with Spotify");
    setTimeout(() => setError(null), 5000)
  }
};

export const fetchRedirect = async (setError) => {
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
      BASE_URL + "spotify/redirect",
      requestOptions
    );
    return response.json();
  } catch (error) {
    setError("Unable to log in");
    setTimeout(() => setError(null), 5000)
  }
};


export const fetchSearch = async (query, type, setError) => {
  const guest = JSON.parse(localStorage.getItem("guest"));
  const requestOptions = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      guest_id: guest.guest_id,
      query: query,
      type: type
    }),
  };
  try {
    const response = await fetch(
      BASE_URL + "spotify/search",
      requestOptions
    );
    return response;
  } catch (error) {
    setError("Unable to preform search");
    setTimeout(() => setError(null), 5000)
  }
};


export const sendSong = async (guest_id, songInfo, websocket_controlled = false, setError) => {
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
    await fetch(BASE_URL + "spotify/set-track",
      requestOptions)
  } catch (error) {
    setError("Unable to update track")
    setTimeout(() => setError(null), 5000)
  }
}

export const transferPlayback = async (token, device_id, setError) => {
  try {
    await axios.put("https://api.spotify.com/v1/me/player", { device_ids: [device_id], play: true },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  } catch (error) {
    setError("Unable to transfer playback")
    setTimeout(() => setError(null), 5000)
  }

}
