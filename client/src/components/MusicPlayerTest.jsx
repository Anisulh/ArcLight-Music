import React, { useState } from "react";
import { useScript } from "../hooks/useScripts";

function MusicPlayerTest() {
  useScript("https://sdk.scdn.co/spotify-player.js");

  // Called when the Spotify Web Playback SDK is ready to use
  var player;
  window.onSpotifyWebPlaybackSDKReady = () => {
    const token =
      "BQBPE3dC-Kqjkk3P9AYEuLco-YX2w1RmO5TLoJm3AMRq4CHnLW2l4xt2Wk2ZwTX-9H1mXVorGlpXpsL1VzkEp9E5z_G_Wmwv6yk53QOgo4KxX-JOY6JzARpnWiosGNjLKr0UJGraPlP9AowVO0octyHC_X3SiU1x_mWr4N89ixttkGVhjVPcP2FrIVRYYb4HX1jC";

    // Define the Spotify Connect device, getOAuthToken has an actual token
    // hardcoded for the sake of simplicity
    player = new Spotify.Player({
      name: "ArchLight Music",
      getOAuthToken: (cb) => cb(token),
      volume: 0.1,
    });

    player.addListener("initialization_error", ({ message }) => {
      console.error(message);
    });

    player.addListener("authentication_error", ({ message }) => {
      console.error(message);
    });

    player.addListener("account_error", ({ message }) => {
      console.error(message);
    });

    // Called when connected to the player created beforehand successfully
    player.addListener("ready", ({ device_id }) => {
      console.log("Ready with Device ID", device_id);
      const play = ({
        spotify_uri,
        playerInstance: {
          _options: { getOAuthToken },
        },
      }) => {
        getOAuthToken((access_token) => {
          fetch(
            `https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
            {
              method: "PUT",
              body: JSON.stringify({ uris: [spotify_uri] }),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
              },
            }
          );
        });
      };

      play({
        playerInstance: new Spotify.Player({ name: "ArcLight Music" }),
        spotify_uri: "spotify:track:7xGfFoTpQ2E7fRF5lN10tr",
      });
    });

    // Connect to the player created beforehand, this is equivalent to
    // creating a new device which will be visible for Spotify Connect
    player.connect().then((success) => {
      if (success) {
        console.log("The Web Playback SDK successfully connected to Spotify!");
      }
    });
  };
  const toggle = () => {
    player.togglePlay();
  };
  return (
    <>
      <button onClick={toggle}>Play/Pause</button>
    </>
  );
}

export default MusicPlayerTest;
