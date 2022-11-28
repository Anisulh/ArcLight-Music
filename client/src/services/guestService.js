export const saveNickName = async (nickname, setError) => {
  const guest = JSON.parse(localStorage.getItem("guest"));
  //if guest doesn't exist then send POST request to create a new guest; if guest already exists then update the nickname
  const requestOptions = guest
    ? {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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
    setError("Unable to set Nickname.")
  }
};

export const leaveSession = async () => {
  const guest = JSON.parse(localStorage.getItem("guest"));
  console.log(guest.guest_id)
  const requestOptions = {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" }
  }
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/guest",
      requestOptions
    );
    return response;
  } catch (error) {
    console.log(error);
    setError("Unable to leave room.");
    setTimeout(() => setError(null), 5000)
  }
}