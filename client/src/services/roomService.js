const BASE_URL = 'https://arclight-music-backend-production.up.railway.app/';

export const fetchRoomInfo = async (roomCode, setRoomInfo, setError) => {
  try {
    const requestOptions = {
      method: "GET",
    };
    const response = await fetch(
      `${BASE_URL}api/room/${roomCode}`,
      requestOptions
    );
    const data = await response.json();
    setRoomInfo((prevState) => ({ ...prevState, ...data }));
    return;
  } catch (error) {
    setError("Unable to get room info");
    setTimeout(() => setError(null), 5000)
  }
};

export const createRoom = async (name, guestController, guestData, setError) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      host_id: guestData.guest_id,
      name: name,
      guest_controller: guestController,
    }),
  };
  try {
    const response = await fetch(
      BASE_URL + "api/room",
      requestOptions
    );
    return response.json();
  } catch (error) {
    setError("Unable to create room");
    setTimeout(() => setError(null), 5000)
  }
};

export const joinRoom = async (code, setError) => {
  const guest = JSON.parse(localStorage.getItem("guest"));
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      guest_id: guest.guest_id,
    }),
  };
  try {
    const response = await fetch(
      `${BASE_URL}api/room/${code}`,
      requestOptions
    );
    return response.json();
  } catch (error) {
    setError("Unable to join room");
    setTimeout(() => setError(null), 5000)
  }
};

export const saveRoomInfo = async (host_id, name, guest_controller, roomCode, setError) => {
  const guest = JSON.parse(localStorage.getItem("guest"));
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      guest_id: guest.guest_id,
      host_id,
      name,
      guest_controller,
    }),
  };
  try {
    const response = await fetch(
      `${BASE_URL}api/room/${roomCode}`,
      requestOptions
    );
    return response;
  } catch (error) {
    setError("Unable to update room settings.")
    setTimeout(() => setError(null), 5000)
  }
};

export const leaveRoom = async (setError) => {
  const guest = JSON.parse(localStorage.getItem("guest"));
  const room = JSON.parse(localStorage.getItem("recent_room"));
  const { code } = room;
  const { guest_id } = guest;
  const requestOptions = {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      guest_id: guest_id,
    }),
  };
  try {
    const response = await fetch(
      `${BASE_URL}api/room/${code}`,
      requestOptions
    );
    if (response.ok) {
      guest.host = false;
      delete guest.room
      localStorage.setItem("guest", JSON.stringify(guest));
      localStorage.removeItem("recent_room");
      return true;
    } else if (guest.host === false) {
      localStorage.removeItem("recent_room");
      return true;
    } else {
      setError("Unable to leave room.");
      setTimeout(() => setError(null), 5000)
      return false;
    }
  } catch (error) {
    setError("Unable to leave room");
    setTimeout(() => setError(null), 5000)
  }
};
