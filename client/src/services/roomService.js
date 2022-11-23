export const saveNickName = async (nickname) => {
  const guest = JSON.parse(localStorage.getItem("guest"));
  //if guest doesn't exist then send POST request to create a new guest; if guest already exists then update the nickname
  const requestOptions = guest
    ? {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guest_id: guest.guest_id,
        nickname: nickname,
      }),
    }
    : {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nickname: nickname,
      }),
    };
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/guest",
      requestOptions
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const fetchRoomInfo = async (roomCode, setRoomInfo) => {
  try {
    const requestOptions = {
      method: "GET",
    };
    const response = await fetch(
      `http://127.0.0.1:8000/api/room/${roomCode}`,
      requestOptions
    );
    const data = await response.json();
    setRoomInfo((prevState) => ({ ...prevState, ...data }));
    return;
  } catch (error) {
    console.log(error);
  }
};

export const createRoom = async (name, votesToSkip, guestController, guestData, setError) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      host_id: guestData.guest_id,
      name: name,
      votes_to_skip: votesToSkip,
      guest_controller: guestController,
    }),
  };
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/room",
      requestOptions
    );
    return response.json();
  } catch (error) {
    setError(`${error}`);
  }
};

export const joinRoom = async (code) => {
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
      `http://127.0.0.1:8000/api/join-room/${code}`,
      requestOptions
    );
    return response.json();
  } catch (error) {
    console.log(error);
  }
};

export const saveRoomInfo = async (
  host_id,
  name,
  votes_to_skip,
  guest_controller
) => {
  const guest = JSON.parse(localStorage.getItem("guest"));
  const requestOptions = {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      guest_id: guest.guest_id,
      host_id,
      name,
      votes_to_skip,
      guest_controller,
    }),
  };
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/room/${roomCode}`,
      requestOptions
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const leaveRoom = async () => {
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
      `http://127.0.0.1:8000/api/leave-room/${code}`,
      requestOptions
    );


    if (response.ok) {
      guest.host = false;
      delete guest.room
      localStorage.setItem("guest", JSON.stringify(guest));
      localStorage.removeItem("recent_room");
      return true;
    } else {
      console.log("unable to leave");
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};
