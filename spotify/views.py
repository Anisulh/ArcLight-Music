from urllib.request import Request
from rest_framework.decorators import api_view
import environ
from requests import Request, post
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import redirect

from backend.models import Room

from .utility import (
    check_token_if_valid,
    next_song,
    pause_song,
    play_song,
    prev_song,
    search_function,
    set_track,
    update_or_create_user_tokens,
    transfer_play,
)

env = environ.Env()
environ.Env.read_env()
# Create your views here.

SCOPES = [
    # listening history
    "user-read-recently-played",
    "user-top-read",
    "user-read-playback-position",
    # spotify connect
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    # playback
    "app-remote-control",
    "streaming",
    # users
    "user-read-email",
    "user-read-private",
]


# URL: spotify/authenticate
# DATA: guest_id
# Checks if guest is authenticated and redirects them to AuthURL if they aren't
@api_view(["POST"])
def IsAuthenticated(request, format=None):
    if request.method == "POST":
        guest_id = request.data.get("guest_id")
        print("guest_id:", guest_id)
        # store guest_id in sessions if not already there
        if "guest_id" not in request.session:
            print("creating session")
            request.session["guest_id"] = guest_id
            print("session created")

        is_authenticated = check_token_if_valid(guest_id)

        if not is_authenticated:
            print("user not authenticated")
            print("redirecting to /spotify/auth-url")
            return redirect("auth_url")
        else:
            print("user authenticated, sending status")
            return Response({"status": is_authenticated}, status=status.HTTP_200_OK)


# URL: spotify/auth-url
# Creates a spotify authorization url and sends it as a response to the client to authorize


@api_view(["GET"])
def AuthUrl(request):
    scopes = " ".join(SCOPES)
    url = (
        Request(
            "GET",
            "https://accounts.spotify.com/authorize",
            params={
                "scope": scopes,
                "response_type": "code",
                "redirect_uri": env("REDIRECT_URI"),
                "client_id": env("CLIENT_ID"),
            },
        )
        .prepare()
        .url
    )
    print("AuthUrl: returning url to client")
    return Response({"url": url}, status=status.HTTP_200_OK)


# URL: spotify/redirect
# called by spotify api with token reponse. The tokens are then saved in session.
# The GET request is redirected to the client redirect page which then sends a POST request back to use the response in session and save the tokens in the spotify model


@api_view(["GET", "POST"])
def spotify_callback(request, format=None):
    if request.method == "GET":
        code = request.GET.get("code")
        response = post(
            "https://accounts.spotify.com/api/token",
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": env("REDIRECT_URI"),
                "client_id": env("CLIENT_ID"),
                "client_secret": env("CLIENT_SECRET"),
            },
        ).json()
        request.session["response"] = response
        request.session.modified = True
        return redirect("http://127.0.0.1:5173/redirect")

    if request.method == "POST":
        response = request.session.get("response")
        print("response:", response)
        access_token = response.get("access_token")
        token_type = response.get("token_type")
        refresh_token = response.get("refresh_token")
        expires_in = response.get("expires_in")
        guest_id = request.data.get("guest_id")
        print("updating or creating tokens:")
        update_or_create_user_tokens(
            guest_id, access_token, token_type, expires_in, refresh_token
        )
        return Response({"success": True}, status=status.HTTP_201_CREATED)


# URL: spotify/pause
# DATA: room_code, guest_id
# sends a request to spotify api to pause music
@api_view(["PUT"])
def PauseSong(request, format=None):
    room_code = request.data.get("room_code")
    guest_id = request.data.get("guest_id")
    if not room_code or guest_id:
        return Response({"error": "data was not sent to server"})
    try:
        room = Room.objects.get(code=room_code)
    except Room.DoesNotExist:
        return Response({"error": "room not found"}, status=status.HTTP_404_NOT_FOUND)
    if guest_id == room.host_id or room.guest_controller:
        pause_song(room.host_id)
        return Response({}, status=status.HTTP_204_NO_CONTENT)

    return Response({}, status=status.HTTP_403_FORBIDDEN)


