import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

function TransferPlayback() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="max-w-7xl m-auto p-2 sm:px-6 lg:px-8 mt-10">
        <h1 className="font-bold text-2xl py-2">
          Transfering Playback to Webplayer
        </h1>
        <p>
          The activate button didn't work? That's okay, in the case when the
          button doesn't work, you can transfer the access manually. All you
          need is a device where you have the spotify!
        </p>
        <h2 className="font-medium text-lg mt-5">
          What does it mean to transfer playback?
        </h2>
        <p className="px-10">
          In order to play music inside the room you need to let spotify know
          that you want your music to play on this site, similar to how you
          would play music from your spotify mobile app to a bluetooth speaker.{" "}
        </p>
        <h2 className="font-medium text-lg mt-5">Step-by-Step Guide:</h2>
        <ol className="list-decimal px-10">
          <li>Go to your spotify app, either on your mobile device or PC</li>
          <li>Play a song</li>
          <li>Click the devices button on the player portion of the app. </li>
          <p>
            Before continuing to the next step, make sure you are in your room
            or else the room music player might not be listed as one of the
            devices available!
          </p>
          <li> Select "WebPlayback SDK" </li>
          <p>
            If there are multiple "WebPlayback SDK" devices then select them one
            my one until the player appears in the room
          </p>
          <p>All set!</p>
          <p>
            Still not working? Please fill out this form and we'll on fixing it
            right away
          </p>
        </ol>
      </div>
    </div>
  );
}

export default TransferPlayback;
