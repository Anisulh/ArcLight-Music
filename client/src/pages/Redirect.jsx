import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchRedirect } from "../services/spotifyServices";

function Redirect() {
  const navigate = useNavigate();
  useEffect(() => {
    const redirect = async () => {
      const data = await fetchRedirect();
      if (data.success) {
        const room = JSON.parse(localStorage.getItem("recent_room"));
        navigate(`/room/${room.code}`);
      }
    };
    redirect();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen -my-16 ">
      <div
        style={{ borderTopColor: "transparent" }}
        className="w-16 h-16 border-4 border-blue-400 border-solid rounded-full animate-spin"
      ></div>
    </div>
  );
}

export default Redirect;
