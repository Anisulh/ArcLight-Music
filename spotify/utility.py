from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from requests import post, put, get
from urllib.parse import quote
import environ

env = environ.Env()
environ.Env.read_env()
BASE_URL = "https://api.spotify.com/v1/me/"


def get_user_tokens(host):
    try:
        user_tokens = SpotifyToken.objects.get(user=host)
        print("get_user_tokens: tokens exist")
        return user_tokens
    except SpotifyToken.DoesNotExist:
        print("get_user_tokens: tokens do not exist")
        return None


def update_or_create_user_tokens(
    host, access_token, token_type, expires_in, refresh_token
):
    tokens = get_user_tokens(host)
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        print("update_or_create_user-tokens: tokens already exists")
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(
            update_fields=["access_token", "refresh_token", "expires_in", "token_type"]
        )
        print("update_or_create_user-tokens: tokens updated")
    else:
        print("update_or_create_user-tokens: tokens dont exists")
        tokens = SpotifyToken(
            user=host,
            access_token=access_token,
            refresh_token=refresh_token,
            token_type=token_type,
            expires_in=expires_in,
        )

        tokens.save()
        print("update_or_create_user-tokens: tokens created")


# checks if user has a token and if they do then refreshes it


def check_token_if_valid(host, respond=False):
    tokens = get_user_tokens(host)
    if tokens:
        print("check_token_if_valid: tokens exist")
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            print("check_token_if_valid: tokens expired")
            refresh_spotify_token(host)
            print("check_token_if_valid: tokens refreshed")
            if respond:
                token = get_user_tokens(host)
                return token.access_token
        if respond:
            token = get_user_tokens(host)
            return token.access_token
        return True
    print("check_token_if_valid: tokens dont exist")
    return False


def refresh_spotify_token(host):
    refresh_token = get_user_tokens(host).refresh_token
    print("refreshing tokens")
    response = post(
        "https://accounts.spotify.com/api/token",
        data={
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
            "client_id": env("CLIENT_ID"),
            "client_secret": env("CLIENT_SECRET"),
        },
    ).json()

    access_token = response.get("access_token")
    token_type = response.get("token_type")
    expires_in = response.get("expires_in")

    update_or_create_user_tokens(
        host, access_token, token_type, expires_in, refresh_token
    )


def execute_spotify_api_request(host, endpoint, post_=False, put_=False, url=BASE_URL):
    tokens = get_user_tokens(host)
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + tokens.access_token,
    }
    if post_:
        response = post(url + endpoint, headers=headers)
    elif put_:
        print("putting")
        response = put(url + endpoint, headers=headers)
    else:
        response = get(url + endpoint, {}, headers=headers)
    print("response:", response)
    try:
        return response.json()
    except:
        print("error")
        return {"Error": "Issue with request"}


def play_song(user):
    return execute_spotify_api_request(user, "player/play", put_=True)


def pause_song(user):
    return execute_spotify_api_request(user, "player/pause", put_=True)


def next_song(user):
    return execute_spotify_api_request(user, "player/next", post_=True)


def prev_song(user):
    return execute_spotify_api_request(user, "player/previous", post_=True)


def search_function(query, types, limit, host):
    formatted_query = quote(query)
    return execute_spotify_api_request(
        host,
        endpoint=f"?q={formatted_query}&type={types}&limit={limit}",
        url="https://api.spotify.com/v1/search",
    )
