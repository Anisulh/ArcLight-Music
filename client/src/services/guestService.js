const BASE_URL = 'https://arclight-music-backend-production.up.railway.app/';
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
      BASE_URL + "api/guest",
      requestOptions
    );
    return response;
  } catch (error) {
    setError("Unable to set Nickname.");
    setTimeout(() => setError(null), 5000);

  }
};

export const leaveSession = async () => {
  const requestOptions = {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" }
  }
  try {
    const response = await fetch(
      BASE_URL + "api/guest",
      requestOptions
    );
    return response;
  } catch (error) {
    setError("Unable to leave room.");
    setTimeout(() => setError(null), 5000);
  }
}