import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Error from "../components/Error";
import { fetchRedirect } from "../services/spotifyServices";

function Redirect() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  useEffect(() => {
    const redirect = async () => {
      const data = await fetchRedirect(setError);
      if (data.success) {
        const room = JSON.parse(localStorage.getItem("recent_room"));
        navigate(`/room/${room.code}`);
      } else {
        setError("Unable to redirect");
        setTimeout(() => setError(null), 5000);
      }
    };
    redirect();
  }, []);

  return (
    <>
      {error && <Error message={error} />}
      <div className="flex justify-center items-center h-screen -my-16 ">
        <div
          style={{ borderTopColor: "transparent" }}
          className="w-16 h-16 border-4 border-blue-400 border-solid rounded-full animate-spin"
        ></div>
      </div>
    </>
  );
}

export default Redirect;