# URL: spotify/play
# DATA: room_code, guest_id
# sends a request to spotify api to play music
@api_view(["PUT"])
def resumeSong(request, format=None):
    room_code = request.data.get("room_code")
    guest_id = request.data.get("guest_id")
    if not room_code or guest_id:
        return Response({"error": "data was not sent to server"})
    try:
        room = Room.objects.get(code=room_code)
    except Room.DoesNotExist:
        return Response({"error": "room not found"}, status=status.HTTP_404_NOT_FOUND)
    if guest_id == room.host_id or room.guest_controller:
        play_song(room.host_id)
        return Response({}, status=status.HTTP_204_NO_CONTENT)

    return Response({}, status=status.HTTP_403_FORBIDDEN)


# URL: spotify/next
# DATA: room_code, guest_id
# sends a request to spotify api to play the next song
@api_view(["POST"])
def NextSong(request, format=None):
    room_code = request.data.get("room_code")
    guest_id = request.data.get("guest_id")
    if not room_code or guest_id:
        return Response({"error": "data was not sent to server"})
    try:
        room = Room.objects.get(code=room_code)
    except Room.DoesNotExist:
        return Response({"error": "room not found"}, status=status.HTTP_404_NOT_FOUND)
    if guest_id == room.host_id or room.guest_controller:
        next_song(room.host_id)
        return Response({}, status.HTTP_204_NO_CONTENT)
    return Response({}, status.HTTP_403_FORBIDDEN)


# URL: spotify/prev
# DATA: room_code, guest_id
# sends a request to spotify api to play the previous song
@api_view(["POST"])
def PrevSong(request, format=None):
    room_code = request.data.get("room_code")
    guest_id = request.data.get("guest_id")
    if not room_code or guest_id:
        return Response({"error": "data was not sent to server"})
    try:
        room = Room.objects.get(code=room_code)
    except Room.DoesNotExist:
        return Response({"error": "room not found"}, status=status.HTTP_404_NOT_FOUND)
    if guest_id == room.host_id or room.guest_controller:
        prev_song(room.host_id)
        return Response({}, status.HTTP_204_NO_CONTENT)
    return Response({}, status.HTTP_403_FORBIDDEN)


@api_view(["POST"])
def Search(request, format=None):
    host_id = request.data.get("host_id")
    query = request.data.get("query")
    types = request.data.get("type")
    limit = 20
    if host_id and query and types:
        response = search_function(query, types, limit, host_id)
        if "error" in response:
            return Response({}, status=status.HTTP_400_BAD_REQUEST)
        return Response(response, status=status.HTTP_200_OK)
    print("a field was empty")
    return Response({"error: bad request"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def GetSpotifyToken(request, format=None):
    guest_id = request.session.get("guest_id")
    access_token = check_token_if_valid(guest_id, respond=True)
    return Response({"access_token": access_token})


# URL: spotify/set-track
# DATA: guest_id, uri, position
# sends a request to spotify api to play specific song at specific position
@api_view(["PUT"])
def setTrack(request, format=None):
    guest_id = request.data.get("guest_id")
    uri = request.data.get("uri")
    position = request.data.get("position")
    if guest_id and uri:
        print("setting track")
        response = set_track(guest_id, uri, position)
        if "error" in response:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response({},status=status.HTTP_204_NO_CONTENT)
    return Response(status=status.HTTP_400_BAD_REQUEST)


# URL: spotify/transfer
# DATA: guest_id, device_id
# sends a request to spotify api to transfer the playback
@api_view(["PUT"])
def transferPlay(request, format=None):
    device_id = request.data.get("device_id")
    guest_id = request.data.get("guest_id")
    if device_id and guest_id:
        response = transfer_play(guest_id, device_id)
        if "error" in response:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(
        {"error": "no device or guest id given"}, status=status.HTTP_400_BAD_REQUEST
    )


# URL: spotify/play
# DATA: room_code, guest_id
# sends a request to spotify api to play music
@api_view(["PUT"])
def setSong(request, format=None):
    room_code = request.data.get("room_code")
    guest_id = request.data.get("guest_id")
    if not room_code or guest_id:
        return Response({"error": "data was not sent to server"})
    try:
        room = Room.objects.get(code=room_code)
    except Room.DoesNotExist:
        return Response({"error": "room not found"}, status=status.HTTP_404_NOT_FOUND)
    if guest_id == room.host_id or room.guest_controller:
        play_song(room.host_id)
        return Response({}, status=status.HTTP_204_NO_CONTENT)

    return Response({}, status=status.HTTP_403_FORBIDDEN)
